import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DevisDetail from '@/components/DevisDetail'

export default async function DevisPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const session = await getSession()
  if (!session) return null

  const devis = await prisma.devis.findFirst({
    where: { id, userId: session.userId },
    include: { client: true, lignes: true, user: true },
  })

  if (!devis) notFound()

  return <DevisDetail devis={devis} />
}
