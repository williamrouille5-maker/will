import { sectors } from '../../data/fund'
import Icon from '../Icon'
import Reveal from '../Reveal'

export default function Sectors() {
  return (
    <section id="secteurs" className="bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold-dark">
              Secteurs financés
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Une diversification réelle, secteur par secteur
            </h2>
          </Reveal>
          <Reveal delay={120} className="text-muted md:max-w-xs">
            <p className="text-sm leading-relaxed">
              Aucun secteur ne pèse plus de 25 % du portefeuille. La diversification est la
              première ligne de défense du capital.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s, i) => (
            <Reveal
              key={s.name}
              delay={(i % 3) * 90}
              className="group relative overflow-hidden rounded-2xl border border-line bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(10,18,38,0.35)]"
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gold/10 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-cloud text-navy">
                  <Icon name={s.icon} size={24} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
