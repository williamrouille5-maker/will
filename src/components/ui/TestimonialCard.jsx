import { useNavigate } from 'react-router-dom'
import { Quote } from 'lucide-react'
import Badge from './Badge'

export default function TestimonialCard({ testimonial }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/temoignages/${testimonial.id}`)}
      className="w-full bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-95 transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-temoignages-light flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-temoignages">{testimonial.avatarInitials}</span>
        </div>
        <div>
          <div className="font-semibold text-text text-sm">{testimonial.name}</div>
          <div className="text-xs text-muted">{testimonial.year}</div>
        </div>
      </div>
      <div className="flex gap-2 mb-2">
        <Quote size={14} className="text-temoignages flex-shrink-0 mt-0.5" />
        <p className="text-sm text-text italic leading-snug line-clamp-2">{testimonial.quote}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap mt-2">
        {testimonial.tags?.slice(0, 3).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </button>
  )
}
