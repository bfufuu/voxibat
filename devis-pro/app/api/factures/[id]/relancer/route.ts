import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { transporter, getRelanceEmailHTML, getRelanceEmailSubject } from '@/lib/email'

export async function POST(_req: NextRequest, ctx: RouteContext<'/api/factures/[id]/relancer'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await ctx.params

  const facture = await prisma.facture.findFirst({
    where: { id, userId: session.userId },
    include: {
      client: true,
      user: true,
      relances: { orderBy: { sentAt: 'desc' } },
    },
  })

  if (!facture) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  if (!facture.client?.email) {
    return NextResponse.json({ error: 'Ce client n\'a pas d\'email enregistré' }, { status: 400 })
  }

  if (!process.env.SMTP_USER) {
    return NextResponse.json({ error: 'Email non configuré. Ajoutez SMTP_USER et SMTP_PASS dans .env.local' }, { status: 503 })
  }

  const numeroRelance = facture.relances.length + 1
  const joursRetard = facture.dateEcheance
    ? Math.floor((Date.now() - new Date(facture.dateEcheance).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const artisanName = facture.user.company || facture.user.name || facture.user.email

  const html = getRelanceEmailHTML({
    to: facture.client.email,
    clientName: facture.client.name,
    artisanName,
    artisanEmail: facture.user.email,
    artisanPhone: facture.user.phone || undefined,
    factureNumero: facture.numero,
    montantTTC: facture.totalTTC,
    dateEcheance: facture.dateEcheance || new Date(),
    joursRetard,
    numeroRelance,
  })

  const subject = getRelanceEmailSubject(facture.numero, facture.totalTTC, numeroRelance)

  await transporter.sendMail({
    from: `"${artisanName}" <${process.env.SMTP_USER}>`,
    to: facture.client.email,
    subject,
    html,
  })

  // Enregistrer la relance
  await prisma.relance.create({
    data: {
      factureId: facture.id,
      emailTo: facture.client.email,
      numero: numeroRelance,
    },
  })

  // Mettre à jour le statut si pas déjà en retard
  if (facture.status === 'envoyee') {
    await prisma.facture.update({
      where: { id },
      data: { status: 'en_retard' },
    })
  }

  return NextResponse.json({ success: true, numeroRelance })
}
