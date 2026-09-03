"""
Étape 4a (fallback) : générer les patterns d'emails les plus courants en France
quand aucune adresse n'a été trouvée "en clair" sur le web.
"""
from unidecode import unidecode


def _norm(s: str) -> str:
    return unidecode(s).lower().strip().replace(" ", "").replace("-", "")


def generer_patterns(prenom: str, nom: str, domaine: str) -> list:
    """Retourne une liste ordonnée (du plus probable au moins probable) d'adresses candidates."""
    p, n = _norm(prenom), _norm(nom)
    if not p or not n or not domaine:
        return []

    patterns = [
        f"{p}.{n}@{domaine}",       # jean.dupont@ (le plus courant en France)
        f"{p[0]}{n}@{domaine}",     # jdupont@
        f"{p}@{domaine}",           # jean@
        f"{n}@{domaine}",           # dupont@
        f"{p}-{n}@{domaine}",       # jean-dupont@
        f"{p}_{n}@{domaine}",       # jean_dupont@
        f"{n}.{p}@{domaine}",       # dupont.jean@
        f"{p[0]}.{n}@{domaine}",    # j.dupont@
        f"{n}{p[0]}@{domaine}",     # dupontj@
        f"{p}{n}@{domaine}",        # jeandupont@
    ]
    # dédoublonnage en gardant l'ordre
    vu = set()
    resultat = []
    for addr in patterns:
        if addr not in vu:
            vu.add(addr)
            resultat.append(addr)
    return resultat
