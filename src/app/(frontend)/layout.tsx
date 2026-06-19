import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'CoffeeLab · Molecular Roastery',
    template: '%s · CoffeeLab',
  },
  description:
    'Molecular roastery based in Köln — curated specimens, precision extraction, and transparent sourcing.',
  applicationName: 'CoffeeLab',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32.png',
  },
}

/**
 * Document shell for the marketing site only. Payload routes use their own layout
 * and must not inherit a second <html>/<body> from here.
 * suppressHydrationWarning avoids false hydration errors when browser extensions
 * inject attributes on <html>/<body> before React hydrates.
 */
export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main>{children}</main>
      </body>
    </html>
  )
}
