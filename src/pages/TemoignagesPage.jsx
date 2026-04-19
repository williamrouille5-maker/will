import { useNavigate } from 'react-router-dom'
import { useData } from '../hooks/useData'
import TestimonialCard from '../components/ui/TestimonialCard'

export default function TemoignagesPage() {
  const { data, loading } = useData('temoignages')
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="px-4 py-5 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-border/40 h-28 animate-pulse" />
        ))}
      </div>
    )
  }

  const testimonials = data?.testimonials || []

  return (
    <div className="px-4 py-5 flex flex-col gap-4">
      <div className="bg-temoignages-light rounded-2xl px-4 py-3">
        <p className="text-sm text-text font-medium">
          🗣️ Ces B3 ont vécu ce que tu vas vivre. Leurs retours valent de l'or.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>

      <button
        onClick={() => navigate('/contribuer')}
        className="w-full border-2 border-dashed border-border rounded-2xl p-4 text-center active:scale-95 transition-all"
      >
        <p className="text-sm font-medium text-muted">✍️ Partager mon témoignage en tant que B3</p>
      </button>
    </div>
  )
}
