"""
Génère un rapport HTML "institutionnel" (sobre, corporate, imprimable) à partir
d'une liste de ResultatEnquete. Un seul fichier autonome, sans dépendance externe
au chargement (pas de CDN), ouvrable dans n'importe quel navigateur.
"""
from datetime import datetime

COULEURS = {
    "vert": "#1e7e34",
    "orange": "#b8860b",
    "rouge": "#a83232",
}
FONDS = {
    "vert": "#e9f7ef",
    "orange": "#fdf3e3",
    "rouge": "#fbeaea",
}

TEMPLATE_HAUT = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport d'enquête — Enrichissement contacts entreprises</title>
<style>
  :root {{
    --bleu-nuit: #0f2540;
    --bleu-acier: #1c3d5f;
    --gris-fond: #f4f6f8;
    --gris-bordure: #d9dee3;
    --texte: #1f2933;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: 'Georgia', 'Times New Roman', serif;
    background: var(--gris-fond);
    color: var(--texte);
    margin: 0;
    padding: 0;
  }}
  header {{
    background: linear-gradient(135deg, var(--bleu-nuit), var(--bleu-acier));
    color: #fff;
    padding: 36px 48px;
  }}
  header h1 {{
    margin: 0 0 6px 0;
    font-size: 26px;
    letter-spacing: 0.5px;
    font-weight: 600;
  }}
  header p {{
    margin: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 13px;
    opacity: 0.85;
  }}
  main {{
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 48px 64px 48px;
  }}
  .fiche {{
    background: #fff;
    border: 1px solid var(--gris-bordure);
    border-left: 5px solid var(--bleu-acier);
    border-radius: 4px;
    padding: 24px 28px;
    margin-bottom: 22px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }}
  .fiche h2 {{
    margin: 0 0 4px 0;
    font-size: 19px;
    color: var(--bleu-nuit);
  }}
  .siren {{
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px;
    color: #6b7684;
    margin-bottom: 16px;
    letter-spacing: 0.3px;
  }}
  table.champs {{
    width: 100%;
    border-collapse: collapse;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
  }}
  table.champs td {{
    padding: 8px 6px;
    vertical-align: top;
    border-top: 1px solid #eef0f2;
  }}
  td.label {{
    width: 160px;
    color: #6b7684;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }}
  .badge {{
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-left: 8px;
  }}
  .detail {{
    display: block;
    font-size: 12px;
    color: #6b7684;
    margin-top: 2px;
  }}
  a {{ color: var(--bleu-acier); text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
  .erreur {{
    color: #a83232;
    font-style: italic;
  }}
  footer {{
    text-align: center;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 11px;
    color: #98a2ad;
    padding: 24px;
  }}
</style>
</head>
<body>
<header>
  <h1>Rapport d'enquête — Enrichissement de contacts</h1>
  <p>Généré le {date} — {nb} entreprise(s) traitée(s)</p>
</header>
<main>
"""

TEMPLATE_BAS = """
</main>
<footer>
  Document généré automatiquement à partir de sources publiques (API Recherche d'entreprises, recherche web, vérification technique des adresses email).
  Les niveaux de fiabilité indiqués sont des indicateurs et ne remplacent pas une vérification manuelle sur les dossiers sensibles.
</footer>
</body>
</html>
"""


def _badge(score: dict) -> str:
    niveau = score.get("niveau", "rouge")
    couleur, fond = COULEURS.get(niveau, "#888"), FONDS.get(niveau, "#eee")
    return (f'<span class="badge" style="color:{couleur};background:{fond};">'
            f'{niveau.upper()}</span>')


def generer_html(resultats: list, chemin_sortie: str = "rapport.html"):
    date = datetime.now().strftime("%d/%m/%Y à %H:%M")
    html = TEMPLATE_HAUT.format(date=date, nb=len(resultats))

    for r in resultats:
        html += '<div class="fiche">\n'
        html += f"<h2>{r.entreprise or 'Entreprise inconnue'}</h2>\n"
        html += f'<div class="siren">SIREN : {r.siren}</div>\n'

        if r.erreur:
            html += f'<p class="erreur">⚠ {r.erreur}</p>\n'
        else:
            email_badge = _badge(r.email_score)
            linkedin_badge = _badge(r.linkedin_score)
            email_html = (f'<a href="mailto:{r.email}">{r.email}</a>' if r.email else "—")
            linkedin_html = (f'<a href="{r.linkedin}" target="_blank">{r.linkedin}</a>'
                              if r.linkedin else "—")

            html += '<table class="champs">\n'
            html += (f'<tr><td class="label">Dirigeant</td>'
                     f'<td>{r.prenom} {r.nom} <span class="detail">{r.qualite}</span></td></tr>\n')
            html += (f'<tr><td class="label">Email</td>'
                     f'<td>{email_html} {email_badge}'
                     f'<span class="detail">{r.email_score.get("label", "")}</span></td></tr>\n')
            html += (f'<tr><td class="label">LinkedIn</td>'
                     f'<td>{linkedin_html} {linkedin_badge}'
                     f'<span class="detail">{r.linkedin_score.get("label", "")}</span></td></tr>\n')
            html += '</table>\n'

        html += '</div>\n'

    html += TEMPLATE_BAS
    with open(chemin_sortie, "w", encoding="utf-8") as f:
        f.write(html)
    return chemin_sortie
