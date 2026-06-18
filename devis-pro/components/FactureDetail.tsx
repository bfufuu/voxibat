'use client'

import { useState } from 'react'
import Link from 'next/link'

type LigneFacture = {
  id: string
  designation: string
  unite: string
  quantite: number
  prixUnitaire: number
  totalHT: number
}

type Client = {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
}

type User = {
  name?: string | null
  company?: string | null
  siret?: string | null
  address?: string | null
  phone?: string | null
  email: string
}

type Relance = {
  id: string
  sentAt: Date
  numero: number
  emailTo: string
}

type Facture = {
  id: string
  numero: string
  status: string
  totalHT: number
  tva: number
  totalTTC: number
  dateEcheance: Date | null
  createdAt: Date
  client: Client | null
  lignes: LigneFacture[]
  relances: Relance[]
  user: User
  devis: { id: string } | null
}

const STATUS_LABELS: Record<string, string> = {
  envoyee: 'Envoyée',
  payee: 'Payée',
  en_retard: 'En retard',
  annulee: 'Annulée',
}

const STATUS_COLORS: Record<string, string> = {
  envoyee: 'bg-blue-100 text-blue-600',
  payee: 'bg-green-100 text-green-600',
  en_retard: 'bg-red-100 text-red-600',
  annulee: 'bg-gray-100 text-gray-500',
}

