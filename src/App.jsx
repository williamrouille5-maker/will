import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import CategoryListPage from './pages/CategoryListPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import TemoignagesPage from './pages/TemoignagesPage'
import BonsPlansPage from './pages/BonsPlansPage'
import DemarchesPage from './pages/DemarchesPage'
import ContributePage from './pages/ContributePage'
import FlexZonePage from './pages/FlexZonePage'
import JeuPage from './pages/JeuPage'

const router = createBrowserRouter([
  {
    path: '/flexzone',
    element: <FlexZonePage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'conseils', element: <CategoryListPage category="conseils" /> },
      { path: 'conseils/:articleId', element: <ArticleDetailPage /> },
      { path: 'temoignages', element: <TemoignagesPage /> },
      { path: 'temoignages/:id', element: <ArticleDetailPage variant="testimonial" /> },
      { path: 'bons-plans', element: <BonsPlansPage /> },
      { path: 'demarches', element: <DemarchesPage /> },
      { path: 'demarches/:procedureId', element: <ArticleDetailPage variant="procedure" /> },
      { path: 'contribuer', element: <ContributePage /> },
      { path: 'jeu', element: <JeuPage /> },
    ],
  },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px', maxWidth: '340px' },
          success: { duration: 4000 },
        }}
      />
    </>
  )
}
