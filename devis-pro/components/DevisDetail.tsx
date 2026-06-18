'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type LigneDevis = {
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

type Devis = {
  id: string
  numero: string
  titre: string
  status: string
  totalHT: number
  tva: number
  totalTTC: number
  createdAt: Date
  client: Client | null
  lignes: LigneDevis[]
  user: User
}

const STATUS_LABELS: Record<string, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé',
}

const STATUS_COLORS: Record<string, string> = {
  brouillon: 'bg-gray-100 text-gray-600',
  envoye: 'bg-blue-100 text-blue-600',
  accepte: 'bg-green-100 text-green-600',
  refuse: 'bg-red-100 text-red-600',
}

export default function DevisDetail({ devis }: { devis: Devis }) {
  const router = useRouter()
  const [status, setStatus] = useState(devis.status)
  const [updating, setUpdating] = useState(false)
  const [creatingFacture, setCreatingFacture] = useState(false)

  async function handleCreateFacture() {
    setCreatingFacture(true)
    const res = await fetch('/api/factures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devisId: devis.id }),
    })
    const data = await res.json()
    setCreatingFacture(false)
    if (res.ok) {
      router.push(`/factures/${data.id}`)
    } else {
      alert(data.error)
    }
  }

  async function updateStatus(newStatus: string) {
    setUpdating(true)
    await fetch(`/api/devis/${devis.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setStatus(newStatus)
    setUpdating(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce devis ?')) return
    await fetch(`/api/devis/${devis.id}`, { method: 'DELETE' })
    router.push('/devis')
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 print:hidden">
        <div>
          <Link href="/devis" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
            ← Retour aux devis
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">{devis.titre}</h2>
          <p className="text-gray-500">{devis.numero}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={e => updateStatus(e.target.value)}
            disabled={updating}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border-0 focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[status]}`}
          >
            <option value="brouillon">Brouillon</option>
            <option value="envoye">Envoyé</option>
            <option value="accepte">Accepté</option>
            <option value="refuse">Refusé</option>
          </select>
          {(status === 'accepte' || status === 'envoye') && (
            <button
              onClick={handleCreateFacture}
              disabled={creatingFacture}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {creatingFacture ? '⏳...' : '🧾 Créer la facture'}
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            🖨️ Imprimer / PDF
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Devis document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{devis.user.company || devis.user.name || devis.user.email}</h1>
            {devis.user.siret && <p className="text-sm text-gray-500">SIRET : {devis.user.siret}</p>}
            {devis.user.address && <p className="text-sm text-gray-500">{devis.user.address}</p>}
            {devis.user.phone && <p className="text-sm text-gray-500">{devis.user.phone}</p>}
            <p className="text-sm text-gray-500">{devis.user.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-600 mb-1">DEVIS</h2>
            <p className="font-medium">{devis.numero}</p>
            <p className="text-sm text-gray-500">Le {new Date(devis.createdAt).toLocaleDateString('fr-FR')}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[status]}`}>
              {STATUS_LABELS[status]}
            </span>
          </div>
        </div>

        {/* Client */}
        {devis.client && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Destinataire</p>
            <p className="font-semibold text-gray-900">{devis.client.name}</p>
            {devis.client.email && <p className="text-sm text-gray-600">{devis.client.email}</p>}
            {devis.client.phone && <p className="text-sm text-gray-600">{devis.client.phone}</p>}
            {devis.client.address && <p className="text-sm text-gray-600">{devis.client.address}</p>}
          </div>
        )}

        {/* Objet */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-1">Objet</p>
          <p className="font-semibold text-gray-900">{devis.titre}</p>
        </div>

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
            {devis.lignes.map((ligne, i) => (
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
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total HT</span>
              <span className="font-medium">{devis.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA ({devis.tva}%)</span>
              <span className="font-medium">{(devis.totalHT * devis.tva / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
              <span>Total TTC</span>
              <span className="text-blue-600">{devis.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
          </div>
        </div>

        {/* Mentions légales */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-xs text-gray-400 space-y-1">
          <p>Devis valable 30 jours à compter de la date d'émission.</p>
          <p>En cas d'acceptation, retourner ce document signé avec la mention "Bon pour accord".</p>
          <p>Conditions de règlement : 30% à la commande, solde à la livraison.</p>
        </div>
      </div>
    </div>
  )
}
