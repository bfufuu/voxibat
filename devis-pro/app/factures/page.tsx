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

  const totalEncaisse = factures.filter(f => f.status === 'payee').reduce((s, f) => s + f.totalTTC, 0)
  const totalEnAttente = factures.filter(f => f.status === 'envoyee').reduce((s, f) => s + f.totalTTC, 0)
  const totalEnRetard = factures.filter(f => f.status === 'en_retard').reduce((s, f) => s + f.totalTTC, 0)

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 pl-10 md:pl-0">Mes factures</h2>
      </div>

      {/* Stats — 3 colonnes compactes */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Encaissé</p>
          <p className="text-base md:text-xl font-bold text-green-600">
            {totalEncaisse.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-base md:text-xl font-bold text-blue-600">
            {totalEnAttente.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">En retard</p>
          <p className="text-base md:text-xl font-bold text-red-600">
            {totalEnRetard.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {factures.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-4">🧾</p>
          <p className="text-gray-500 mb-2">Aucune facture pour le moment</p>
          <p className="text-sm text-gray-400 mb-4">Les factures sont créées depuis un devis accepté</p>
          <Link href="/devis" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Voir mes devis
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {factures.map(f => {
            const enRetard = f.status === 'envoyee' && f.dateEcheance && new Date(f.dateEcheance) < new Date()
            const displayStatus = enRetard ? 'en_retard' : f.status
            return (
              <Link
                key={f.id}
                href={`/factures/${f.id}`}
                className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-blue-200 hover:shadow-md transition-all gap-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{f.numero}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {f.client?.name || 'Sans client'}
                    {f.dateEcheance ? ` · échéance ${new Date(f.dateEcheance).toLocaleDateString('fr-FR')}` : ''}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[displayStatus]}`}>
                    {STATUS_LABELS[displayStatus]}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {f.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
