import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Marketing locale: `?setLocale=en|de` sets `payload-lng` and redirects to the same URL
 * without the query (full navigation + cookie — more reliable than client-only `document.cookie` + `router.refresh()`).
 */
export function middleware(request: NextRequest) {
  const param = request.nextUrl.searchParams.get('setLocale')
  if (param === 'en' || param === 'de') {
    const url = request.nextUrl.clone()
    url.searchParams.delete('setLocale')
    const res = NextResponse.redirect(url)
    res.cookies.set('payload-lng', param, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/((?!admin|api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|ico|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
