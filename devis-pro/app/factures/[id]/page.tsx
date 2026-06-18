import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import FactureDetail from '@/components/FactureDetail'

export default async function FacturePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const session = await getSession()
  if (!session) return null

  const facture = await prisma.facture.findFirst({
    where: { id, userId: session.userId },
    include: { client: true, lignes: true, user: true, devis: true, relances: { orderBy: { sentAt: 'asc' } } },
  })

  if (!facture) notFound()

  return <FactureDetail facture={facture} />
}
