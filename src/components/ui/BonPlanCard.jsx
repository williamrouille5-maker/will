import { MapPin, Clock } from 'lucide-react'

export default function BonPlanCard({ place }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-bonsplans-light flex items-center justify-center flex-shrink-0 text-xl">
          {place.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-text text-sm">{place.name}</h3>
            <span className="text-xs font-medium text-muted flex-shrink-0">{place.priceRange}</span>
          </div>
          <p className="text-xs text-muted mt-0.5 mb-2 leading-snug">{place.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted mb-2">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {place.distance}
            </span>
            {place.hours !== 'Variable selon musée' && place.hours !== '24h/24' && place.hours !== 'En ligne' && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {place.hours}
              </span>
            )}
          </div>
          {place.studentDiscount && place.discountDetail && (
            <div className="flex items-center gap-1.5 bg-bonsplans-light rounded-lg px-2.5 py-1.5">
              <span className="text-bonsplans text-xs font-semibold">🎓 {place.discountDetail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
