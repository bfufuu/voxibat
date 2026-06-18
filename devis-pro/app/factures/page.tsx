import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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

export default async function FacturesPage() {
  const session = await getSession()
  if (!session) return null

  const factures = await prisma.facture.findMany({
    where: { userId: session.userId },
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  })

  // Stats
  const totalEncaisse = factures
    .filter(f => f.status === 'payee')
    .reduce((sum, f) => sum + f.totalTTC, 0)

  const totalEnAttente = factures
    .filter(f => f.status === 'envoyee')
    .reduce((sum, f) => sum + f.totalTTC, 0)

  const totalEnRetard = factures
    .filter(f => f.status === 'en_retard')
    .reduce((sum, f) => sum + f.totalTTC, 0)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mes factures</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Encaissé</p>
          <p className="text-2xl font-bold text-green-600">
            {totalEncaisse.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalEnAttente.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">En retard</p>
          <p className="text-2xl font-bold text-red-600">
            {totalEnRetard.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {factures.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-4">🧾</p>
            <p className="text-gray-500 mb-2">Aucune facture pour le moment</p>
            <p className="text-sm text-gray-400">Les factures sont créées depuis un devis accepté</p>
            <Link href="/devis" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Voir mes devis
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total TTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {factures.map(f => {
                const enRetard = f.status === 'envoyee' && f.dateEcheance && new Date(f.dateEcheance) < new Date()
                const displayStatus = enRetard ? 'en_retard' : f.status
                return (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/factures/${f.id}`} className="text-blue-600 font-medium hover:underline">
                        {f.numero}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{f.client?.name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[displayStatus]}`}>
                        {STATUS_LABELS[displayStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {f.dateEcheance ? new Date(f.dateEcheance).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {f.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
