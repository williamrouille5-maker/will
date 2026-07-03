# Pledgera — Site vitrine statique (landing waitlist)

Site vitrine **statique** pour Pledgera, plateforme de dette privée tokenisée
dédiée au financement d'équipements industriels de niche (impression,
plasturgie, agro-processing).

**Objectif unique du site :** capturer une liste d'attente.
**Audience actuellement ciblée :** les **emprunteurs industriels** (voir plus
bas « Changer d'audience » pour basculer côté investisseurs).

- Aucune dépendance, aucun build, aucun Node.
- Trois fichiers seulement : `index.html`, `style.css`, `README.md`.
- Responsive (mobile d'abord), rapide, accessible.

---

## ⚠️ À lire avant de mettre en ligne

Deux points de vigilance repris directement du cahier des charges :

1. **La conformité n'est pas cosmétique.** Proposer de la dette tokenisée au
   public touche au droit des instruments financiers (AMF en France, MiCA en
   Europe). Le site contient un **disclaimer provisoire** (section
   « Conformité » + pied de page) : il **doit être relu et validé par un avocat
   spécialisé** avant toute publication réelle. N'ajoutez **aucune promesse de
   rendement chiffré**.

2. **Le site est-il prioritaire maintenant ?** Sans traction ni structure
   juridique, un site public « fini » peut se retourner contre vous. Par
   précaution, le fichier `index.html` contient une balise qui **empêche
   l'indexation** par les moteurs de recherche :

   ```html
   <meta name="robots" content="noindex, nofollow" />
   ```

   Tant que vous n'êtes pas prêt à être public, **laissez cette ligne**. Pour
   rendre le site référençable le jour venu, supprimez-la.

---

## Aperçu en local

Pas d'outillage nécessaire. Deux options :

- **Le plus simple :** double-cliquez sur `index.html` — il s'ouvre dans votre
  navigateur.
- **Recommandé** (pour que le formulaire et les chemins se comportent comme en
  ligne) : lancez un petit serveur local depuis le dossier `pledgera/` :

  ```bash
  # Avec Python (déjà présent sur Mac/Linux)
  python3 -m http.server 8000
  # puis ouvrez http://localhost:8000
  ```

---

## Brancher le formulaire de waitlist (obligatoire)

Le formulaire ne collecte encore rien : il pointe vers un **placeholder**.
Choisissez UN service externe, puis remplacez le placeholder.

### Option A — Formspree (recommandé, garde le formulaire tel quel)

1. Créez un compte et un formulaire sur <https://formspree.io>.
2. Copiez l'identifiant de votre formulaire (ex. `xdorwkpy`).
3. Dans `index.html`, cherchez `VOTRE_ID_FORMSPREE` et remplacez l'URL :

   ```html
   <!-- Avant -->
   <form action="https://formspree.io/f/VOTRE_ID_FORMSPREE" method="POST">
   <!-- Après -->
   <form action="https://formspree.io/f/xdorwkpy" method="POST">
   ```

C'est tout : les inscriptions arrivent par e-mail / dans votre tableau de bord
Formspree. Le champ anti-spam (« honeypot ») est déjà en place.

### Option B — Tally

Deux façons de faire :

- **Simple :** créez votre formulaire sur <https://tally.so>, puis faites
  pointer les boutons « Liste d'attente » vers son URL. Cherchez
  `href="#waitlist"` dans `index.html` et remplacez par
  `href="https://tally.so/r/VOTRE_FORMULAIRE"`.
- **Intégré :** remplacez tout le bloc `<form class="waitlist-form"> … </form>`
  par le code d'intégration (embed) fourni par Tally.

---

## Déploiement

### Netlify (le plus rapide — glisser-déposer)

1. Allez sur <https://app.netlify.com/drop>.
2. Glissez-déposez le **dossier `pledgera/`** (ou son contenu) dans la zone.
3. Le site est en ligne en quelques secondes sur une URL `*.netlify.app`.
4. (Optionnel) Reliez un dépôt Git pour un déploiement automatique à chaque
   `git push`, et branchez votre nom de domaine dans *Site settings → Domain*.

> Astuce : si vous déployez tout le dépôt et non le seul dossier `pledgera/`,
> réglez le **Publish directory** sur `pledgera` dans les réglages de build
> Netlify (aucune commande de build n'est nécessaire, laissez-la vide).

### GitHub Pages

Le site vit dans le sous-dossier `pledgera/`. Deux approches :

**A. Publier le sous-dossier avec une action** (recommandé) — ou plus simple :

**B. Déplacer les fichiers à la racine d'un dépôt dédié :**

1. Copiez `index.html` et `style.css` à la racine d'un dépôt GitHub.
2. Dépôt → **Settings → Pages**.
3. *Build and deployment* → *Source* : **Deploy from a branch**.
4. Choisissez la branche (`main`) et le dossier `/root`, puis **Save**.
5. Le site est publié sur `https://<votre-compte>.github.io/<depot>/`.

> GitHub Pages sert des fichiers statiques : aucun build n'est requis pour ce
> projet.

---

## Modifier chaque section

Tout se passe dans `index.html`. Chaque grande section est repérée par un
commentaire `<!-- SECTION — ... -->`. Cherchez le nom pour la retrouver.

| Section | Repère dans `index.html` | Quoi y modifier |
|---|---|---|
| En-tête / menu | `EN-TÊTE / NAVIGATION` | Nom de marque, liens du menu |
| Hero | `SECTION — HERO` | Phrase de valeur, sous-titre, boutons |
| Le problème | `SECTION — LE PROBLÈME` | Les 3 cartes du constat |
| La solution | `SECTION — LA SOLUTION` | Accès / liquidité / traçabilité |
| Comment ça marche | `SECTION — COMMENT ÇA MARCHE` | Les 3 étapes |
| Pour qui | `SECTION — POUR QUI` | Filières ciblées, texte beachhead |
| Conformité | `SECTION — CONFIANCE / CONFORMITÉ` | **Disclaimer (à valider juridiquement)** |
| Formulaire | `SECTION — CTA FINAL` | Champs, lien du service externe |
| Pied de page | `PIED DE PAGE` | Mentions légales, liens, contact |

### Changer les couleurs et la typographie

Tout est centralisé en haut de `style.css`, dans le bloc `:root { … }` :

```css
--navy: #0f2036;     /* Bleu nuit principal */
--accent: #b98a4e;   /* Accent bronze — changez ici pour tout re-teinter */
--paper: #fbfbfa;    /* Fond de page */
```

Modifiez une variable, elle se répercute partout. Les polices (serif pour les
titres, sans-serif pour le texte) sont dans les variables `--font-serif` et
`--font-sans` — ce sont des polices système (aucun chargement réseau, donc site
rapide).

---

## Changer d'audience (emprunteurs ⇄ investisseurs)

Le site ne doit viser **qu'une seule audience**. Il cible actuellement les
**emprunteurs industriels**. Pour passer côté **investisseurs**, éditez
uniquement ces trois endroits dans `index.html` :

1. **Hero** (`SECTION — HERO`) : remplacez le titre et le sous-titre par un
   message orienté investisseur (accès à une classe d'actifs adossée à du
   matériel réel, traçabilité). ⚠️ Restez factuel, **sans promesse de
   rendement** (voir avertissement plus haut).
2. **Pour qui** (`SECTION — POUR QUI`) : décrivez le profil investisseur visé
   au lieu des filières industrielles.
3. **Formulaire** (`SECTION — CTA FINAL`) : adaptez les libellés (ex. type
   d'investisseur au lieu de « filière »).

> Rappel juridique : s'adresser à des investisseurs se rapproche davantage du
> régime de l'offre au public / de la promotion financière que de s'adresser à
> des emprunteurs. Faites valider votre formulation.

---

## Accessibilité & performance

Déjà intégré :

- Structure HTML sémantique, un seul `<h1>`, hiérarchie de titres cohérente.
- Lien d'évitement clavier (« Aller au formulaire »).
- Indicateurs de focus visibles, respect de `prefers-reduced-motion`.
- Contrastes de couleurs élevés, cibles tactiles confortables.
- Zéro dépendance externe : polices système, favicon en ligne (SVG), pas de
  JavaScript de framework. Le site se charge quasi instantanément.

---

## Structure des fichiers

```
pledgera/
├── index.html   # Contenu et structure (tout le texte à éditer est ici)
├── style.css    # Apparence (couleurs, mise en page) — variables en haut
└── README.md    # Ce fichier
```
