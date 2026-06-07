import { fund, heroStats } from '../../data/fund'
import Icon from '../Icon'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-radial-gold" />
      <div className="pointer-events-none absolute -left-40 top-40 h-[480px] w-[480px] rounded-full bg-navy-light/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-light">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Dette privée · Actifs réels
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              {fund.tagline.split(' au ')[0]}{' '}
              <span className="text-gradient-gold">au service de l’économie réelle</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {fund.intro}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-light"
              >
                Investir avec Meridian
                <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#strategie"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Notre stratégie
              </a>
            </div>

            <p className="mt-6 text-xs text-white/40">
              Réservé aux investisseurs professionnels et avertis. Capital non garanti.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
              >
                <div className="font-display text-3xl font-extrabold text-gradient-gold sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm leading-snug text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="relative border-t border-white/10 bg-ink-soft/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-5 text-xs font-medium uppercase tracking-wider text-white/40 sm:px-8">
          <span>Société de gestion agréée AIFM</span>
          <span className="hidden sm:inline">·</span>
          <span>Dépositaire indépendant</span>
          <span className="hidden sm:inline">·</span>
          <span>Valorisation trimestrielle</span>
          <span className="hidden sm:inline">·</span>
          <span>Reporting institutionnel</span>
        </div>
      </div>
    </section>
  )
}
