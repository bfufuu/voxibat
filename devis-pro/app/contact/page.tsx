'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ sujet: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.sujet.trim() || !form.message.trim()) return
    setSending(true)
    setError('')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSending(false)
    if (res.ok) {
      setSent(true)
    } else {
      setError('Une erreur est survenue. Réessayez ou écrivez directement à contact@voxibat.fr')
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 pl-10 md:pl-0">Nous contacter</h2>
        <p className="text-gray-500 mt-1">Une question, un problème ou une suggestion ? On vous répond rapidement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-2xl mb-2">✉️</p>
          <p className="text-xs text-gray-400 mb-1">Email</p>
          <a href="mailto:contact@voxibat.fr" className="text-sm font-medium text-blue-600 hover:underline">
            contact@voxibat.fr
          </a>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-2xl mb-2">⏱️</p>
          <p className="text-xs text-gray-400 mb-1">Délai de réponse</p>
          <p className="text-sm font-medium text-gray-700">Sous 24h ouvrées</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-2xl mb-2">🇫🇷</p>
          <p className="text-xs text-gray-400 mb-1">Support</p>
          <p className="text-sm font-medium text-gray-700">En français</p>
        </div>
      </div>

      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <p className="text-3xl mb-3">✅</p>
          <p className="font-semibold text-green-800 text-lg">Message envoyé !</p>
          <p className="text-green-600 text-sm mt-1">Nous vous répondrons dans les 24h ouvrées.</p>
          <button
            onClick={() => { setSent(false); setForm({ sujet: '', message: '' }) }}
            className="mt-4 text-sm text-green-700 underline hover:no-underline"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Envoyer un message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
              <input
                type="text"
                value={form.sujet}
                onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))}
                placeholder="Ex: Problème avec un devis, question sur l'abonnement..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Décrivez votre question ou problème..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {sending ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
