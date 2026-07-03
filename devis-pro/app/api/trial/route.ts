import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const WHITELISTED_EMAILS = ['furrer.benjamin5@gmail.com', 'test-verify@voxibat.fr']

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true, trialEndsAt: true, isPaid: true },
  })

  if (!user) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  if (WHITELISTED_EMAILS.includes(user.email)) return NextResponse.json({ active: true })

  if (user.isPaid) return NextResponse.json({ active: true })

  if (!user.trialEndsAt) return NextResponse.json({ active: true })

  const now = new Date()
  const diff = user.trialEndsAt.getTime() - now.getTime()
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) {
    return NextResponse.json({ expired: true, daysLeft: 0 })
  }

  return NextResponse.json({ active: true, daysLeft })
}
