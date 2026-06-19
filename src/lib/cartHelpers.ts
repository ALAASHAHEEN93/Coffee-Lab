import type { Media } from '@/payload-types'
import type { LaboratoryProductView } from './laboratoryFallbackProducts'

export function specimenCartKey(prefix: string, id?: string | null, title?: string | null): string {
  const slug = (id ?? title ?? 'item')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
  return `${prefix}-${slug}`
}

export function imageForGeneticBase(
  geneticBase: string | null | undefined,
  catalog: LaboratoryProductView[],
): Media | string | null | undefined {
  const base = (geneticBase ?? '').toLowerCase()
  const rules: [string, string][] = [
    ['yirgacheffe', 'yirgacheffe'],
    ['ethiopia', 'ethiopian'],
    ['kenya', 'kenya'],
    ['colombia', 'colombia'],
    ['sumatra', 'sumatra'],
    ['gesha', 'colombia'],
    ['geisha', 'colombia'],
  ]

  for (const [needle, productNeedle] of rules) {
    if (!base.includes(needle)) continue
    const hit = catalog.find((p) => p.title.toLowerCase().includes(productNeedle))
    if (hit?.image) return hit.image
  }

  return catalog[0]?.image ?? null
}
