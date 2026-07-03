import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder',
})

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { description } = await request.json()

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Clé API Claude non configurée' }, { status: 503 })
  }

  // Récupérer le catalogue de tarifs de l'artisan
  const tarifs = await prisma.tarif.findMany({
    where: { userId: session.userId },
    orderBy: { designation: 'asc' },
  })

  // Construire la section catalogue pour le prompt
  let catalogueSection = ''
  if (tarifs.length > 0) {
    const lignesCatalogue = tarifs
      .map(t => `- "${t.designation}" | unité: ${t.unite} | prix HT: ${t.prixUnitaire}€`)
      .join('\n')

    catalogueSection = `
IMPORTANT — Catalogue de tarifs personnalisé de l'artisan (à utiliser en PRIORITÉ absolue) :
${lignesCatalogue}

Règles :
1. Si une prestation du catalogue correspond à ce qui est demandé, utilise EXACTEMENT le prix du catalogue.
2. Pour les matériaux ou prestations absents du catalogue, estime le prix du marché français actuel.
3. Mentionne dans la désignation si le prix vient du catalogue (ajoute rien de spécial, garde juste la désignation propre).
`
  }

  const prompt = `Tu es un expert en BTP (bâtiment et travaux publics).
Un artisan te décrit un chantier et tu dois générer les lignes d'un devis professionnel.
${catalogueSection}
Description du chantier: "${description}"

Génère une liste de lignes de devis au format JSON. Chaque ligne doit avoir:
- designation: description de la prestation (string)
- unite: unité de mesure (m², ml, forfait, heure, etc.)
- quantite: nombre (float)
- prixUnitaire: prix unitaire HT en euros (float)
- totalHT: quantite * prixUnitaire (float)

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte supplémentaire.
Exemple: [{"designation":"Dépose ancienne baignoire","unite":"forfait","quantite":1,"prixUnitaire":150,"totalHT":150}]`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Erreur IA' }, { status: 500 })
  }

  try {
    const raw = content.text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const lignes = JSON.parse(raw)
    return NextResponse.json({ lignes, catalogueUtilise: tarifs.length > 0 })
  } catch {
    return NextResponse.json({ error: 'Erreur de parsing IA' }, { status: 500 })
  }
}
