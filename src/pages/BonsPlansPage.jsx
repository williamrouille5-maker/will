import { useState } from 'react'
import { useData } from '../hooks/useData'
import BonPlanCard from '../components/ui/BonPlanCard'

export default function BonsPlansPage() {
  const { data, loading } = useData('bonsplans')
  const [activeFilter, setActiveFilter] = useState('Tout')

  if (loading) {
    return (
      <div className="px-4 py-5 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-border/40 h-28 animate-pulse" />
        ))}
      </div>
    )
  }

  const filters = data?.filters || ['Tout']
  const places = data?.places || []
  const filtered = activeFilter === 'Tout' ? places : places.filter((p) => p.category === activeFilter)

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                activeFilter === f
                  ? 'bg-bonsplans text-white'
                  : 'bg-card border border-border text-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">🗺️</p>
            <p className="text-muted text-sm">Aucun bon plan dans cette catégorie</p>
          </div>
        ) : (
          filtered.map((place) => (
            <BonPlanCard key={place.id} place={place} />
          ))
        )}
      </div>
    </div>
  )
}
