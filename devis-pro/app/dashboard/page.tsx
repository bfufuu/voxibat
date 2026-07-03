import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

export default async function DashboardPage(props: { searchParams: Promise<{ abonnement?: string }> }) {
  const session = await getSession()
  if (!session) return null

  const searchParams = await props.searchParams
  const abonnementSucces = searchParams.abonnement === 'succes'

  const now = new Date()
  const [devis, user, facturesStats, facturesEnRetard] = await Promise.all([
    prisma.devis.findMany({
      where: { userId: session.userId },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.user.findUnique({ where: { id: session.userId } }),
    prisma.facture.aggregate({
      where: { userId: session.userId, status: 'payee' },
      _sum: { totalTTC: true },
    }),
    prisma.facture.findMany({
      where: {
        userId: session.userId,
        status: { in: ['envoyee', 'en_retard'] },
        dateEcheance: { lt: now },
      },
      include: { client: true },
      orderBy: { dateEcheance: 'asc' },
    }),
  ])

  const debutAnnee = new Date(now.getFullYear(), 0, 1)
  const finAnnee = new Date(now.getFullYear(), 11, 31, 23, 59, 59)

  const [total, acceptes, ca, caAnnee] = await Promise.all([
    prisma.devis.count({ where: { userId: session.userId } }),
    prisma.devis.count({ where: { userId: session.userId, status: 'accepte' } }),
    prisma.devis.aggregate({
      where: { userId: session.userId, status: 'accepte' },
      _sum: { totalTTC: true },
    }),
    prisma.facture.aggregate({
      where: {
        userId: session.userId,
        status: 'payee',
        createdAt: { gte: debutAnnee, lte: finAnnee },
      },
      _sum: { totalTTC: true },
    }),
  ])

  return (
    <div className="p-8">
      {facturesEnRetard.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="font-semibold text-red-700 mb-2">⚠️ {facturesEnRetard.length} facture{facturesEnRetard.length > 1 ? 's' : ''} en retard de paiement</p>
          <div className="space-y-2">
            {facturesEnRetard.map(f => {
              const joursRetard = Math.floor((now.getTime() - new Date(f.dateEcheance!).getTime()) / (1000 * 60 * 60 * 24))
              return (
                <div key={f.id} className="flex justify-between items-center text-sm">
                  <span className="text-red-600">
                    {f.numero} · {f.client?.name || 'Sans client'} · <strong>{joursRetard} jours de retard</strong>
                  </span>
                  <Link href={`/factures/${f.id}`} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-colors">
                    Relancer →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {abonnementSucces && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
          🎉 Abonnement activé ! Bienvenue dans Voxibat. Vous avez un accès illimité.
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Bonjour {user?.name || user?.email} 👋
        </h2>
        <p className="text-gray-500">Voici un résumé de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total devis</p>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Devis acceptés</p>
          <p className="text-3xl font-bold text-green-600">{acceptes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">CA signé (TTC)</p>
          <p className="text-3xl font-bold text-blue-600">
            {(ca._sum.totalTTC || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">CA encaissé (TTC)</p>
          <p className="text-3xl font-bold text-green-600">
            {(facturesStats._sum.totalTTC || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </div>

      {/* Compteur seuil auto-entrepreneur */}
      {(() => {
        const SEUIL = 77700
        const caAnneeVal = caAnnee._sum.totalTTC || 0
        const pct = Math.min((caAnneeVal / SEUIL) * 100, 100)
        const restant = Math.max(SEUIL - caAnneeVal, 0)
        const couleur = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-orange-400' : 'bg-green-500'
        const alerte = pct >= 90 ? 'border-red-200 bg-red-50' : pct >= 70 ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-white'
        return (
          <div className={`mb-8 p-6 rounded-xl shadow-sm border ${alerte}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-900">Seuil auto-entrepreneur {now.getFullYear()}</p>
                <p className="text-sm text-gray-500">CA encaissé cette année · limite légale : 77 700 €</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {caAnneeVal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
                <p className="text-sm text-gray-500">
                  {restant > 0
                    ? `${restant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} avant le seuil`
                    : '⚠️ Seuil dépassé — changement de statut requis'}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all ${couleur}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">{pct.toFixed(1)}% du seuil atteint</p>
            {pct >= 70 && pct < 90 && (
              <p className="text-sm text-orange-700 mt-2 font-medium">Pensez à consulter un comptable pour préparer votre transition en société.</p>
            )}
            {pct >= 90 && (
              <p className="text-sm text-red-700 mt-2 font-medium">Attention : vous approchez du seuil légal. Contactez un comptable rapidement.</p>
            )}
          </div>
        )
      })()}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Derniers devis</h3>
          <Link href="/devis/nouveau" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nouveau devis
          </Link>
        </div>
        {devis.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore de devis</p>
            <Link href="/devis/nouveau" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Créer votre premier devis
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {devis.map(d => (
              <Link key={d.id} href={`/devis/${d.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{d.titre}</p>
                  <p className="text-sm text-gray-500">{d.numero} · {d.client?.name || 'Sans client'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[d.status]}`}>
                    {STATUS_LABELS[d.status]}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {d.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
