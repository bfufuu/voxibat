import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const factures = await prisma.facture.findMany({
    where: { userId: session.userId },
    include: { client: true, lignes: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(factures)
}

// Créer une facture depuis un devis accepté
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { devisId } = await request.json()

  const devis = await prisma.devis.findFirst({
    where: { id: devisId, userId: session.userId },
    include: { lignes: true },
  })

  if (!devis) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 })

  // Vérifier qu'une facture n'existe pas déjà pour ce devis
  const existing = await prisma.facture.findUnique({ where: { devisId } })
  if (existing) return NextResponse.json({ error: 'Une facture existe déjà pour ce devis' }, { status: 400 })

  // Numérotation légale séquentielle
  const count = await prisma.facture.count({ where: { userId: session.userId } })
  const year = new Date().getFullYear()
  const numero = `FAC-${year}-${String(count + 1).padStart(4, '0')}`

  // Date d'échéance à 30 jours
  const dateEcheance = new Date()
  dateEcheance.setDate(dateEcheance.getDate() + 30)

  const facture = await prisma.facture.create({
    data: {
      numero,
      totalHT: devis.totalHT,
      tva: devis.tva,
      totalTTC: devis.totalTTC,
      dateEcheance,
      userId: session.userId,
      clientId: devis.clientId,
      devisId: devis.id,
      lignes: {
        create: devis.lignes.map(l => ({
          designation: l.designation,
          unite: l.unite,
          quantite: l.quantite,
          prixUnitaire: l.prixUnitaire,
          totalHT: l.totalHT,
        })),
      },
    },
    include: { client: true, lignes: true },
  })

  // Marquer le devis comme accepté
  await prisma.devis.update({
    where: { id: devisId },
    data: { status: 'accepte' },
  })

  return NextResponse.json(facture)
}
