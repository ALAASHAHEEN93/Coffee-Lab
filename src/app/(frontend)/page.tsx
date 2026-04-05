import type { Home } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getRequestLocale } from '@/lib/getLocale'
import HomePageClient from './HomePageClient'

/** Payload + locale need runtime env (PAYLOAD_SECRET, DB). Skip static prerender so CI/Vercel builds without those at build time. */
export const dynamic = 'force-dynamic'

export default async function Page() {
  const locale = await getRequestLocale()
  let home: Home | null = null
  try {
    const payload = await getPayload({ config })
    home = (await payload.findGlobal({ slug: 'home', locale, depth: 2 })) as Home | null
  } catch (err) {
    console.warn(
      '[home] MongoDB / Payload unavailable — using built-in defaults. If this is unexpected, check Atlas Network Access (IP allowlist) and DATABASE_URL:',
      'https://www.mongodb.com/docs/atlas/security/add-ip-address/',
      err,
    )
  }
  return <HomePageClient home={home} locale={locale} />
}
