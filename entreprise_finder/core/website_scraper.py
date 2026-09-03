"""
Étape 4b (priorité sur le pattern-guessing) : chercher si une adresse email du
dirigeant apparaît déjà en clair sur le site de l'entreprise (page contact,
mentions légales, équipe, actualités/presse) ou dans les résultats de recherche
web indexés (snippets Google/Bing qui affichent parfois des emails de contact).

Un email trouvé "en clair" a une fiabilité bien supérieure à un pattern deviné.
"""
import re
import requests
from unidecode import unidecode
import config
from core.web_search import recherche_web

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

PAGES_A_TESTER = [
    "", "contact", "contact-us", "contactez-nous", "mentions-legales",
    "mentions-legales-du-site", "a-propos", "about", "equipe", "team",
    "qui-sommes-nous", "presse", "press",
]


def _fetch(url: str) -> str:
    try:
        resp = requests.get(
            url, timeout=config.REQUEST_TIMEOUT,
            headers={"User-Agent": config.USER_AGENT},
        )
        if resp.status_code == 200:
            return resp.text
    except requests.RequestException:
        pass
    return ""


def _score_pertinence(email: str, prenom: str, nom: str) -> int:
    """Un email qui contient le prénom/nom de la personne est bien plus pertinent
    qu'une adresse générique (contact@, info@) trouvée sur la même page."""
    local = email.split("@")[0].lower()
    p, n = unidecode(prenom).lower(), unidecode(nom).lower()
    score = 0
    if p in local:
        score += 2
    if n in local:
        score += 2
    if local in ("contact", "info", "hello", "bonjour", "accueil"):
        score -= 3
    return score


def chercher_email_sur_site(domaine: str, prenom: str, nom: str) -> dict:
    """Retourne {"email": str|None, "source_url": str|None, "confiance": ...}"""
    if not domaine:
        return {"email": None, "source_url": None, "confiance": "faible"}

    trouves = []  # (email, url, score)
    for chemin in PAGES_A_TESTER:
        for scheme in ("https://", "http://"):
            url = f"{scheme}{domaine}/{chemin}".rstrip("/")
            html = _fetch(url)
            if not html:
                continue
            for email in set(EMAIL_REGEX.findall(html)):
                if domaine.split(".")[-2] in email.lower() or domaine in email.lower():
                    trouves.append((email, url, _score_pertinence(email, prenom, nom)))
            break  # https a marché, pas besoin de tester http

    if not trouves:
        return {"email": None, "source_url": None, "confiance": "faible"}

    trouves.sort(key=lambda t: t[2], reverse=True)
    meilleur_email, meilleur_url, meilleur_score = trouves[0]
    confiance = "haute" if meilleur_score >= 4 else "moyenne"
    return {"email": meilleur_email, "source_url": meilleur_url, "confiance": confiance}
