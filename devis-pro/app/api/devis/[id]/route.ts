import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/devis/[id]'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await ctx.params
  const devis = await prisma.devis.findFirst({
    where: { id, userId: session.userId },
    include: { client: true, lignes: true, user: true },
  })

  if (!devis) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(devis)
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/devis/[id]'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await ctx.params
  const { status, titre, clientId, lignes, tva } = await request.json()

  const existing = await prisma.devis.findFirst({ where: { id, userId: session.userId } })
  if (!existing) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  let updateData: Record<string, unknown> = {}

  if (status !== undefined) updateData.status = status
  if (titre !== undefined) updateData.titre = titre
  if (clientId !== undefined) updateData.clientId = clientId || null
  if (tva !== undefined) updateData.tva = tva

  if (lignes !== undefined) {
    const totalHT = lignes.reduce((sum: number, l: { totalHT: number }) => sum + l.totalHT, 0)
    const tauxTva = tva ?? existing.tva
    updateData.totalHT = totalHT
    updateData.totalTTC = totalHT * (1 + tauxTva / 100)

    await prisma.ligneDevis.deleteMany({ where: { devisId: id } })
    await prisma.ligneDevis.createMany({ data: lignes.map((l: object) => ({ ...l, devisId: id })) })
  }

  const devis = await prisma.devis.update({
    where: { id },
    data: updateData,
    include: { client: true, lignes: true },
  })

  return NextResponse.json(devis)
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/devis/[id]'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await ctx.params
  const existing = await prisma.devis.findFirst({ where: { id, userId: session.userId } })
  if (!existing) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  await prisma.devis.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
