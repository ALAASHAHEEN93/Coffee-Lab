import { cookies } from 'next/headers'

/**
 * Reads Payload admin cookie when present; otherwise defaults to German (site default).
 */
export async function getRequestLocale(): Promise<'de' | 'en'> {
  const raw = (await cookies()).get('payload-lng')?.value?.trim().toLowerCase()
  if (raw === 'en') return 'en'
  return 'de'
}
