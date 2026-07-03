'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Ligne = {
  designation: string
  unite: string
  quantite: number
  prixUnitaire: number
  totalHT: number
}

type Client = {
  id: string
  name: string
  email?: string
}

export default function NouveauDevisPage() {
  const router = useRouter()
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [tva, setTva] = useState(20)
  const [lignes, setLignes] = useState<Ligne[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState('')
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' })
  const [showNewClient, setShowNewClient] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [recording, setRecording] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  function toggleVoice() {
    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("La commande vocale n'est pas supportée par votre navigateur (utilisez Chrome)")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = true
    recognition.interimResults = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join('')
      setDescription(transcript)
    }
    recognition.onerror = () => { setRecording(false); setError('Erreur microphone. Vérifiez les permissions.') }
    recognition.onend = () => setRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(setClients)
  }, [])

  const totalHT = lignes.reduce((sum, l) => sum + l.totalHT, 0)
  const totalTTC = totalHT * (1 + tva / 100)

  async function generateWithAI() {
    if (!description.trim()) { setError('Décrivez le chantier avant de générer'); return }
    setAiLoading(true); setError('')
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })
    const data = await res.json()
    setAiLoading(false)
    if (!res.ok) { setError(data.error); return }
    setLignes(data.lignes)
  }

  function updateLigne(index: number, field: keyof Ligne, value: string | number) {
    setLignes(prev => {
      const updated = [...prev]
      const ligne = { ...updated[index], [field]: value }
      if (field === 'quantite' || field === 'prixUnitaire') {
        ligne.totalHT = Number(ligne.quantite) * Number(ligne.prixUnitaire)
      }
      if (field === 'totalHT') ligne.totalHT = Number(value)
      updated[index] = ligne
      return updated
    })
  }

  function addLigne() {
    setLignes(prev => [...prev, { designation: '', unite: 'forfait', quantite: 1, prixUnitaire: 0, totalHT: 0 }])
  }

  function removeLigne(index: number) {
    setLignes(prev => prev.filter((_, i) => i !== index))
  }

  async function handleCreateClient() {
    if (!newClient.name) return
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    })
    const client = await res.json()
    setClients(prev => [client, ...prev])
    setClientId(client.id)
    setShowNewClient(false)
    setNewClient({ name: '', email: '', phone: '' })
  }

  async function handleSave() {
    if (!titre.trim()) { setError('Ajoutez un titre au devis'); return }
    if (lignes.length === 0) { setError('Ajoutez au moins une ligne'); return }
    setSaving(true)
    const res = await fetch('/api/devis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, clientId, lignes, tva }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error); return }
    router.push(`/devis/${data.id}`)
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl pb-24">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Nouveau devis</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      <div className="space-y-4">
        {/* Infos de base */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Informations</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre du devis *</label>
              <input
                type="text"
                value={titre}
                onChange={e => setTitre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Rénovation salle de bain - M. Martin"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Sans client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TVA</label>
                <select
                  value={tva}
                  onChange={e => setTva(Number(e.target.value))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value={5.5}>5,5%</option>
                  <option value={10}>10%</option>
                  <option value={20}>20%</option>
                </select>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowNewClient(!showNewClient)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            + Ajouter un nouveau client
          </button>
          {showNewClient && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
              <input
                placeholder="Nom *"
                value={newClient.name}
                onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Email"
                value={newClient.email}
                onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <input
                  placeholder="Téléphone"
                  value={newClient.phone}
                  onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleCreateClient} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium">
                  OK
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Génération IA */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">🤖 Génération par IA</h3>
          <div className="relative mb-3">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Décrivez le chantier... ou appuyez sur 🎤 pour parler"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 resize-none pr-12 ${recording ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={toggleVoice}
              className={`absolute right-2 top-2 w-9 h-9 rounded-full flex items-center justify-center transition-colors text-lg ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              🎤
            </button>
          </div>
          {recording && (
            <p className="text-xs text-red-500 flex items-center gap-1 mb-2">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Dictée en cours... tapez à nouveau sur 🎤 pour arrêter
            </p>
          )}
          <button
            onClick={generateWithAI}
            disabled={aiLoading}
            className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {aiLoading ? '⏳ Génération en cours...' : '✨ Générer les lignes avec l\'IA'}
          </button>
        </div>

        {/* Lignes du devis — cartes sur mobile */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Lignes du devis</h3>
            <button
              onClick={addLigne}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              + Ajouter
            </button>
          </div>

          {lignes.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">
              Utilisez l'IA ou ajoutez une ligne manuellement
            </div>
          ) : (
            <div className="space-y-3">
              {lignes.map((ligne, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={ligne.designation}
                      onChange={e => updateLigne(i, 'designation', e.target.value)}
                      placeholder="Désignation"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button onClick={() => removeLigne(i)} className="text-red-400 hover:text-red-600 px-2 text-lg">✕</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Unité</label>
                      <input
                        value={ligne.unite}
                        onChange={e => updateLigne(i, 'unite', e.target.value)}
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Quantité</label>
                      <input
                        type="number"
                        value={ligne.quantite}
                        onChange={e => updateLigne(i, 'quantite', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 text-right focus:outline-none focus:ring-1 focus:ring-blue-500 mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Prix HT (€)</label>
                      <input
                        type="number"
                        value={ligne.prixUnitaire}
                        onChange={e => updateLigne(i, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 text-right focus:outline-none focus:ring-1 focus:ring-blue-500 mt-0.5"
                      />
                    </div>
                  </div>
                  <div className="text-right text-sm font-semibold text-gray-900">
                    Total HT : {ligne.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {lignes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-right text-sm">
              <div className="text-gray-600">
                Total HT : <span className="font-medium text-gray-900">{totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="text-gray-600">
                TVA ({tva}%) : <span className="font-medium text-gray-900">{(totalHT * tva / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="text-base font-bold text-gray-900">
                Total TTC : {totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton enregistrer fixe en bas sur mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:relative md:p-0 md:bg-transparent md:border-0 md:mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-base shadow"
        >
          {saving ? 'Enregistrement...' : '💾 Enregistrer le devis'}
        </button>
      </div>
    </div>
  )
}
