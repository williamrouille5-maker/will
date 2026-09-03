"""
Étape 3 : retrouver le profil LinkedIn public d'un dirigeant.

Important : on ne scrape JAMAIS linkedin.com directement (bloqué techniquement
par leur anti-bot + interdit par leurs CGU). On passe uniquement par un moteur
de recherche pour localiser l'URL publique du profil (comme le ferait un humain
qui tape le nom dans Google) : c'est de la recherche d'information publique,
pas de l'extraction automatisée de la plateforme elle-même.
"""
import re
from core.web_search import recherche_web


def trouver_linkedin(prenom: str, nom: str, denomination: str) -> dict:
    """Retourne {"url": str|None, "confiance": "haute"|"moyenne"|"faible", "detail": str}"""
    query = f'"{prenom} {nom}" "{denomination}" site:linkedin.com/in'
    resultats = recherche_web(query, max_resultats=5)

    candidats = [r for r in resultats if "linkedin.com/in/" in r["url"]]

    if not candidats:
        # Recherche élargie sans l'entreprise en critère strict
        query2 = f'"{prenom} {nom}" linkedin {denomination}'
        resultats2 = recherche_web(query2, max_resultats=5)
        candidats = [r for r in resultats2 if "linkedin.com/in/" in r["url"]]

    if not candidats:
        return {"url": None, "confiance": "faible", "detail": "aucun profil trouvé"}

    meilleur = candidats[0]
    titre = meilleur["title"].lower()
    snippet = meilleur.get("snippet", "").lower()
    nom_ok = prenom.lower() in titre and nom.lower() in titre
    entreprise_ok = denomination.lower()[:12] in (titre + " " + snippet)

    if nom_ok and entreprise_ok:
        confiance = "haute"
    elif nom_ok:
        confiance = "moyenne"
    else:
        confiance = "faible"

    url_propre = re.sub(r"\?.*$", "", meilleur["url"])
    return {"url": url_propre, "confiance": confiance, "detail": meilleur["title"]}
