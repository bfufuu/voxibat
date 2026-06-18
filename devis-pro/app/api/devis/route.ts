import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const devis = await prisma.devis.findMany({
    where: { userId: session.userId },
    include: { client: true, lignes: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(devis)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { titre, clientId, lignes, tva } = await request.json()

  const count = await prisma.devis.count({ where: { userId: session.userId } })
  const numero = `DEV-${String(count + 1).padStart(4, '0')}`

  const totalHT = lignes.reduce((sum: number, l: { totalHT: number }) => sum + l.totalHT, 0)
  const tauxTva = tva ?? 20
  const totalTTC = totalHT * (1 + tauxTva / 100)

  const devis = await prisma.devis.create({
    data: {
      numero,
      titre,
      totalHT,
      tva: tauxTva,
      totalTTC,
      userId: session.userId,
      clientId: clientId || null,
      lignes: { create: lignes },
    },
    include: { client: true, lignes: true },
  })

  return NextResponse.json(devis)
}
