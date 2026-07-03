import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Timer, Trophy, Sparkles } from 'lucide-react'

// Petit jeu de mémoire (Memory) — thème vie étudiante ISTEC
const EMOJIS = ['📚', '☕', '🎓', '💻', '🍕', '🚇', '🎧', '📝']

function buildDeck() {
  const pairs = [...EMOJIS, ...EMOJIS]
  // Mélange (Fisher–Yates)
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return pairs.map((emoji, index) => ({ id: index, emoji, matched: false }))
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function JeuPage() {
  const [deck, setDeck] = useState(buildDeck)
  const [flipped, setFlipped] = useState([]) // ids des cartes retournées
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)

  const matchedCount = deck.filter((c) => c.matched).length
  const won = matchedCount === deck.length

  // Chrono
  useEffect(() => {
    if (!started || won) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [started, won])

  const handleFlip = useCallback(
    (card) => {
      if (!started) setStarted(true)
      if (card.matched || flipped.length === 2) return
      if (flipped.some((c) => c.id === card.id)) return

      const next = [...flipped, card]
      setFlipped(next)

      if (next.length === 2) {
        setMoves((m) => m + 1)
        const [a, b] = next
        if (a.emoji === b.emoji) {
          setDeck((d) =>
            d.map((c) => (c.emoji === a.emoji ? { ...c, matched: true } : c))
          )
          setFlipped([])
        } else {
          setTimeout(() => setFlipped([]), 800)
        }
      }
    },
    [flipped, started]
  )

  const reset = useCallback(() => {
    setDeck(buildDeck())
    setFlipped([])
    setMoves(0)
    setSeconds(0)
    setStarted(false)
  }, [])

  const isFaceUp = (card) =>
    card.matched || flipped.some((c) => c.id === card.id)

  return (
    <div className="px-4 pt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles size={18} strokeWidth={2.2} />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Pause détente
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-text mt-1">Jeu de mémoire</h1>
        <p className="text-sm text-muted mt-1">
          Retrouve les paires le plus vite possible. Deux essais par coup !
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Stat icon={Timer} label="Temps" value={formatTime(seconds)} />
        <Stat icon={RotateCcw} label="Coups" value={moves} />
        <Stat
          icon={Trophy}
          label="Paires"
          value={`${matchedCount / 2}/${EMOJIS.length}`}
        />
      </div>

      {/* Plateau */}
      <div className="grid grid-cols-4 gap-2.5">
        {deck.map((card) => {
          const faceUp = isFaceUp(card)
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card)}
              disabled={faceUp}
              className="aspect-square relative"
              style={{ perspective: 600 }}
              aria-label={faceUp ? card.emoji : 'Carte cachée'}
            >
              <motion.div
                className="w-full h-full rounded-2xl"
                initial={false}
                animate={{ rotateY: faceUp ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d', position: 'relative' }}
              >
                {/* Dos */}
                <span
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary text-white text-xl font-bold shadow-sm"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  ?
                </span>
                {/* Face */}
                <span
                  className={`absolute inset-0 flex items-center justify-center rounded-2xl text-3xl border-2 ${
                    card.matched
                      ? 'bg-bonsplans-light border-bonsplans'
                      : 'bg-card border-border'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {card.emoji}
                </span>
              </motion.div>
            </button>
          )
        })}
      </div>

      {/* Bouton rejouer */}
      <button
        onClick={reset}
        className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-card bg-primary-light text-primary-dark font-semibold text-sm active:scale-[0.98] transition-transform"
      >
        <RotateCcw size={18} strokeWidth={2.2} />
        Nouvelle partie
      </button>

      {/* Écran de victoire */}
      <AnimatePresence>
        {won && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
          >
            <motion.div
              className="bg-card rounded-card p-6 text-center max-w-xs w-full shadow-xl"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-extrabold text-text">Bravo !</h2>
              <p className="text-sm text-muted mt-1">
                Terminé en {formatTime(seconds)} et {moves} coups.
              </p>
              <button
                onClick={reset}
                className="mt-5 w-full py-3 rounded-card bg-primary text-white font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                Rejouer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-card border border-border rounded-card px-3 py-2.5 flex flex-col items-center">
      <Icon size={16} className="text-muted mb-1" strokeWidth={2} />
      <span className="text-base font-bold text-text leading-none">{value}</span>
      <span className="text-[11px] text-muted mt-0.5">{label}</span>
    </div>
  )
}
