import { pillars } from '../../data/fund'
import Icon from '../Icon'
import Reveal from '../Reveal'

export default function Approach() {
  return (
    <section id="approche" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-dark">
            Notre approche
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Du rendement adossé à des actifs que l’on peut toucher
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Là où la dette classique repose sur la seule signature de l’emprunteur, l’equipment
            finance s’appuie sur un équipement physique. Cette garantie tangible change la nature
            du risque — et celle du rendement.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 80}
              className="group rounded-2xl border border-line bg-mist p-7 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_60px_-30px_rgba(10,18,38,0.4)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-gold transition-colors group-hover:bg-gradient-to-br group-hover:from-gold-light group-hover:to-gold-dark group-hover:text-ink">
                <Icon name={p.icon} size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
