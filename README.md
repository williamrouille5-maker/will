# Meridian Equipment Capital

Site vitrine d'un fonds d'investissement spécialisé en **equipment finance**
(financement d'équipements productifs via crédit-bail et prêts adossés à des actifs).

> Marque, chiffres et équipe fictifs — projet de démonstration. Aucune offre ni
> sollicitation d'investissement.

## Stack

- **React 19** + **Vite** + **Tailwind CSS v4**
- `react-hot-toast` pour les notifications du formulaire
- Animations de scroll maison via `IntersectionObserver` (zéro dépendance)
- Icônes SVG inline (`src/components/Icon.jsx`)

## Structure

```
src/
  App.jsx               Assemblage des sections
  index.css             Thème (navy + or) et utilitaires
  data/fund.js          Tout le contenu éditable (chiffres, secteurs, équipe, FAQ…)
  components/
    Nav.jsx             Navigation sticky + menu mobile
    Reveal.jsx          Wrapper d'animation au scroll
    Icon.jsx            Jeu d'icônes SVG
    sections/           Hero, Approach, Sectors, Strategy,
                        Performance, Team, Faq, Contact, Footer
```

## Lancer le projet

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production (dossier dist/)
npm run preview  # prévisualiser le build
npm run lint     # ESLint
```

## Personnalisation

L'essentiel du contenu se modifie dans `src/data/fund.js` : nom du fonds,
statistiques, secteurs financés, process d'investissement, track record, équipe
et FAQ. Les couleurs de la marque sont centralisées dans le bloc `@theme` de
`src/index.css`.
