import { useState } from 'react'
import { faq } from '../../data/fund'
import Icon from '../Icon'
import Reveal from '../Reveal'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold-dark">
            Questions fréquentes
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Tout comprendre avant d’investir
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal
                key={item.q}
                delay={i * 50}
                className="overflow-hidden rounded-2xl border border-line bg-mist"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-ink">{item.q}</span>
                  <Icon
                    name="plus"
                    size={20}
                    className={`shrink-0 text-gold-dark transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
