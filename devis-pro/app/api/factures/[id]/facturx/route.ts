import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateFacturxXML } from '@/lib/facturx'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  const facture = await prisma.facture.findFirst({
    where: { id, userId: session.userId },
    include: {
      lignes: true,
      client: true,
      user: true,
    },
  })

  if (!facture) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })

  const xml = generateFacturxXML({
    numero: facture.numero,
    createdAt: facture.createdAt,
    dateEcheance: facture.dateEcheance,
    totalHT: facture.totalHT,
    tva: facture.tva,
    totalTTC: facture.totalTTC,
    lignes: facture.lignes,
    user: facture.user,
    client: facture.client,
  })

  const filename = `facturx-${facture.numero}.xml`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
