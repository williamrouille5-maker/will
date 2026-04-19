import { useState } from 'react'
import toast from 'react-hot-toast'
import FormField from './FormField'
import { useContributions } from '../../hooks/useContributions'

const CATEGORIES = [
  { value: 'conseils', label: 'Conseils académiques' },
  { value: 'temoignages', label: 'Témoignage B3' },
  { value: 'bonsplans', label: 'Bon plan' },
  { value: 'demarches', label: 'Démarche admin' },
]

const YEARS = ['B2', 'B3', 'B4', 'Alumni']

const inputClass = 'w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'

export default function ContributionForm({ onSuccess }) {
  const { addContribution } = useContributions()
  const [form, setForm] = useState({
    authorName: '',
    authorYear: 'B3',
    category: 'conseils',
    title: '',
    content: '',
    tags: '',
  })
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.authorName.trim()) e.authorName = 'Ton prénom est requis'
    if (!form.title.trim()) e.title = 'Un titre est requis'
    if (form.content.trim().length < 50) e.content = 'Écris au moins 50 caractères'
    return e
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    addContribution({
      authorName: form.authorName.trim(),
      authorYear: form.authorYear,
      category: form.category,
      title: form.title.trim(),
      content: form.content.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    })
    toast.success('Merci pour ta contribution ! Elle sera relue avant publication.')
    setForm({ authorName: '', authorYear: 'B3', category: 'conseils', title: '', content: '', tags: '' })
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Ton prénom" id="authorName" error={errors.authorName}>
          <input
            id="authorName"
            type="text"
            value={form.authorName}
            onChange={(e) => set('authorName', e.target.value)}
            placeholder="Ex : Julie"
            className={inputClass}
          />
        </FormField>
        <FormField label="Ta promo" id="authorYear">
          <select
            id="authorYear"
            value={form.authorYear}
            onChange={(e) => set('authorYear', e.target.value)}
            className={inputClass}
          >
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Catégorie" id="category">
        <select
          id="category"
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className={inputClass}
        >
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </FormField>

      <FormField label="Titre de ta contribution" id="title" error={errors.title}>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Ex : Mon conseil pour les partiels"
          className={inputClass}
        />
      </FormField>

      <FormField label="Contenu" id="content" error={errors.content}>
        <textarea
          id="content"
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          placeholder="Partage ton expérience, tes conseils, ce que tu aurais voulu savoir..."
          rows={5}
          className={inputClass}
        />
        <span className="text-xs text-muted self-end">{form.content.length} / 50 min</span>
      </FormField>

      <FormField label="Tags (optionnel)" id="tags">
        <input
          id="tags"
          type="text"
          value={form.tags}
          onChange={(e) => set('tags', e.target.value)}
          placeholder="organisation, partiels, logement (séparés par virgules)"
          className={inputClass}
        />
      </FormField>

      <button
        type="submit"
        className="w-full bg-primary text-white font-semibold py-3 rounded-xl active:scale-95 transition-all hover:bg-primary-dark"
      >
        Envoyer ma contribution
      </button>
    </form>
  )
}
