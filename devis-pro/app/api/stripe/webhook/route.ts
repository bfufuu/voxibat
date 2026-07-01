import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook non configuré' }, { status: 400 })
  }

  let event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  switch (event.type) {
    // Abonnement activé avec succès
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as { id: string; status: string; metadata: { userId?: string }; customer: string }
      const userId = subscription.metadata?.userId

      if (userId && subscription.status === 'active') {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPaid: true,
            stripeSubscriptionId: subscription.id,
          },
        })
      }
      break
    }

    // Abonnement annulé ou paiement échoué
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as { metadata: { userId?: string } }
      const userId = subscription.metadata?.userId

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { isPaid: false, stripeSubscriptionId: null },
        })
      }
      break
    }

    // Paiement échoué
    case 'invoice.payment_failed': {
      const invoice = event.data.object as { subscription?: string }
      if (invoice.subscription) {
        const sub = await getStripe().subscriptions.retrieve(invoice.subscription as string)
        const userId = sub.metadata?.userId
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { isPaid: false },
          })
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
