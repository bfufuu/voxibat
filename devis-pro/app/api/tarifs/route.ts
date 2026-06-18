import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const tarifs = await prisma.tarif.findMany({
    where: { userId: session.userId },
    orderBy: [{ categorie: 'asc' }, { designation: 'asc' }],
  })

  return NextResponse.json(tarifs)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { designation, unite, prixUnitaire, categorie } = body

  if (!designation || !prixUnitaire) {
    return NextResponse.json({ error: 'Désignation et prix obligatoires' }, { status: 400 })
  }

  const tarif = await prisma.tarif.create({
    data: {
      designation: designation.trim(),
      unite: unite?.trim() || 'forfait',
      prixUnitaire: parseFloat(prixUnitaire),
      categorie: categorie?.trim() || null,
      userId: session.userId,
    },
  })

  return NextResponse.json(tarif, { status: 201 })
}