export default function FactureDetail({ facture }: { facture: Facture }) {
  const [status, setStatus] = useState(facture.status)
  const [updating, setUpdating] = useState(false)
  const [relancing, setRelancing] = useState(false)
  const [relances, setRelances] = useState(facture.relances || [])
  const [relanceMsg, setRelanceMsg] = useState('')

  async function handleRelancer() {
    if (!facture.client?.email) {
      setRelanceMsg('❌ Ce client n\'a pas d\'email enregistré')
      return
    }
    setRelancing(true)
    setRelanceMsg('')
    const res = await fetch(`/api/factures/${facture.id}/relancer`, { method: 'POST' })
    const data = await res.json()
    setRelancing(false)
    if (res.ok) {
      setRelanceMsg(`✅ Relance n°${data.numeroRelance} envoyée à ${facture.client.email}`)
      setRelances(prev => [...prev, { id: Date.now().toString(), sentAt: new Date(), numero: data.numeroRelance, emailTo: facture.client!.email! }])
      if (status === 'envoyee') setStatus('en_retard')
    } else {
      setRelanceMsg(`❌ ${data.error}`)
    }
  }

  const enRetard = status === 'envoyee' && facture.dateEcheance && new Date(facture.dateEcheance) < new Date()
  const displayStatus = enRetard ? 'en_retard' : status

  async function updateStatus(newStatus: string) {
    setUpdating(true)
    await fetch(`/api/factures/${facture.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setStatus(newStatus)
    setUpdating(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 print:hidden">
        <div>
          <Link href="/factures" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
            ← Retour aux factures
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">{facture.numero}</h2>
          {facture.devis && (
            <Link href={`/devis/${facture.devis.id}`} className="text-sm text-gray-500 hover:underline">
              Voir le devis d'origine
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={status}
            onChange={e => updateStatus(e.target.value)}
            disabled={updating}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border-0 focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[displayStatus]}`}
          >
            <option value="envoyee">Envoyée</option>
            <option value="payee">Payée ✅</option>
            <option value="annulee">Annulée</option>
          </select>
          {status !== 'payee' && status !== 'annulee' && (
            <button
              onClick={handleRelancer}
              disabled={relancing}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {relancing ? '⏳ Envoi...' : `📧 Relancer${relances.length > 0 ? ` (${relances.length + 1}ème)` : ''}`}
            </button>
          )}
          <a
            href={`/api/factures/${facture.id}/facturx`}
            download
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
            title="Télécharger le fichier XML Factur-X (norme EN 16931) pour la facturation électronique 2026"
          >
            📄 Factur-X XML
          </a>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            🖨️ Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Message relance */}
      {relanceMsg && (
        <div className={`mb-4 p-4 rounded-xl text-sm print:hidden ${relanceMsg.startsWith('✅') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {relanceMsg}
        </div>
      )}

      {/* Alerte retard */}
      {enRetard && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm print:hidden">
          ⚠️ Cette facture est en retard de paiement. Cliquez sur "Relancer" pour envoyer un email à votre client.
        </div>
      )}

      {/* Historique relances */}
      {relances.length > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 print:hidden">
          <p className="text-sm font-medium text-orange-800 mb-2">📧 Historique des relances</p>
          <div className="space-y-1">
            {relances.map(r => (
              <div key={r.id} className="flex justify-between text-xs text-orange-700">
                <span>Relance n°{r.numero} → {r.emailTo}</span>
                <span>{new Date(r.sentAt).toLocaleDateString('fr-FR')} à {new Date(r.sentAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document facture */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl print:shadow-none print:border-none print:p-0">

        {/* En-tête */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {facture.user.company || facture.user.name || facture.user.email}
            </h1>
            {facture.user.siret && <p className="text-sm text-gray-500">SIRET : {facture.user.siret}</p>}
            {facture.user.address && <p className="text-sm text-gray-500">{facture.user.address}</p>}
            {facture.user.phone && <p className="text-sm text-gray-500">{facture.user.phone}</p>}
            <p className="text-sm text-gray-500">{facture.user.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">FACTURE</h2>
            <p className="font-medium text-blue-600">{facture.numero}</p>
            <p className="text-sm text-gray-500">
              Émise le {new Date(facture.createdAt).toLocaleDateString('fr-FR')}
            </p>
            {facture.dateEcheance && (
              <p className={`text-sm font-medium mt-1 ${enRetard ? 'text-red-600' : 'text-gray-600'}`}>
                Échéance : {new Date(facture.dateEcheance).toLocaleDateString('fr-FR')}
              </p>
            )}
            <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[displayStatus]}`}>
              {STATUS_LABELS[displayStatus]}
            </span>
          </div>
        </div>

        {/* Client */}
        {facture.client && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Facturé à</p>
            <p className="font-semibold text-gray-900">{facture.client.name}</p>
            {facture.client.email && <p className="text-sm text-gray-600">{facture.client.email}</p>}
            {facture.client.phone && <p className="text-sm text-gray-600">{facture.client.phone}</p>}
            {facture.client.address && <p className="text-sm text-gray-600">{facture.client.address}</p>}
          </div>
        )}

        {/* Lignes */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-4 py-3 text-left font-medium">Désignation</th>
              <th className="px-4 py-3 text-center font-medium w-20">Unité</th>
              <th className="px-4 py-3 text-right font-medium w-16">Qté</th>
              <th className="px-4 py-3 text-right font-medium w-28">Prix unit. HT</th>
              <th className="px-4 py-3 text-right font-medium w-28">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {facture.lignes.map((ligne, i) => (
              <tr key={ligne.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-900">{ligne.designation}</td>
                <td className="px-4 py-3 text-center text-gray-500">{ligne.unite}</td>
                <td className="px-4 py-3 text-right text-gray-700">{ligne.quantite}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {ligne.prixUnitaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {ligne.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total HT</span>
              <span className="font-medium">{facture.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA ({facture.tva}%)</span>
              <span className="font-medium">{(facture.totalHT * facture.tva / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
              <span>Total TTC</span>
              <span className="text-blue-600">{facture.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
          </div>
        </div>

        {/* Mentions légales obligatoires */}
        <div className="pt-6 border-t border-gray-200 text-xs text-gray-400 space-y-1">
          <p className="font-medium text-gray-500">Conditions de règlement</p>
          <p>Paiement à 30 jours à compter de la date d'émission de la facture.</p>
          <p>En cas de retard de paiement, des pénalités de retard au taux de 3 fois le taux d'intérêt légal seront appliquées, ainsi qu'une indemnité forfaitaire de recouvrement de 40€ (Art. L441-10 du Code de commerce).</p>
          {facture.user.siret && (
            <p className="mt-2">SIRET : {facture.user.siret}</p>
          )}
        </div>

        {/* Badge conformité Factur-X */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            <span>✅</span>
            <span className="font-medium">Conforme Factur-X EN 16931 — Facturation électronique 2026</span>
          </div>
          <a
            href={`/api/factures/${facture.id}/facturx`}
            download
            className="text-xs text-indigo-600 hover:text-indigo-800 underline"
          >
            Télécharger le XML →
          </a>
        </div>
      </div>
    </div>
  )
}
