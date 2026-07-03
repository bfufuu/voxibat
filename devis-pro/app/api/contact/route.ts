import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { transporter } from '@/lib/email'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { sujet, message } = await req.json()
  if (!sujet?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Sujet et message requis' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true, name: true },
  })

  if (!user) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  if (!process.env.SMTP_USER) {
    return NextResponse.json({ error: 'Email non configuré' }, { status: 503 })
  }

  await transporter.sendMail({
    from: `"Voxibat Support" <${process.env.SMTP_USER}>`,
    to: 'contact@voxibat.fr',
    replyTo: user.email,
    subject: `[Contact Voxibat] ${sujet}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #2563eb;">Nouveau message de contact</h2>
        <p><strong>De :</strong> ${user.name || 'Inconnu'} (${user.email})</p>
        <p><strong>Sujet :</strong> ${sujet}</p>
        <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
