import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StripeButton from '@/components/StripeButton'
import LogoutButton from '@/components/LogoutButton'

export default async function AbonnementPage() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { isPaid: true, trialEndsAt: true },
  })

  const now = new Date()
  const trialExpired = user?.trialEndsAt ? user.trialEndsAt < now : false

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-sm max-w-md w-full text-center">
        {trialExpired ? (
          <>
            <div className="text-5xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre essai gratuit est terminé</h1>
            <p className="text-gray-500 mb-8">
              Abonnez-vous pour continuer à créer des devis illimités avec l'IA.
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🚀</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Passez à l'abonnement</h1>
            <p className="text-gray-500 mb-8">
              Continuez à utiliser Quotio sans interruption.
            </p>
          </>
        )}

        <div className="bg-blue-600 text-white p-6 rounded-xl mb-6">
          <div className="text-4xl font-bold mb-1">
            39€<span className="text-lg font-normal">/mois</span>
          </div>
          <p className="text-blue-200 text-sm mb-5">Sans engagement · Résiliable à tout moment</p>
          <ul className="text-sm space-y-2 text-left mb-6">
            <li>✅ Devis illimités</li>
            <li>✅ Génération par IA</li>
            <li>✅ Commande vocale</li>
            <li>✅ PDF professionnels</li>
            <li>✅ Gestion clients illimitée</li>
            <li>✅ Support inclus</li>
          </ul>
          <StripeButton />
        </div>

        <p className="text-xs text-gray-400 mb-6">
          Paiement sécurisé par Stripe · CB, Visa, Mastercard acceptés
        </p>

        <div className="border-t border-gray-100 pt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
