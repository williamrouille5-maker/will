import { useState } from 'react'
import toast from 'react-hot-toast'
import { fund } from '../../data/fund'
import Icon from '../Icon'
import Reveal from '../Reveal'

const tickets = ['250 K€ – 1 M€', '1 M€ – 5 M€', '5 M€ – 20 M€', '> 20 M€']

export default function Contact() {
  const [ticket, setTicket] = useState(tickets[1])

  function handleSubmit(e) {
    e.preventDefault()
    toast.success('Demande reçue — notre équipe vous recontacte sous 48 h.')
    e.target.reset()
    setTicket(tickets[1])
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-radial-gold" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Espace investisseurs
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Échangeons sur votre allocation
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
              Vous êtes un investisseur professionnel et souhaitez en savoir plus sur le prochain
              millésime ? Laissez-nous vos coordonnées, nous vous transmettons la documentation
              complète.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: 'mail', text: fund.email },
                { icon: 'phone', text: fund.phone },
                { icon: 'pin', text: fund.address },
              ].map((c) => (
                <div key={c.text} className="flex items-center gap-3 text-white/80">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-gold">
                    <Icon name={c.icon} size={18} />
                  </span>
                  <span className="text-sm">{c.text}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom" name="firstName" placeholder="Marie" required />
                <Field label="Nom" name="lastName" placeholder="Dubois" required />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Organisation" name="org" placeholder="Family office, assureur…" />
                <Field
                  label="E-mail professionnel"
                  name="email"
                  type="email"
                  placeholder="marie@exemple.fr"
                  required
                />
              </div>

              <div className="mt-5">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Ticket envisagé
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {tickets.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTicket(t)}
                      className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors ${
                        ticket === t
                          ? 'border-gold bg-gold text-ink'
                          : 'border-white/15 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Message (optionnel)
                </span>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Votre horizon, vos objectifs…"
                  className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-light"
              >
                Demander la documentation
                <Icon name="arrow" size={18} />
              </button>
              <p className="mt-4 text-center text-xs text-white/40">
                Communication réservée aux investisseurs professionnels. Vos données restent
                confidentielles.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', placeholder, required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-gold focus:outline-none"
      />
    </label>
  )
}
