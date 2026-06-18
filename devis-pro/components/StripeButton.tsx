'use client'

import { useState } from 'react'

export default function StripeButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Erreur lors de la redirection vers le paiement.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-60 transition-colors"
    >
      {loading ? '⏳ Redirection...' : '💳 S\'abonner pour 49€/mois'}
    </button>
  )
}
