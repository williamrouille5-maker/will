import { useState, useEffect } from 'react'

const cache = new Map()

export function useData(category) {
  const [data, setData] = useState(cache.get(category) || null)
  const [loading, setLoading] = useState(!cache.has(category))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache.has(category)) {
      setData(cache.get(category))
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        const modules = {
          conseils: () => import('../data/conseils.json'),
          temoignages: () => import('../data/temoignages.json'),
          bonsplans: () => import('../data/bonsplans.json'),
          demarches: () => import('../data/demarches.json'),
        }

        const loader = modules[category]
        if (!loader) throw new Error(`Unknown category: ${category}`)

        const mod = await loader()
        const result = mod.default

        if (!cancelled) {
          cache.set(category, result)
          setData(result)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [category])

  return { data, loading, error }
}
