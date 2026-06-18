'use client'

import { useEffect, useState } from 'react'

type Tarif = {
  id: string
  designation: string
  unite: string
  prixUnitaire: number
  categorie: string | null
}

const CATEGORIES_SUGGERES = [
  'Main d\'œuvre',
  'Fournitures',
  'Plomberie',
  'Électricité',
  'Peinture',
  'Maçonnerie',
  'Menuiserie',
  'Chauffage',
  'Carrelage',
  'Isolation',
]

const UNITES_SUGGERES = ['forfait', 'heure', 'm²', 'ml', 'unité', 'm³', 'kg', 'jour']

export default function TarifsPage() {
  const [tarifs, setTarifs] = useState<Tarif[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Formulaire ajout
  const [form, setForm] = useState({ designation: '', unite: 'forfait', prixUnitaire: '', categorie: '' })

  // Tarif en cours d'édition
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ designation: '', unite: '', prixUnitaire: '', categorie: '' })

  useEffect(() => {
    fetch('/api/tarifs')
      .then(r => r.json())
      .then(data => { setTarifs(data); setLoading(false) })
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.designation || !form.prixUnitaire) return
    setSaving(true)
    const res = await fetch('/api/tarifs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setTarifs(prev => [...prev, data])
      setForm({ designation: '', unite: 'forfait', prixUnitaire: '', categorie: '' })
      setMsg('✅ Tarif ajouté')
      setTimeout(() => setMsg(''), 2000)
    }
  }

  function startEdit(t: Tarif) {
    setEditingId(t.id)
    setEditForm({ designation: t.designation, unite: t.unite, prixUnitaire: String(t.prixUnitaire), categorie: t.categorie || '' })
  }

  async function handleEdit(id: string) {
    setSaving(true)
    const res = await fetch(`/api/tarifs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setTarifs(prev => prev.map(t => t.id === id ? data : t))
      setEditingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce tarif ?')) return
    await fetch(`/api/tarifs/${id}`, { method: 'DELETE' })
    setTarifs(prev => prev.filter(t => t.id !== id))
  }

  // Grouper par catégorie
  const grouped = tarifs.reduce<Record<string, Tarif[]>>((acc, t) => {
    const cat = t.categorie || 'Sans catégorie'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {})

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mon catalogue de tarifs</h2>
        <p className="text-gray-500 mt-1">
          L'IA utilisera vos tarifs en priorité lors de la génération des devis.
        </p>
      </div>

      {/* Formulaire ajout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">➕ Ajouter un tarif</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Désignation *</label>
            <input
              type="text"
              placeholder="Ex: Main d'œuvre plomberie"
              value={form.designation}
              onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Unité</label>
            <select
              value={form.unite}
              onChange={e => setForm(f => ({ ...f, unite: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {UNITES_SUGGERES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Prix unitaire HT (€) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="55.00"
              value={form.prixUnitaire}
              onChange={e => setForm(f => ({ ...f, prixUnitaire: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Catégorie</label>
            <input
              type="text"
              list="categories-list"
              placeholder="Ex: Plomberie"
              value={form.categorie}
              onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <datalist id="categories-list">
              {CATEGORIES_SUGGERES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="md:col-span-5 flex justify-between items-center">
            {msg && <span className="text-sm text-green-600">{msg}</span>}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                {saving ? 'Enregistrement...' : 'Ajouter au catalogue'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Catalogue */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : tarifs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 font-medium mb-1">Votre catalogue est vide</p>
          <p className="text-sm text-gray-400">
            Ajoutez vos tarifs habituels — l'IA les utilisera automatiquement pour générer des devis précis.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort().map(([cat, items]) => (
            <div key={cat} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <h4 className="font-semibold text-gray-700 text-sm">{cat} <span className="text-gray-400 font-normal">({items.length})</span></h4>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-50">
                    <th className="px-6 py-2 text-left font-medium">Désignation</th>
                    <th className="px-4 py-2 text-center font-medium w-24">Unité</th>
                    <th className="px-4 py-2 text-right font-medium w-32">Prix HT</th>
                    <th className="px-4 py-2 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      {editingId === t.id ? (
                        <>
                          <td className="px-6 py-2">
                            <input
                              type="text"
                              value={editForm.designation}
                              onChange={e => setEditForm(f => ({ ...f, designation: e.target.value }))}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={editForm.unite}
                              onChange={e => setEditForm(f => ({ ...f, unite: e.target.value }))}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none"
                            >
                              {UNITES_SUGGERES.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.prixUnitaire}
                              onChange={e => setEditForm(f => ({ ...f, prixUnitaire: e.target.value }))}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => handleEdit(t.id)}
                              disabled={saving}
                              className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-2"
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-400 hover:text-gray-600 text-xs"
                            >
                              ✕
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-3 text-gray-900">{t.designation}</td>
                          <td className="px-4 py-3 text-center text-gray-500">{t.unite}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            {t.prixUnitaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => startEdit(t)}
                              className="text-gray-400 hover:text-blue-600 transition-colors mr-3 text-xs"
                              title="Modifier"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-center mt-2">
            {tarifs.length} tarif{tarifs.length > 1 ? 's' : ''} dans votre catalogue
          </p>
        </div>
      )}
    </div>
  )
}
