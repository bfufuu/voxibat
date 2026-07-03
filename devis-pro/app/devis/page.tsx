import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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

export default async function DevisListPage() {
  const session = await getSession()
  if (!session) return null

  const devis = await prisma.devis.findMany({
    where: { userId: session.userId },
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 pl-10 md:pl-0">Mes devis</h2>
        <Link href="/devis/nouveau" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
          + Nouveau
        </Link>
      </div>

      {devis.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-4">📄</p>
          <p className="text-gray-500 mb-4">Aucun devis pour le moment</p>
          <Link href="/devis/nouveau" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Créer votre premier devis
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {devis.map(d => (
            <Link
              key={d.id}
              href={`/devis/${d.id}`}
              className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-blue-200 hover:shadow-md transition-all gap-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{d.titre}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {d.numero} · {d.client?.name || 'Sans client'} · {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[d.status]}`}>
                  {STATUS_LABELS[d.status]}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {d.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
