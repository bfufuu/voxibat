import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'furrer.benjamin5@gmail.com'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const admin = await prisma.user.findUnique({ where: { id: session.userId }, select: { email: true } })
  if (!admin || admin.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { userId, isPaid } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 })

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isPaid },
    select: { email: true, isPaid: true },
  })

  return NextResponse.json(user)
}
