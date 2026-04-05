'use client'

import type { Media as MediaType } from '@/payload-types'
import React from 'react'
import { Media } from '@/components/Media'
import { CoffeeLabBrandMark } from './CoffeeLabBrandMark'

export type CoffeeLabLogoProps = {
  className?: string
  priority?: boolean
  width?: number
  height?: number
  siteName: string
  logo?: MediaType | string | null
  /** Top bar: larger; footer: compact */
  size?: 'header' | 'footer'
}

/**
 * 1) CMS `siteLogo` (Vercel Blob / API) when set in Payload.
 * 2) Otherwise the built-in wordmark (flask + dot + COFFEE/LAB + taglines).
 */
export function CoffeeLabLogo({
  className,
  priority,
  width = 508,
  height = 102,
  siteName,
  logo,
  size = 'header',
}: CoffeeLabLogoProps) {
  const hasCmsUrl = typeof logo === 'object' && logo !== null && 'url' in logo && logo.url

  if (hasCmsUrl) {
    return (
      <Media
        resource={logo}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes="(max-width: 800px) min(45vw, 132px), 132px"
        alt={siteName}
      />
    )
  }

  return (
    <CoffeeLabBrandMark siteName={siteName} size={size} className={className} priority={priority} />
  )
}
