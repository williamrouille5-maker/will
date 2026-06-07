import { process, advantages } from '../../data/fund'
import Icon from '../Icon'
import Reveal from '../Reveal'

export default function Strategy() {
  return (
    <section id="strategie" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold">
            Stratégie d’investissement
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            De l’origination à la distribution, un process discipliné
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {process.map((p, i) => (
            <Reveal
              key={p.step}
              delay={i * 90}
              className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7"
            >
              <div className="font-mono text-sm font-semibold text-gold">{p.step}</div>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{p.text}</p>
              {i < process.length - 1 && (
                <Icon
                  name="arrow"
                  size={20}
                  className="absolute -right-3 top-9 hidden text-gold/50 lg:block"
                />
              )}
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
          {advantages.map((a, i) => (
            <Reveal key={a.title} delay={i * 70} className="flex gap-3">
              <Icon name="check" size={22} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <h4 className="text-base font-bold">{a.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-white/55">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
