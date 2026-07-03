'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TogglePaidButton({ userId, isPaid }: { userId: string; isPaid: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    await fetch('/api/admin/toggle-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isPaid: !isPaid }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs px-2 py-1 rounded border disabled:opacity-50 transition-colors ${
        isPaid
          ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
          : 'border-green-200 text-green-600 hover:bg-green-50'
      }`}
    >
      {loading ? '...' : isPaid ? 'Repasser en essai' : 'Marquer payant'}
    </button>
  )
}
