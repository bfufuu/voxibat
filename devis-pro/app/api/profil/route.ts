import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, company: true, siret: true, address: true, phone: true },
  })

  return NextResponse.json(user)
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { name, company, siret, address, phone } = await request.json()

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { name, company, siret, address, phone },
    select: { id: true, email: true, name: true, company: true, siret: true, address: true, phone: true },
  })

  return NextResponse.json(user)
}
