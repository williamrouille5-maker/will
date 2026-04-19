import { NavLink } from 'react-router-dom'
import { Home, BookOpen, MessageSquare, MapPin } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Accueil', exact: true },
  { to: '/conseils', icon: BookOpen, label: 'Conseils' },
  { to: '/temoignages', icon: MessageSquare, label: 'Témoignages' },
  { to: '/bons-plans', icon: MapPin, label: 'Bons plans' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="h-safe-bottom" />
    </nav>
  )
}
