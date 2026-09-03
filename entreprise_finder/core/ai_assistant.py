"""
Couche IA optionnelle (activée automatiquement si ANTHROPIC_API_KEY est présente
dans .env). Utile sur les cas ambigus où les règles simples ne suffisent pas :

1. Choisir le "bon" dirigeant à cibler quand il y en a plusieurs (ex: on préfère
   contacter le Président/Gérant/DG plutôt qu'un simple administrateur).
2. Départager plusieurs emails candidats trouvés en clair sur le web quand ils
   ne correspondent pas tous clairement à la personne.
3. Comme demandé : donner la priorité PRO > PERSO quand deux adresses actives
   coexistent (ex: jean.dupont@entreprise.fr vs jean.dupont@gmail.com).

Le programme fonctionne intégralement SANS cette couche (règles pures) : l'IA
n'est là que pour améliorer la précision sur les cas limites, pas pour remplacer
les vérifications techniques (SMTP reste la seule source de vérité sur "actif").
"""
import json
import config

_client = None
if config.USE_AI:
    from anthropic import Anthropic
    _client = Anthropic(api_key=config.ANTHROPIC_API_KEY)


def ia_disponible() -> bool:
    return _client is not None


def choisir_meilleur_dirigeant(dirigeants: list, denomination: str) -> dict:
    """dirigeants: liste de dicts {prenom, nom, qualite}. Retourne le dict choisi + justification."""
    if not dirigeants:
        return {}
    if len(dirigeants) == 1 or not ia_disponible():
        # Règle simple par défaut : priorité aux intitulés de direction générale
        priorite = ["président", "gérant", "directeur général", "pdg", "dg", "co-fondateur", "fondateur"]
        for mot in priorite:
            for d in dirigeants:
                if mot in d.get("qualite", "").lower():
                    return d
        return dirigeants[0]

    prompt = f"""Voici la liste des dirigeants déclarés de l'entreprise "{denomination}" :
{json.dumps(dirigeants, ensure_ascii=False, indent=2)}

Pour une démarche commerciale B2B, quel dirigeant est le meilleur interlocuteur
(en général : le décisionnaire principal — président, gérant, DG — plutôt qu'un
administrateur ou une fonction secondaire) ?

Réponds UNIQUEMENT avec un JSON de la forme :
{{"prenom": "...", "nom": "...", "qualite": "...", "justification": "..."}}
"""
    try:
        message = _client.messages.create(
            model="claude-sonnet-5",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        )
        texte = message.content[0].text.strip()
        # extraction JSON robuste au cas où le modèle ajoute du texte autour
        debut, fin = texte.find("{"), texte.rfind("}") + 1
        return json.loads(texte[debut:fin])
    except Exception:
        return dirigeants[0]


def choisir_meilleur_email(candidats: list, prenom: str, nom: str, denomination: str) -> dict:
    """
    candidats: liste de dicts {email, type: 'pro'/'perso'/'inconnu', statut, source}
    Règle demandée : priorité PRO > PERSO, parmi les emails validés (statut 'valide').
    L'IA n'intervient que pour trancher les cas ambigus (plusieurs emails valides
    du même type, ou type incertain).
    """
    valides = [c for c in candidats if c.get("statut") == "valide"]
    if not valides:
        valides = candidats  # aucun n'est confirmé actif -> on retombe sur tous les candidats

    pro = [c for c in valides if c.get("type") == "pro"]
    if pro:
        return pro[0]
    perso = [c for c in valides if c.get("type") == "perso"]
    if perso:
        return perso[0]
    return valides[0] if valides else {}
