import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useData } from '../hooks/useData'
import CategoryCard from '../components/ui/CategoryCard'
import StatBadge from '../components/ui/StatBadge'

const CATEGORIES = [
  { key: 'conseils', to: '/conseils' },
  { key: 'temoignages', to: '/temoignages' },
  { key: 'bonsplans', to: '/bons-plans' },
  { key: 'demarches', to: '/demarches' },
]

const STATS = [
  { emoji: '🎓', value: '200+', label: 'téléchargements visés' },
  { emoji: '⭐', value: '4.8/5', label: 'satisfaction cible' },
  { emoji: '📚', value: '15+', label: 'conseils' },
  { emoji: '📍', value: '7+', label: 'bons plans' },
]

function CategoryItem({ categoryKey, to }) {
  const { data } = useData(categoryKey)
  if (!data) return <div className="rounded-2xl bg-border/40 h-32 animate-pulse" />

  const count = data.articles?.length || data.testimonials?.length || data.places?.length || data.procedures?.length || 0
  return <CategoryCard category={data} to={to} count={count} />
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Stats strip */}
      <div className="bg-primary px-4 pb-5">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {STATS.map((s) => (
            <StatBadge key={s.label} {...s} />
          ))}
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Section title */}
        <div>
          <h2 className="text-lg font-bold text-text">Explore les catégories</h2>
          <p className="text-xs text-muted">Tout ce qu'il te faut pour démarrer ta B1</p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ key, to }) => (
            <CategoryItem key={key} categoryKey={key} to={to} />
          ))}
        </div>

        {/* CTA contribution */}
        <button
          onClick={() => navigate('/contribuer')}
          className="w-full bg-gradient-to-r from-primary to-indigo-500 text-white rounded-2xl p-4 text-left active:scale-95 transition-all"
        >
          <div className="font-semibold text-sm mb-0.5">Tu es en B2, B3 ou plus ?</div>
          <div className="text-xs text-white/80 mb-3">Partage ton expérience avec les B1 de demain</div>
          <div className="flex items-center gap-1 text-xs font-semibold">
            Contribuer maintenant <ArrowRight size={13} />
          </div>
        </button>

        {/* Team credits */}
        <div className="bg-card border border-border rounded-2xl px-4 py-3 text-center">
          <p className="text-xs text-muted">Créé avec ❤️ par <span className="font-medium text-text">Louis · William · Philippe · Daniel</span></p>
          <p className="text-xs text-muted mt-0.5">ISTEC Business School — Innovation sociale 2026</p>
        </div>
      </div>
    </div>
  )
}
