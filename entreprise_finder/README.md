# Entreprise Finder — SIREN → Email + LinkedIn du dirigeant

Outil maison d'enrichissement de contacts B2B à partir d'un numéro SIREN.
Remplace Hunter.io / Kaspr / Dropcontact pour ce cas d'usage précis, gratuitement
(hors éventuelle clé IA optionnelle).

## Ce que fait le programme, étape par étape

1. **SIREN → entreprise + dirigeants** via l'API officielle et gratuite
   [Recherche d'entreprises](https://www.data.gouv.fr/dataservices/api-recherche-dentreprises/)
   (data.gouv.fr / DINUM, alimentée par l'INSEE et l'INPI).
2. **Sélection du dirigeant** le plus pertinent (Président/Gérant/DG en priorité).
3. **Recherche du domaine web** officiel de l'entreprise.
4. **Recherche du profil LinkedIn public** du dirigeant (via moteur de recherche,
   jamais de scraping direct de LinkedIn).
5. **Recherche d'un email déjà publié** sur le site de l'entreprise (contact,
   mentions légales, équipe...) — priorité absolue car plus fiable qu'un email deviné.
6. **Si rien trouvé : génération de patterns** probables (prenom.nom@, etc.) testés un par un.
7. **Vérification technique systématique** de chaque email (MX + handshake SMTP
   + détection des domaines "catch-all" qui faussent le test).
8. **Arbitrage PRO > PERSO** si plusieurs emails actifs sont trouvés.
9. **Score de fiabilité coloré** (🟢 vert / 🟠 orange / 🔴 rouge) pour l'email ET le LinkedIn.
10. Sortie en **terminal coloré**, **CSV** (mode batch) et **rapport HTML** (design institutionnel).

## Installation

```bash
cd entreprise_finder
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Ouvre `.env` et renseigne ce que tu as (rien n'est obligatoire au démarrage, voir
la section "Ce qui marche tout de suite" ci-dessous).

## Utilisation — Interface web (recommandé)

```bash
python app.py
```
Puis ouvre **http://127.0.0.1:5000** dans ton navigateur. Tu as :
- un onglet **Recherche unitaire** : tu tapes un SIREN, tu vois l'enquête se
  dérouler en direct (console de logs), puis la fiche résultat colorée apparaît ;
- un onglet **Traitement en lot** : tu déposes ton CSV (colonne `siren`), une
  barre de progression avance en temps réel, et chaque fiche résultat s'affiche
  au fur et à mesure (pas besoin d'attendre la fin de tout le lot).

C'est un serveur **local** : rien ne sort de ta machine à part les appels
légitimes vers l'API SIREN / la recherche web / les serveurs mail (nécessaires
au fonctionnement). Personne d'autre n'a accès à cette interface sauf si tu
exposes volontairement le port.

## Utilisation — Ligne de commande (alternative)

**Un seul SIREN :**
```bash
python main.py 552100554
```

**Un SIREN, avec le détail de ce que l'API renvoie (utile si un mapping casse) :**
```bash
python main.py 552100554 --debug
```

**Toute ta base de données (CSV avec une colonne `siren`) :**
```bash
python main.py --csv ma_base.csv --out resultats.csv --html rapport.html
```

Ça traite les entreprises en parallèle (5 threads par défaut, réglable dans
`config.py` via `MAX_WORKERS`), affiche la progression en direct, et exporte
tout en CSV + un joli rapport HTML consultable dans un navigateur.

## Ce qui marche tout de suite (sans rien configurer)

- Récupération SIREN → entreprise/dirigeants (API gratuite officielle)
- Recherche du domaine et du LinkedIn (via DuckDuckGo, gratuit, sans clé)
- Génération des patterns d'emails
- Vérification MX (DNS)

## Ce qui nécessite une action de ta part

### 1. Vérification SMTP (le cœur de la fiabilité) — **le plus probable blocage**

La vérification "l'email est-il actif" se fait par un handshake SMTP sur le
**port 25 sortant**. Ce port est bloqué par défaut chez la plupart des FAI
grand public et des hébergeurs cloud (mesure anti-spam standard).

**Comment savoir si tu es bloqué :** lance simplement le programme sur un SIREN
de test. Si tous les statuts affichent "port_bloque", c'est confirmé.

**Comment résoudre, dans l'ordre de préférence :**
- **Option A (gratuite) :** héberge le script sur un VPS qui autorise le port 25
  sortant. Certains fournisseurs le permettent nativement ou sur demande
  (ex : Scaleway, certaines offres OVH avec vérification d'identité). Digital
  Ocean et AWS le bloquent par défaut et c'est compliqué à débloquer — évite.
- **Option B (auto-hébergée, plus robuste) :** utilise
  [Reacher](https://github.com/reacherhq/check-if-email-exists), l'outil open
  source de référence pour ça (Rust, très fiable, gère aussi le catch-all et le
  greylisting). Tu le lances en local/VPS (`docker run` fourni dans leur repo)
  et tu branches `FALLBACK_VERIFY_API_URL` dans `.env` sur ton instance Reacher.
- **Option C (payant mais très abordable) :** une API tierce de vérification
  email avec free tier (quelques centaines de vérifs/mois gratuites) : ex.
  MailboxValidator, Verifalia, ZeroBounce. Renseigne `FALLBACK_VERIFY_API_URL`
  et `FALLBACK_VERIFY_API_KEY` dans `.env`. **Adapte le mapping JSON** dans
  `core/email_verifier.py` (fonction `_fallback_api_check`) au format exact de
  l'API choisie — je n'ai pas pu tester leurs réponses réelles.

### 2. Format de l'API Recherche d'entreprises

Je n'ai pas pu appeler l'API en conditions réelles depuis mon environnement
(réseau restreint). Le mapping dans `core/siren_lookup.py` (fonction
`_extraire_dirigeants`) est basé sur la documentation publique mais **peut
avoir un décalage mineur** si l'API a changé récemment.

**Process pour corriger si ça ne marche pas :**
```bash
python main.py <UN_SIREN_QUE_TU_CONNAIS> --debug
```
Ça affiche le JSON brut renvoyé par l'API. Regarde la structure du champ
`dirigeants` et ajuste les noms de clés dans `_extraire_dirigeants()` en
conséquence (2-3 lignes à changer maximum).

### 3. IA (optionnel)

Ajoute `ANTHROPIC_API_KEY=sk-ant-...` dans `.env` pour activer :
- le choix intelligent du dirigeant à cibler quand il y en a plusieurs,
- l'arbitrage sur les cas ambigus d'emails multiples.

Sans clé, le programme utilise des règles simples (priorité aux intitulés
"Président/Gérant/DG", priorité pro > perso) qui couvrent la grande majorité
des cas. L'IA n'est utile que sur les cas limites.

### 4. Recherche web (LinkedIn + domaine)

Par défaut : DuckDuckGo gratuit sans clé (package `ddgs`), mais peut être
rate-limité si tu traites beaucoup de SIREN d'un coup (le code gère un retry
avec backoff, mais au-delà de quelques dizaines/heure ça peut ralentir).

**Pour du volume :** crée une clé [SerpAPI](https://serpapi.com/) (free tier
disponible, ~100 recherches/mois gratuites, payant au-delà) et renseigne
`SERPAPI_KEY` dans `.env`. Le programme bascule automatiquement dessus.

## Sur la fiabilité et le code couleur

- 🟢 **VERT** : information vérifiée activement (serveur mail confirmé, ou
  nom+entreprise confirmés sur LinkedIn). Utilisable directement.
- 🟠 **ORANGE** : probable mais pas garanti à 100% (domaine catch-all qui
  empêche une vérification nette, ou correspondance partielle). À utiliser
  avec un minimum de prudence.
- 🔴 **ROUGE** : email rejeté par le serveur, ou aucune vérification possible.
  Ne pas utiliser tel quel.

## Important — ce qui ne fait PAS partie de ce programme

Trouver un email valide et **éviter les spams à l'envoi** sont deux problèmes
différents. Ce programme résout le premier. Pour le second, il faudra en plus :
- configurer SPF/DKIM/DMARC sur ton domaine d'envoi,
- faire un "warm-up" progressif du domaine (montée en volume graduelle),
- utiliser un outil d'envoi adapté (pas un envoi en masse brut),
- respecter le cadre RGPD/CNIL applicable à la prospection B2B (mention
  d'origine, lien de désinscription, lien avec l'activité professionnelle du
  destinataire).

## Structure du projet

```
entreprise_finder/
├── app.py                     # serveur web (interface graphique, recommandé)
├── templates/index.html       # page de l'interface web
├── static/style.css           # design institutionnel
├── static/app.js               # logique front (flux en direct, affichage)
├── main.py                    # point d'entrée CLI (alternative à app.py)
├── config.py                 # configuration centralisée (.env)
├── report.py                 # génération du rapport HTML (mode CLI uniquement)
├── core/
│   ├── siren_lookup.py       # SIREN -> entreprise + dirigeants
│   ├── domain_finder.py      # recherche du site web officiel
│   ├── linkedin_finder.py    # recherche du profil LinkedIn
│   ├── website_scraper.py    # recherche d'email en clair sur le site
│   ├── email_generator.py    # génération de patterns d'emails
│   ├── email_verifier.py     # vérification MX + SMTP + catch-all
│   ├── ai_assistant.py       # couche IA optionnelle
│   ├── scoring.py            # calcul du score de fiabilité (couleurs)
│   └── pipeline.py           # orchestrateur qui enchaîne tout
├── requirements.txt
├── .env.example
└── exemple_entreprises.csv   # exemple de format pour le mode batch
```
