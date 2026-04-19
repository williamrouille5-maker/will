import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './Header'
import BottomNav from './BottomNav'

export default function AppShell() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen bg-surface relative">
        <Header />
        <main className="flex-1 pb-24 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
