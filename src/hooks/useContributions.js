import { useState } from 'react'

const STORAGE_KEY = 'b1pass_contributions'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useContributions() {
  const [contributions, setContributions] = useState(loadFromStorage)

  function addContribution(entry) {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'pending',
    }
    const updated = [newEntry, ...contributions]
    setContributions(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // localStorage unavailable — silently ignore
    }
    return newEntry
  }

  return { contributions, addContribution }
}
