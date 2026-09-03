"""
Interface web locale (remplace la ligne de commande).

Lancement :  python app.py
Puis ouvrir : http://127.0.0.1:5000 dans un navigateur.

Architecture : Flask sert la page HTML + une API interne. Les résultats sont
streamés en direct au navigateur via Server-Sent Events (SSE), pour afficher
la progression de l'enquête en temps réel (comme le mode --verbose du CLI).

Pourquoi pas un simple fichier HTML autonome ? Parce que l'API SIREN, la
recherche web et surtout la vérification SMTP ne peuvent pas être appelées
depuis le JavaScript d'un navigateur (blocages CORS + SMTP techniquement
impossible en JS navigateur). Il faut un petit serveur derrière — c'est
l'architecture standard de tout logiciel de ce type.
"""
import csv
import io
import json
import queue
import threading
import uuid
from dataclasses import asdict

from flask import Flask, render_template, request, Response, jsonify

import config
from core.pipeline import enqueter

app = Flask(__name__)

# Stockage en mémoire des jobs batch en cours (suffisant pour un usage local mono-utilisateur)
BATCH_JOBS = {}


@app.route("/")
def index():
    return render_template("index.html", ia_active=config.USE_AI)


def _sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@app.route("/api/stream")
def stream_unitaire():
    """SSE : enquête sur un seul SIREN, avec les logs d'étapes en direct."""
    siren = request.args.get("siren", "").strip()

    def generer():
        if not siren:
            yield _sse_event("erreur", {"message": "SIREN manquant"})
            return

        log_queue = queue.Queue()

        def callback(msg):
            log_queue.put(msg)

        resultat_container = {}

        def travail():
            try:
                resultat_container["resultat"] = enqueter(siren, verbose_callback=callback)
            except Exception as e:
                resultat_container["erreur"] = str(e)
            finally:
                log_queue.put(None)  # sentinelle de fin

        thread = threading.Thread(target=travail)
        thread.start()

        while True:
            msg = log_queue.get()
            if msg is None:
                break
            yield _sse_event("log", {"message": msg})

        thread.join()

        if "erreur" in resultat_container:
            yield _sse_event("erreur", {"message": resultat_container["erreur"]})
        else:
            yield _sse_event("resultat", asdict(resultat_container["resultat"]))

    return Response(generer(), mimetype="text/event-stream")


@app.route("/api/batch/upload", methods=["POST"])
def batch_upload():
    """Reçoit un CSV (colonne 'siren'), démarre le traitement en arrière-plan,
    renvoie un job_id à utiliser pour ouvrir le flux SSE de suivi."""
    fichier = request.files.get("fichier")
    if not fichier:
        return jsonify({"erreur": "aucun fichier reçu"}), 400

    contenu = fichier.stream.read().decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(contenu))
    colonne_siren = None
    for col in reader.fieldnames or []:
        if col.strip().lower() in ("siren", "numero_siren", "num_siren"):
            colonne_siren = col
            break
    if not colonne_siren:
        return jsonify({"erreur": "aucune colonne 'siren' trouvée dans le CSV"}), 400

    sirens = [row[colonne_siren].strip() for row in reader if row.get(colonne_siren, "").strip()]
    if not sirens:
        return jsonify({"erreur": "aucun SIREN valide trouvé dans le fichier"}), 400

    job_id = str(uuid.uuid4())
    job_queue = queue.Queue()
    BATCH_JOBS[job_id] = job_queue

    def travail_batch():
        from concurrent.futures import ThreadPoolExecutor, as_completed
        with ThreadPoolExecutor(max_workers=config.MAX_WORKERS) as executor:
            futures = {executor.submit(enqueter, s): s for s in sirens}
            for future in as_completed(futures):
                siren = futures[future]
                try:
                    resultat = future.result()
                    job_queue.put(("resultat", asdict(resultat)))
                except Exception as e:
                    job_queue.put(("erreur_ligne", {"siren": siren, "message": str(e)}))
        job_queue.put(("termine", {"total": len(sirens)}))

    threading.Thread(target=travail_batch, daemon=True).start()
    return jsonify({"job_id": job_id, "total": len(sirens)})


@app.route("/api/batch/stream/<job_id>")
def batch_stream(job_id):
    job_queue = BATCH_JOBS.get(job_id)
    if job_queue is None:
        return Response(_sse_event("erreur", {"message": "job inconnu"}), mimetype="text/event-stream")

    def generer():
        while True:
            event, data = job_queue.get()
            yield _sse_event(event, data)
            if event == "termine":
                break
        BATCH_JOBS.pop(job_id, None)

    return Response(generer(), mimetype="text/event-stream")


if __name__ == "__main__":
    print("\n  Interface disponible sur : http://127.0.0.1:5000\n")
    app.run(debug=True, port=5000, threaded=True)
