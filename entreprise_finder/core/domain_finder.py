"""
Étape 2 : trouver le nom de domaine officiel de l'entreprise.

Stratégie "enquête" :
1. Si l'API SIREN a déjà un site_web déclaré -> on le prend (fiabilité max)
2. Sinon on cherche "<dénomination> <ville> site officiel" et on prend le premier
   résultat dont le domaine n'est pas un annuaire/réseau social connu.
"""
import re
from urllib.parse import urlparse
import config
from core.web_search import recherche_web


def _domaine_valide(url: str) -> bool:
    try:
        netloc = urlparse(url).netloc.lower().replace("www.", "")
    except Exception:
        return False
    if not netloc:
        return False
    return not any(exclu in netloc for exclu in config.DOMAINES_EXCLUS)


def trouver_domaine(denomination: str, site_declare: str = None, ville: str = "") -> dict:
    """Retourne {"domaine": str|None, "source": str, "confiance": "haute"|"moyenne"|"faible"}"""
    if site_declare:
        domaine = urlparse(site_declare).netloc.replace("www.", "") or site_declare
        return {"domaine": domaine, "source": "déclaré (API SIREN)", "confiance": "haute"}

    query = f'"{denomination}" {ville} site officiel'.strip()
    resultats = recherche_web(query, max_resultats=6)

    for r in resultats:
        if _domaine_valide(r["url"]):
            netloc = urlparse(r["url"]).netloc.replace("www.", "")
            return {"domaine": netloc, "source": f"recherche web ({r['url']})", "confiance": "moyenne"}

    return {"domaine": None, "source": None, "confiance": "faible"}
