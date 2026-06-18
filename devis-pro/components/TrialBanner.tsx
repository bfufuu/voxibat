'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TrialBanner() {
  const router = useRouter()
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    fetch('/api/trial')
      .then(r => r.json())
      .then(data => {
        if (data.expired) {
          setExpired(true)
          router.push('/abonnement')
        } else if (data.daysLeft !== undefined) {
          setDaysLeft(data.daysLeft)
        }
      })
  }, [router])

  if (expired || daysLeft === null) return null

  if (daysLeft > 7) return null

  return (
    <div className={`px-4 py-2 text-sm text-center font-medium ${daysLeft <= 3 ? 'bg-red-500 text-white' : 'bg-amber-400 text-amber-900'}`}>
      {daysLeft === 0
        ? '⚠️ Votre essai gratuit expire aujourd\'hui !'
        : `⏳ Essai gratuit : encore ${daysLeft} jour${daysLeft > 1 ? 's' : ''}. `}
      <a href="/abonnement" className="underline font-bold ml-1">
        S'abonner →
      </a>
    </div>
  )
}
