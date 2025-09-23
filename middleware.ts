import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/api/auth/signin',
  },
})

export const config = {
  matcher: ['/((?!_next|api/auth|favicon.ico|public|images|icons).*)'],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Protect admin and seller areas based on next-auth JWT token
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Public if no token is required
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/seller')) {
    return NextResponse.next()
  }

  // Require authentication
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/api/auth/signin'
    url.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  const role = (token as any)?.role as string | undefined

  // Admin area: ADMIN only
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    const url = req.nextUrl.clone()
    url.pathname = '/forbidden'
    return NextResponse.rewrite(url)
  }

  // Seller area: ADMIN or SELLER
  if (pathname.startsWith('/seller') && role !== 'ADMIN' && role !== 'SELLER') {
    const url = req.nextUrl.clone()
    url.pathname = '/forbidden'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/seller/:path*'],
}


