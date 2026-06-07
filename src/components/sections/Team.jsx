import { team } from '../../data/fund'
import Reveal from '../Reveal'

export default function Team() {
  return (
    <section id="equipe" className="bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-dark">
            L’équipe
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Des financiers et des ingénieurs, sous le même toit
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Valoriser un actif demande autant de connaissance du marché que de l’équipement
            lui-même. Notre équipe combine les deux.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal
              key={m.name}
              delay={i * 80}
              className="rounded-2xl border border-line bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(10,18,38,0.35)]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-navy to-ink font-display text-lg font-extrabold text-gold">
                {m.initials}
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{m.name}</h3>
              <div className="mt-1 text-sm font-semibold text-gold-dark">{m.role}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{m.bio}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
