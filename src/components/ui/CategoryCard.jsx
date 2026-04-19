import { useNavigate } from 'react-router-dom'
import { BookOpen, MessageSquare, MapPin, ClipboardList, ChevronRight } from 'lucide-react'

const ICONS = {
  BookOpen,
  MessageSquare,
  MapPin,
  ClipboardList,
}

export default function CategoryCard({ category, to, count }) {
  const navigate = useNavigate()
  const Icon = ICONS[category.icon] || BookOpen

  return (
    <button
      onClick={() => navigate(to)}
      className="w-full bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-95 transition-all hover:shadow-md"
      style={{ borderLeftWidth: 4, borderLeftColor: category.color }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: category.lightColor }}
      >
        <Icon size={20} style={{ color: category.color }} />
      </div>
      <div className="font-semibold text-text text-sm leading-tight mb-1">{category.title}</div>
      <div className="text-xs text-muted leading-snug mb-3">{category.description}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: category.color }}>
          {count} {count > 1 ? 'articles' : 'article'}
        </span>
        <ChevronRight size={14} className="text-muted" />
      </div>
    </button>
  )
}
