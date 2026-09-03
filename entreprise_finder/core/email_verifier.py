"""
Étape 5 : vérifier qu'une adresse email est active, SANS jamais envoyer de mail réel.

Méthode :
1. DNS : le domaine a-t-il des enregistrements MX ? (sinon, aucune adresse @domaine
   ne peut jamais recevoir de mail -> inutile d'aller plus loin)
2. SMTP handshake : on se connecte au serveur mail, on simule un envoi jusqu'à
   l'étape "RCPT TO: <adresse>" et on lit le code retour, PUIS on raccroche sans
   envoyer le corps du mail (commande QUIT). C'est la méthode standard utilisée
   par tous les outils du marché (Hunter, Dropcontact, etc.) et par l'outil open
   source Reacher (https://github.com/reacherhq/check-if-email-exists).
3. Détection "catch-all" : certains serveurs acceptent TOUTES les adresses du
   domaine (donc le test ci-dessus ne prouve plus rien). On teste une adresse
   aléatoire bidon sur le même domaine ; si elle est aussi acceptée, le domaine
   est catch-all et on redescend la confiance de l'adresse réelle testée.

LIMITE IMPORTANTE : cette méthode nécessite le port 25 sortant. La plupart des
box FAI grand public et de nombreux hébergeurs cloud le bloquent par défaut
(anti-spam). Si c'est ton cas, `verifier_email()` retournera le statut
"port_bloque" -> configure FALLBACK_VERIFY_API_URL dans .env (API tierce), ou
héberge ce script sur un VPS qui autorise le port 25 sortant (ex: certains
OVH/Scaleway le permettent sur demande).
"""
import random
import smtplib
import socket
import string
import dns.resolver
import requests
import config


def _get_mx(domaine: str):
    try:
        answers = dns.resolver.resolve(domaine, "MX", lifetime=6)
        mx_hosts = sorted(
            [(r.preference, str(r.exchange).rstrip(".")) for r in answers],
            key=lambda x: x[0],
        )
        return [h for _, h in mx_hosts]
    except Exception:
        return []


def _smtp_check(mx_host: str, email: str) -> str:
    """Retourne 'valide', 'invalide', 'inconnu', ou 'port_bloque'."""
    try:
        server = smtplib.SMTP(timeout=config.SMTP_TIMEOUT)
        server.connect(mx_host, 25)
        server.helo(config.SMTP_HELO_DOMAIN)
        server.mail(config.SMTP_FROM_ADDRESS)
        code, _ = server.rcpt(email)
        server.quit()
        if code == 250:
            return "valide"
        if code in (550, 551, 553):
            return "invalide"
        return "inconnu"  # greylisting, 4xx temporaire, etc.
    except (socket.timeout, ConnectionRefusedError, OSError):
        return "port_bloque"
    except smtplib.SMTPServerDisconnected:
        return "inconnu"
    except Exception:
        return "inconnu"


def _fallback_api_check(email: str) -> str:
    if not config.FALLBACK_VERIFY_API_URL:
        return "inconnu"
    try:
        resp = requests.get(
            config.FALLBACK_VERIFY_API_URL,
            params={"email": email, "api_key": config.FALLBACK_VERIFY_API_KEY},
            timeout=config.REQUEST_TIMEOUT,
        )
        data = resp.json()
        # NOTE: adapte ce mapping au format de l'API tierce que tu choisis.
        if data.get("valid") is True or data.get("status") == "valid":
            return "valide"
        if data.get("valid") is False or data.get("status") == "invalid":
            return "invalide"
        return "inconnu"
    except Exception:
        return "inconnu"


def verifier_email(email: str) -> dict:
    """Retourne un dict complet avec statut + détection catch-all."""
    domaine = email.split("@")[-1]
    mx_list = _get_mx(domaine)

    if not mx_list:
        return {"email": email, "statut": "invalide", "raison": "aucun enregistrement MX", "catch_all": False}

    mx_host = mx_list[0]
    statut = _smtp_check(mx_host, email)

    if statut == "port_bloque":
        statut_fallback = _fallback_api_check(email)
        return {
            "email": email,
            "statut": statut_fallback if statut_fallback != "inconnu" else "port_bloque",
            "raison": "port 25 bloqué localement" + (
                " — vérifié via API fallback" if statut_fallback != "inconnu" else " — configure FALLBACK_VERIFY_API_URL dans .env"
            ),
            "catch_all": False,
        }

    catch_all = False
    if statut == "valide":
        faux_local = "".join(random.choices(string.ascii_lowercase, k=16))
        faux_email = f"{faux_local}@{domaine}"
        statut_faux = _smtp_check(mx_host, faux_email)
        catch_all = statut_faux == "valide"

    return {"email": email, "statut": statut, "raison": "", "catch_all": catch_all}
