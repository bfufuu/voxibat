'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetTestDataButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const router = useRouter()

  async function handleReset() {
    if (!confirm('Supprimer tous les comptes de test et leurs données ? Cette action est irréversible.')) return
    setLoading(true)
    setResult('')
    const res = await fetch('/api/admin/reset-test-data', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setResult(`✅ ${data.deleted} compte(s) supprimé(s)`)
      router.refresh()
    } else {
      setResult(`❌ Erreur : ${data.error}`)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleReset}
        disabled={loading}
        className="px-4 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors font-medium"
      >
        {loading ? 'Suppression...' : '🗑️ Supprimer données de test'}
      </button>
      {result && <p className="text-xs text-gray-500">{result}</p>}
    </div>
  )
}
