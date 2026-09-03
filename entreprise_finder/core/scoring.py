"""
Étape 6 : synthétiser toutes les vérifications en un seul indicateur de fiabilité,
avec code couleur, pour l'email ET pour le LinkedIn.

Code couleur :
  VERT   -> fiable, tu peux l'utiliser directement
  ORANGE -> probable, à utiliser avec prudence (ou à revérifier manuellement)
  ROUGE  -> faible / non vérifié, ne pas utiliser tel quel
"""

VERT = "vert"
ORANGE = "orange"
ROUGE = "rouge"


def score_email(email_info: dict, trouve_en_clair: bool, verif: dict) -> dict:
    """
    email_info: {"confiance": "haute"/"moyenne"/"faible"} venant du scraper ou generator
    trouve_en_clair: True si l'adresse a été trouvée écrite sur le web (pas devinée)
    verif: résultat de email_verifier.verifier_email()
    """
    statut = verif.get("statut")
    catch_all = verif.get("catch_all", False)

    if statut == "invalide":
        return {"niveau": ROUGE, "label": "Email rejeté par le serveur — ne pas utiliser"}

    if statut == "valide" and not catch_all:
        if trouve_en_clair:
            return {"niveau": VERT, "label": "Trouvé en clair + confirmé actif par le serveur mail"}
        return {"niveau": VERT, "label": "Pattern deviné mais confirmé actif par le serveur mail"}

    if statut == "valide" and catch_all:
        if trouve_en_clair:
            return {"niveau": ORANGE, "label": "Trouvé en clair, mais domaine catch-all (vérification serveur non concluante)"}
        return {"niveau": ORANGE, "label": "Pattern probable, mais domaine catch-all (non confirmable techniquement)"}

    if statut in ("port_bloque", "inconnu"):
        if trouve_en_clair:
            return {"niveau": ORANGE, "label": "Trouvé en clair sur le web, vérification technique impossible/incertaine"}
        return {"niveau": ROUGE, "label": "Pattern deviné, vérification technique impossible — à confirmer manuellement"}

    return {"niveau": ROUGE, "label": "Statut indéterminé"}


def score_linkedin(linkedin_info: dict) -> dict:
    confiance = linkedin_info.get("confiance", "faible")
    mapping = {
        "haute": (VERT, "Nom et entreprise confirmés"),
        "moyenne": (ORANGE, "Nom confirmé, entreprise non certaine — vérifier manuellement"),
        "faible": (ROUGE, "Profil non trouvé avec certitude"),
    }
    niveau, label = mapping.get(confiance, (ROUGE, "Non trouvé"))
    return {"niveau": niveau, "label": label}
