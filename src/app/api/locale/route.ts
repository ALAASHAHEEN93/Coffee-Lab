import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const COOKIE = 'payload-lng'

function safeNextPath(raw: string | null): string {
  if (!raw) return '/'
  try {
    const decoded = decodeURIComponent(raw)
    // Same-origin path only (no protocol / open redirects)
    if (!decoded.startsWith('/') || decoded.startsWith('//')) return '/'
    return decoded
  } catch {
    return '/'
  }
}

/**
 * Sets marketing locale cookie and redirects back. Used by the nav DE/E toggle.
 * (More reliable than depending on middleware + query string alone alongside Payload’s `/api` catch‑all.)
 */
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale')
  if (locale !== 'en' && locale !== 'de') {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const nextPath = safeNextPath(request.nextUrl.searchParams.get('next'))
  const target = new URL(nextPath, request.url)

  const res = NextResponse.redirect(target)
  res.headers.set('Cache-Control', 'no-store, max-age=0')
  res.cookies.set(COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
