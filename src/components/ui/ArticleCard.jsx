import { useNavigate } from 'react-router-dom'
import { Clock, ChevronRight } from 'lucide-react'
import Badge from './Badge'

export default function ArticleCard({ article, basePath }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`${basePath}/${article.id}`)}
      className="w-full bg-card rounded-2xl p-4 text-left shadow-sm border border-border active:scale-95 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text text-sm leading-snug mb-1">{article.title}</h3>
          <p className="text-xs text-muted leading-snug line-clamp-2 mb-2">{article.summary}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-muted">
              <Clock size={11} />
              <span>{article.readTime} min</span>
            </div>
            {article.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <ChevronRight size={16} className="text-muted flex-shrink-0 mt-1" />
      </div>
    </button>
  )
}
