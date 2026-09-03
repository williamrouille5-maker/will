"""
Orchestrateur principal : enchaîne toutes les étapes pour un SIREN donné,
avec la logique "enquête" demandée :

1. Récupérer entreprise + dirigeants (API officielle)
2. Trouver le domaine web de l'entreprise
3. Chercher le LinkedIn du dirigeant choisi
4. Chercher un email déjà en clair sur le web (priorité : c'est plus fiable
   qu'un pattern deviné)
5. Si rien trouvé -> générer des patterns et les tester un par un jusqu'à en
   trouver un valide (ou épuiser la liste)
6. Vérifier systématiquement chaque email candidat (SMTP + catch-all)
7. Si plusieurs emails valides -> priorité PRO puis PERSO (règle + IA sur cas ambigus)
8. Scorer et coder-couleur chaque information
"""
from dataclasses import dataclass, field
from typing import Optional

from core.siren_lookup import rechercher_par_siren
from core.domain_finder import trouver_domaine
from core.linkedin_finder import trouver_linkedin
from core.website_scraper import chercher_email_sur_site
from core.email_generator import generer_patterns
from core.email_verifier import verifier_email
from core.ai_assistant import choisir_meilleur_dirigeant, choisir_meilleur_email
from core.scoring import score_email, score_linkedin


@dataclass
class ResultatEnquete:
    siren: str
    entreprise: str = ""
    prenom: str = ""
    nom: str = ""
    qualite: str = ""
    email: Optional[str] = None
    email_score: dict = field(default_factory=dict)
    email_details: str = ""
    linkedin: Optional[str] = None
    linkedin_score: dict = field(default_factory=dict)
    erreur: Optional[str] = None


def _classer_pro_perso(email: str, domaine_entreprise: str) -> str:
    if domaine_entreprise and domaine_entreprise in email:
        return "pro"
    domaines_perso = ("gmail.", "yahoo.", "hotmail.", "outlook.", "orange.fr",
                       "free.fr", "laposte.net", "icloud.", "wanadoo.fr", "sfr.fr")
    if any(d in email for d in domaines_perso):
        return "perso"
    return "inconnu"


def enqueter(siren: str, debug: bool = False, verbose_callback=None) -> ResultatEnquete:
    """Point d'entrée unique. verbose_callback(str) permet d'afficher la progression en live."""

    def log(msg):
        if verbose_callback:
            verbose_callback(msg)

    resultat = ResultatEnquete(siren=siren)

    # --- 1. Entreprise + dirigeants ---
    log("Recherche des informations légales (SIREN)...")
    try:
        entreprise = rechercher_par_siren(siren, debug=debug)
    except Exception as e:
        resultat.erreur = f"Erreur lors de l'appel à l'API SIREN : {e}"
        return resultat
    if entreprise is None:
        resultat.erreur = "SIREN introuvable dans la base officielle"
        return resultat
    resultat.entreprise = entreprise.denomination

    if not entreprise.dirigeants:
        resultat.erreur = "Aucun dirigeant déclaré trouvé pour cette entreprise"
        return resultat

    dirigeant = choisir_meilleur_dirigeant(
        [{"prenom": d.prenom, "nom": d.nom, "qualite": d.qualite} for d in entreprise.dirigeants],
        entreprise.denomination,
    )
    resultat.prenom, resultat.nom = dirigeant.get("prenom", ""), dirigeant.get("nom", "")
    resultat.qualite = dirigeant.get("qualite", "")
    log(f"Dirigeant ciblé : {resultat.prenom} {resultat.nom} ({resultat.qualite})")

    # --- 2. Domaine web ---
    log("Recherche du site web officiel...")
    ville = ""
    if entreprise.adresse:
        ville = entreprise.adresse.split()[-1] if entreprise.adresse else ""
    domaine_info = trouver_domaine(entreprise.denomination, entreprise.site_web_declare, ville)
    domaine = domaine_info["domaine"]
    log(f"Domaine trouvé : {domaine or 'aucun'} (source: {domaine_info['source']})")

    # --- 3. LinkedIn ---
    log("Recherche du profil LinkedIn...")
    linkedin_info = trouver_linkedin(resultat.prenom, resultat.nom, entreprise.denomination)
    resultat.linkedin = linkedin_info["url"]
    resultat.linkedin_score = score_linkedin(linkedin_info)

    # --- 4. Email trouvé en clair sur le web ---
    candidats = []  # liste de dicts {email, type, statut, source, trouve_en_clair}
    if domaine:
        log("Recherche d'un email déjà publié sur le site de l'entreprise...")
        trouve = chercher_email_sur_site(domaine, resultat.prenom, resultat.nom)
        if trouve["email"]:
            log(f"Email trouvé en clair : {trouve['email']} — vérification en cours...")
            verif = verifier_email(trouve["email"])
            candidats.append({
                "email": trouve["email"],
                "type": _classer_pro_perso(trouve["email"], domaine),
                "statut": verif["statut"],
                "verif": verif,
                "trouve_en_clair": True,
                "source": trouve["source_url"],
            })

    # --- 5. Fallback : patterns générés, testés un par un ---
    if domaine and not any(c["statut"] == "valide" for c in candidats):
        log("Aucun email confirmé trouvé en clair — test de patterns probables...")
        for pattern in generer_patterns(resultat.prenom, resultat.nom, domaine):
            verif = verifier_email(pattern)
            log(f"  Test {pattern} -> {verif['statut']}")
            candidats.append({
                "email": pattern,
                "type": "pro",
                "statut": verif["statut"],
                "verif": verif,
                "trouve_en_clair": False,
                "source": "pattern deviné",
            })
            if verif["statut"] == "valide" and not verif.get("catch_all"):
                break  # on a trouvé un pattern confirmé net, pas besoin de tester le reste

    if not candidats:
        resultat.email_details = "Aucun email candidat n'a pu être établi (domaine introuvable)."
        resultat.email_score = {"niveau": "rouge", "label": "Aucune donnée"}
        return resultat

    # --- 6. Choix final : priorité PRO > PERSO parmi les valides ---
    meilleur = choisir_meilleur_email(candidats, resultat.prenom, resultat.nom, entreprise.denomination)
    resultat.email = meilleur.get("email")
    resultat.email_details = meilleur.get("source", "")
    resultat.email_score = score_email(
        {"confiance": "haute" if meilleur.get("trouve_en_clair") else "moyenne"},
        meilleur.get("trouve_en_clair", False),
        meilleur.get("verif", {}),
    )

    log("Terminé.")
    return resultat
