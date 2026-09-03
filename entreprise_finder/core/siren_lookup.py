"""
Étape 1 : SIREN -> identité entreprise + liste des dirigeants.

Source : API Recherche d'entreprises (data.gouv.fr / DINUM), gratuite, sans clé,
alimentée par les données officielles INSEE + INPI (RNE).
Doc : https://www.data.gouv.fr/dataservices/api-recherche-dentreprises/

IMPORTANT : cette API évolue et peut changer de format de réponse.
Lance `python main.py <SIREN> --debug` si le mapping ci-dessous ne colle plus
au JSON reçu : la fonction affichera la réponse brute pour que tu ajustes vite.
"""
import requests
from dataclasses import dataclass, field
from typing import Optional

import config


@dataclass
class Dirigeant:
    prenom: str
    nom: str
    qualite: str = ""  # ex: "Président", "Gérant", "Directeur général"
    est_personne_physique: bool = True


@dataclass
class Entreprise:
    siren: str
    denomination: str
    forme_juridique: str = ""
    site_web_declare: Optional[str] = None
    adresse: str = ""
    dirigeants: list = field(default_factory=list)
    actif: bool = True
    raw: dict = field(default_factory=dict)


def _extraire_dirigeants(result: dict) -> list:
    dirigeants = []
    for d in result.get("dirigeants", []) or []:
        # Le champ diffère selon que c'est une personne physique ou morale
        if d.get("type_dirigeant") == "personne physique" or "prenoms" in d or "nom" in d:
            prenom = (d.get("prenoms") or d.get("prenom") or "").split(",")[0].strip()
            nom = (d.get("nom") or "").strip()
            qualite = d.get("qualite", "")
            if prenom and nom:
                dirigeants.append(Dirigeant(prenom=prenom, nom=nom, qualite=qualite))
    return dirigeants


def rechercher_par_siren(siren: str, debug: bool = False) -> Optional[Entreprise]:
    """Interroge l'API Recherche d'entreprises pour un SIREN donné (9 chiffres)."""
    siren = siren.strip().replace(" ", "")
    if len(siren) != 9 or not siren.isdigit():
        raise ValueError(f"SIREN invalide : '{siren}' (doit faire 9 chiffres)")

    params = {"q": siren}
    resp = requests.get(
        config.RECHERCHE_ENTREPRISES_URL,
        params=params,
        timeout=config.REQUEST_TIMEOUT,
        headers={"User-Agent": config.USER_AGENT},
    )
    resp.raise_for_status()
    data = resp.json()

    if debug:
        import json
        print("---- DEBUG: réponse brute API Recherche d'entreprises ----")
        print(json.dumps(data, indent=2, ensure_ascii=False)[:4000])
        print("------------------------------------------------------------")

    results = data.get("results", [])
    if not results:
        return None

    # On prend le résultat dont le SIREN correspond exactement
    result = next((r for r in results if r.get("siren") == siren), results[0])

    entreprise = Entreprise(
        siren=siren,
        denomination=result.get("nom_complet") or result.get("nom_raison_sociale", ""),
        forme_juridique=result.get("nature_juridique", ""),
        site_web_declare=result.get("site_web"),
        adresse=result.get("siege", {}).get("adresse", "") if result.get("siege") else "",
        dirigeants=_extraire_dirigeants(result),
        actif=result.get("etat_administratif", "A") == "A",
        raw=result,
    )
    return entreprise
