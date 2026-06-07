import { track } from '../../data/fund'
import Reveal from '../Reveal'

const statusStyle = {
  'Liquidé': 'bg-cloud text-navy',
  'En distribution': 'bg-emerald/10 text-emerald',
  'En investissement': 'bg-gold/15 text-gold-dark',
}

export default function Performance() {
  return (
    <section id="performance" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-dark">
            Track record
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Quatre millésimes, une discipline constante
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Depuis 2014, chaque fonds a tenu son cap : des revenus réguliers, un taux de perte
            maîtrisé et des distributions tenues dans la durée.
          </p>
        </Reveal>

        <Reveal className="mt-12 overflow-hidden rounded-3xl border border-line">
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4 bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/60 sm:px-8">
            <span>Millésime</span>
            <span className="text-right">TRI net</span>
            <span className="text-right">Taille</span>
            <span className="text-right">Statut</span>
          </div>
          {track.map((t, i) => (
            <div
              key={t.year}
              className={`grid grid-cols-[2fr_1fr_1fr_1.2fr] items-center gap-4 px-6 py-5 text-sm sm:px-8 ${
                i % 2 ? 'bg-mist' : 'bg-white'
              }`}
            >
              <span className="font-semibold text-ink">{t.year}</span>
              <span className="text-right font-mono font-bold text-emerald">{t.tri}</span>
              <span className="text-right font-mono text-muted">{t.size}</span>
              <span className="text-right">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyle[t.status] || 'bg-cloud text-navy'
                  }`}
                >
                  {t.status}
                </span>
              </span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-5 text-xs leading-relaxed text-muted-light">
            Les performances passées ne préjugent pas des performances futures. Les chiffres
            présentés sont nets de frais de gestion et illustratifs. Tout investissement comporte
            un risque de perte en capital.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
