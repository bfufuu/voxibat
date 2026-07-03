import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'furrer.benjamin5@gmail.com'
const KEEP_EMAILS = ['furrer.benjamin5@gmail.com', 'test-verify@voxibat.fr']

export async function POST() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const admin = await prisma.user.findUnique({ where: { id: session.userId }, select: { email: true } })
  if (!admin || admin.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const usersToDelete = await prisma.user.findMany({
    where: { email: { notIn: KEEP_EMAILS } },
    select: { id: true, email: true },
  })

  if (usersToDelete.length === 0) {
    return NextResponse.json({ deleted: 0, message: 'Aucun compte à supprimer' })
  }

  const ids = usersToDelete.map(u => u.id)

  await prisma.relance.deleteMany({ where: { facture: { userId: { in: ids } } } })
  await prisma.ligneFacture.deleteMany({ where: { facture: { userId: { in: ids } } } })
  await prisma.facture.deleteMany({ where: { userId: { in: ids } } })
  await prisma.ligneDevis.deleteMany({ where: { devis: { userId: { in: ids } } } })
  await prisma.devis.deleteMany({ where: { userId: { in: ids } } })
  await prisma.tarif.deleteMany({ where: { userId: { in: ids } } })
  await prisma.client.deleteMany({ where: { userId: { in: ids } } })
  await prisma.user.deleteMany({ where: { id: { in: ids } } })

  return NextResponse.json({
    deleted: usersToDelete.length,
    emails: usersToDelete.map(u => u.email),
  })
}
