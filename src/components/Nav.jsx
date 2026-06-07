import { useEffect, useState } from 'react'

const links = [
  { href: '#approche', label: 'Approche' },
  { href: '#secteurs', label: 'Secteurs' },
  { href: '#strategie', label: 'Stratégie' },
  { href: '#performance', label: 'Performance' },
  { href: '#equipe', label: 'Équipe' },
  { href: '#faq', label: 'FAQ' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ink/90 backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-light to-gold-dark text-ink font-display font-extrabold">
            M
          </span>
          <span className="font-display text-[15px] font-extrabold tracking-tight text-white">
            Meridian<span className="text-gold"> Equipment Capital</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-light sm:inline-block"
          >
            Espace investisseurs
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-white lg:hidden"
            aria-label="Menu"
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-4 mt-3 rounded-2xl border border-white/10 bg-ink-soft p-3 lg:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-lg bg-gold px-4 py-3 text-center text-sm font-semibold text-ink"
          >
            Espace investisseurs
          </a>
        </nav>
      )}
    </header>
  )
}
