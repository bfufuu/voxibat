import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { designation, unite, prixUnitaire, categorie } = body

  const existing = await prisma.tarif.findFirst({ where: { id, userId: session.userId } })
  if (!existing) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const tarif = await prisma.tarif.update({
    where: { id },
    data: {
      designation: designation?.trim() ?? existing.designation,
      unite: unite?.trim() ?? existing.unite,
      prixUnitaire: prixUnitaire !== undefined ? parseFloat(prixUnitaire) : existing.prixUnitaire,
      categorie: categorie !== undefined ? (categorie?.trim() || null) : existing.categorie,
    },
  })

  return NextResponse.json(tarif)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  const existing = await prisma.tarif.findFirst({ where: { id, userId: session.userId } })
  if (!existing) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  await prisma.tarif.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
