import { useParams, useLocation } from 'react-router-dom'
import { Clock, User, Lightbulb, AlertTriangle, Quote } from 'lucide-react'
import { useData } from '../hooks/useData'
import Badge from '../components/ui/Badge'

const CATEGORY_MAP = {
  '/conseils': 'conseils',
  '/temoignages': 'temoignages',
  '/demarches': 'demarches',
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-sm text-text leading-relaxed mb-4">{block.text}</p>
    case 'heading':
      return <h2 className="text-base font-bold text-text mt-5 mb-2">{block.text}</h2>
    case 'tip':
      return (
        <div className="flex gap-3 bg-primary-light border-l-4 border-primary rounded-r-xl p-3 mb-4">
          <Lightbulb size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text leading-relaxed">{block.text}</p>
        </div>
      )
    case 'warning':
      return (
        <div className="flex gap-3 bg-amber-50 border-l-4 border-temoignages rounded-r-xl p-3 mb-4">
          <AlertTriangle size={16} className="text-temoignages flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text leading-relaxed">{block.text}</p>
        </div>
      )
    case 'list':
      return (
        <ul className="mb-4 flex flex-col gap-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-text">
              <span className="text-primary font-bold flex-shrink-0">·</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <div className="flex gap-3 border-l-4 border-temoignages pl-4 mb-4">
          <Quote size={14} className="text-temoignages flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text italic leading-relaxed">{block.text}</p>
        </div>
      )
    default:
      return null
  }
}

function TestimonialDetail({ item }) {
  return (
    <div className="px-4 py-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-temoignages-light flex items-center justify-center">
          <span className="text-base font-bold text-temoignages">{item.avatarInitials}</span>
        </div>
        <div>
          <div className="font-bold text-text">{item.name}</div>
          <div className="text-sm text-muted">{item.year}</div>
        </div>
      </div>
      <blockquote className="text-base font-semibold text-text italic mb-5 leading-snug border-l-4 border-temoignages pl-4">
        "{item.quote}"
      </blockquote>
      <div className="flex gap-1.5 flex-wrap mb-5">
        {item.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
      </div>
      {item.content?.map((block, i) => <ContentBlock key={i} block={block} />)}
    </div>
  )
}

function ArticleDetail({ item }) {
  return (
    <div className="px-4 py-5">
      <h1 className="text-xl font-bold text-text mb-2 leading-tight">{item.title}</h1>
      <div className="flex items-center gap-3 text-xs text-muted mb-3 flex-wrap">
        <span className="flex items-center gap-1"><User size={11} /> {item.author}</span>
        <span className="flex items-center gap-1"><Clock size={11} /> {item.readTime} min</span>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-5">
        {item.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
      </div>
      {item.content?.map((block, i) => <ContentBlock key={i} block={block} />)}
    </div>
  )
}

export default function ArticleDetailPage({ variant }) {
  const { articleId, id, procedureId } = useParams()
  const location = useLocation()

  const categoryKey = Object.entries(CATEGORY_MAP).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'conseils'

  const { data, loading } = useData(categoryKey)

  if (loading) {
    return (
      <div className="px-4 py-5 flex flex-col gap-3">
        <div className="h-8 bg-border/40 rounded-xl animate-pulse w-3/4" />
        <div className="h-4 bg-border/40 rounded-xl animate-pulse w-1/2" />
        <div className="h-32 bg-border/40 rounded-xl animate-pulse mt-4" />
      </div>
    )
  }

  const paramId = articleId || id || procedureId

  if (variant === 'testimonial') {
    const item = data?.testimonials?.find((t) => t.id === paramId)
    if (!item) return <p className="p-4 text-muted">Témoignage introuvable.</p>
    return <TestimonialDetail item={item} />
  }

  const items = data?.articles || data?.procedures || []
  const item = items.find((a) => a.id === paramId)
  if (!item) return <p className="p-4 text-muted">Article introuvable.</p>
  return <ArticleDetail item={item} />
}
