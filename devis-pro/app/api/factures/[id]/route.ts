import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/factures/[id]'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await ctx.params
  const facture = await prisma.facture.findFirst({
    where: { id, userId: session.userId },
    include: { client: true, lignes: true, user: true, devis: true },
  })

  if (!facture) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(facture)
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/factures/[id]'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await ctx.params
  const { status } = await request.json()

  const facture = await prisma.facture.update({
    where: { id },
    data: { status },
    include: { client: true, lignes: true },
  })

  return NextResponse.json(facture)
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/factures/[id]'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await ctx.params
  await prisma.facture.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
