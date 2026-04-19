import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import ContributionForm from '../components/forms/ContributionForm'

export default function ContributePage() {
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  if (submitted) {
    return (
      <div className="px-4 py-12 flex flex-col items-center text-center gap-4">
        <CheckCircle size={56} className="text-bonsplans" />
        <div>
          <h2 className="text-xl font-bold text-text mb-1">Merci pour ta contribution !</h2>
          <p className="text-sm text-muted">Elle sera relue par l'équipe avant d'être publiée.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl active:scale-95 transition-all"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-5">
      <div className="bg-primary-light rounded-2xl px-4 py-3 mb-5">
        <p className="text-sm font-semibold text-primary mb-0.5">Tu es B2, B3 ou alumni ?</p>
        <p className="text-xs text-muted">Partage tes conseils, expériences et bons plans avec les nouveaux B1. Ton vécu a de la valeur !</p>
      </div>
      <ContributionForm onSuccess={() => setSubmitted(true)} />
    </div>
  )
}
