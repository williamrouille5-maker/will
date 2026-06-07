import { fund } from '../../data/fund'

const cols = [
  {
    title: 'Le fonds',
    links: ['Approche', 'Secteurs', 'Stratégie', 'Performance'],
    hrefs: ['#approche', '#secteurs', '#strategie', '#performance'],
  },
  {
    title: 'Société',
    links: ['Équipe', 'FAQ', 'Espace investisseurs', 'Contact'],
    hrefs: ['#equipe', '#faq', '#contact', '#contact'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink-soft text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-light to-gold-dark font-display font-extrabold text-ink">
                M
              </span>
              <span className="font-display text-[15px] font-extrabold tracking-tight">
                Meridian<span className="text-gold"> Equipment Capital</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Fonds de dette privée spécialisé dans le financement d’équipements productifs.
              Au service de l’économie réelle depuis 2014.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l, i) => (
                  <li key={l}>
                    <a
                      href={col.hrefs[i]}
                      className="text-sm text-white/55 transition-colors hover:text-gold"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-white/40">
            <strong className="text-white/60">Avertissement.</strong> Meridian Equipment Capital
            est un nom fictif utilisé à des fins de démonstration. Ce site constitue une
            communication à caractère informatif et ne saurait être interprété comme une offre, une
            sollicitation ou un conseil en investissement. Tout investissement comporte un risque de
            perte en capital. Les performances passées ne préjugent pas des performances futures.
          </p>
          <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-white/40 sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} {fund.name}. Tous droits réservés.</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white">Mentions légales</a>
              <a href="#" className="hover:text-white">Confidentialité</a>
              <a href="#" className="hover:text-white">RGPD</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
