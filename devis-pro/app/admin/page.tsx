import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Voxibat',
}

const ADMIN_EMAIL = 'furrer.benjamin5@gmail.com'

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard')

  const now = new Date()
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
  const debutAnnee = new Date(now.getFullYear(), 0, 1)

  const [
    totalUsers,
    newUsersThisMonth,
    paidUsers,
    trialUsers,
    caTotal,
    caMois,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: debutMois } } }),
    prisma.user.count({ where: { isPaid: true } }),
    prisma.user.count({
      where: {
        isPaid: false,
        trialEndsAt: { gte: now },
      },
    }),
    prisma.user.count().then(() =>
      // CA Voxibat = nb clients payants × 49€
      0
    ),
    prisma.user.count({ where: { isPaid: true, createdAt: { gte: debutMois } } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, name: true, isPaid: true, trialEndsAt: true, createdAt: true },
    }),
  ])

  const revenuMensuel = paidUsers * 49
  const revenuAnnuelProjecte = revenuMensuel * 12
  const tauxConversion = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500">Vue globale de Voxibat — accès restreint</p>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Clients total</p>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            <p className="text-xs text-green-600 mt-1">+{newUsersThisMonth} ce mois</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Abonnés payants</p>
            <p className="text-3xl font-bold text-blue-600">{paidUsers}</p>
            <p className="text-xs text-gray-400 mt-1">Taux conversion : {tauxConversion}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">En essai gratuit</p>
            <p className="text-3xl font-bold text-orange-500">{trialUsers}</p>
            <p className="text-xs text-gray-400 mt-1">Clients potentiels</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Revenu mensuel</p>
            <p className="text-3xl font-bold text-green-600">
              {revenuMensuel.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{paidUsers} × 49€</p>
          </div>
        </div>

        {/* Seuil auto-entrepreneur */}
        {(() => {
          const SEUIL = 77700
          const caAnnee = paidUsers * 49 * now.getMonth()
          const pct = Math.min((caAnnee / SEUIL) * 100, 100)
          const restant = Math.max(SEUIL - caAnnee, 0)
          const couleur = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-orange-400' : 'bg-blue-500'
          return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">Seuil auto-entrepreneur {now.getFullYear()}</p>
                  <p className="text-sm text-gray-500">CA Voxibat estimé cette année · limite : 77 700 €</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {caAnnee.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {restant > 0
                      ? `${restant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} avant le seuil`
                      : '⚠️ Seuil dépassé — passage en société requis'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${couleur}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>{pct.toFixed(1)}% du seuil</span>
                <span>Projection annuelle : {revenuAnnuelProjecte.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            </div>
          )
        })()}

        {/* Derniers inscrits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Derniers inscrits</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">{u.name || u.email}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  {u.isPaid ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Payant</span>
                  ) : u.trialEndsAt && new Date(u.trialEndsAt) > now ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">Essai</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">Expiré</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
