import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../hooks/useData'
import ArticleCard from '../components/ui/ArticleCard'
import SearchBar from '../components/ui/SearchBar'

export default function CategoryListPage({ category }) {
  const { data, loading } = useData(category)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="px-4 py-5 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-border/40 h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  const articles = data?.articles || []
  const filtered = query
    ? articles.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : articles

  return (
    <div className="px-4 py-5 flex flex-col gap-4">
      <SearchBar value={query} onChange={setQuery} placeholder="Chercher un conseil..." />

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-muted text-sm">Aucun résultat pour "{query}"</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} basePath={`/${category}`} />
          ))}
        </div>
      )}

      {/* Contribute CTA */}
      <button
        onClick={() => navigate('/contribuer')}
        className="w-full border-2 border-dashed border-border rounded-2xl p-4 text-center active:scale-95 transition-all"
      >
        <p className="text-sm font-medium text-muted">✍️ Ajouter un conseil en tant que B3</p>
      </button>
    </div>
  )
}
