import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || '')

const protectedRoutes = ['/dashboard', '/devis', '/profil', '/factures', '/tarifs', '/abonnement']
const authRoutes = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtected = protectedRoutes.some(r => path.startsWith(r))
  const isAuth = authRoutes.some(r => path.startsWith(r))

  const token = request.cookies.get('session')?.value

  let isValid = false
  let payload: { userId?: string } = {}

  if (token) {
    try {
      const result = await jwtVerify(token, secret)
      payload = result.payload as { userId?: string }
      isValid = true
    } catch {
      isValid = false
    }
  }

  if (isProtected && !isValid) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuth && isValid) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Vérification de la période d'essai sur les routes protégées
  if (isValid && isProtected && payload.userId) {
    const trialCookie = request.cookies.get('trial_status')?.value

    // On stocke le statut dans un cookie pour éviter une DB query à chaque requête
    if (!trialCookie) {
      const response = NextResponse.next()
      // On laisse passer et la page vérifiera elle-même
      return response
    }

    if (trialCookie === 'expired') {
      return NextResponse.redirect(new URL('/abonnement', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
