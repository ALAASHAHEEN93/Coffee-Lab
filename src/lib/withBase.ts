/**
 * Optional path prefix for the static GitHub Pages demo (served from /Coffee-Lab).
 * Empty on Vercel / local dev, so the full app is unchanged.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** True only in the static demo build (no server, no CMS, no accounts). */
export const IS_STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === '1'

export function withBase(path: string): string {
  if (!BASE_PATH || !path.startsWith('/') || path.startsWith('//')) return path
  if (path === BASE_PATH || path.startsWith(BASE_PATH + '/')) return path
  return BASE_PATH + path
}
