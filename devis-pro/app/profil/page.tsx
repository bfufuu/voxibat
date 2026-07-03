'use client'

import { useState, useEffect } from 'react'

type Profil = {
  name: string
  email: string
  company: string
  siret: string
  address: string
  phone: string
}

export default function ProfilPage() {
  const [profil, setProfil] = useState<Profil>({ name: '', email: '', company: '', siret: '', address: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/profil').then(r => r.json()).then(data => {
      setProfil({
        name: data.name || '',
        email: data.email || '',
        company: data.company || '',
        siret: data.siret || '',
        address: data.address || '',
        phone: data.phone || '',
      })
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/profil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profil),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl pb-24">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Mon profil</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <p className="text-sm text-gray-500">Ces informations apparaîtront sur vos devis.</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">

          <div className="p-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Votre nom</label>
            <input
              type="text"
              value={profil.name}
              onChange={e => setProfil(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jean Dupont"
            />
          </div>

          <div className="p-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={profil.email}
              disabled
              className="w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400"
            />
          </div>

          <div className="p-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Nom de l'entreprise</label>
            <input
              type="text"
              value={profil.company}
              onChange={e => setProfil(p => ({ ...p, company: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Plomberie Martin SARL"
            />
          </div>

          <div className="p-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">SIRET</label>
            <input
              type="text"
              value={profil.siret}
              onChange={e => setProfil(p => ({ ...p, siret: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12345678901234"
            />
          </div>

          <div className="p-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
            <input
              type="tel"
              value={profil.phone}
              onChange={e => setProfil(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="06 12 34 56 78"
            />
          </div>

          <div className="p-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Adresse</label>
            <input
              type="text"
              value={profil.address}
              onChange={e => setProfil(p => ({ ...p, address: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12 rue de la Paix, 75001 Paris"
            />
          </div>
        </div>

        {/* Bouton fixe en bas sur mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:relative md:p-0 md:bg-transparent md:border-0">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
            {saved && <span className="text-green-600 text-sm font-medium">✓ Enregistré</span>}
          </div>
        </div>
      </form>
    </div>
  )
}
