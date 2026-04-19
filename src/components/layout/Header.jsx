import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const ROUTE_TITLES = {
  '/conseils': 'Conseils académiques',
  '/temoignages': 'Témoignages B3',
  '/bons-plans': 'Bons plans',
  '/demarches': 'Démarches admin',
  '/contribuer': 'Contribuer',
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  if (isHome) {
    return (
      <header className="bg-primary px-4 pt-6 pb-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-extrabold tracking-tight">B1 PASS</span>
          <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 font-medium">2025–2026</span>
        </div>
        <p className="text-sm text-white/80 font-medium">Ton guide survie à l'ISTEC 🎓</p>
      </header>
    )
  }

  const title = Object.entries(ROUTE_TITLES).find(([path]) => location.pathname.startsWith(path))?.[1] || 'B1 PASS'

  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="p-1.5 rounded-lg hover:bg-surface active:scale-95 transition-all"
        aria-label="Retour"
      >
        <ChevronLeft size={22} className="text-text" />
      </button>
      <span className="font-semibold text-text text-base">{title}</span>
    </header>
  )
}
