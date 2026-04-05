'use client'

import React from 'react'

type Locale = 'de' | 'en'

/**
 * Sets `payload-lng` via **`/api/locale`** (Set-Cookie + redirect). Works with Payload’s API layout.
 */
export function LanguageToggle({
  locale,
  variant = 'segmented',
}: {
  locale: Locale
  variant?: 'segmented' | 'inline'
}) {
  const setLocale = (next: Locale) => {
    if (next === locale) return
    if (typeof window === 'undefined') return
    const back =
      window.location.pathname + window.location.search + (window.location.hash || '')
    window.location.assign(
      `/api/locale?locale=${next}&next=${encodeURIComponent(back)}`,
    )
  }

  if (variant === 'inline') {
    return (
      <div className="langToggle langToggle--inline" role="group" aria-label="Sprache / Language">
        <button
          type="button"
          className={`langToggleBtn langToggleBtn--inline${locale === 'de' ? ' langToggleBtn--inlineActive' : ''}`}
          onClick={() => setLocale('de')}
          aria-pressed={locale === 'de'}
          aria-label="Deutsch"
        >
          DE
        </button>
        <span className="langToggleSep" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          className={`langToggleBtn langToggleBtn--inline langToggleBtn--inlineNarrow${locale === 'en' ? ' langToggleBtn--inlineActive' : ''}`}
          onClick={() => setLocale('en')}
          aria-pressed={locale === 'en'}
          aria-label="English"
        >
          E
        </button>
      </div>
    )
  }

  return (
    <div className="langToggle" role="group" aria-label="Sprache / Language">
      <button
        type="button"
        className={`langToggleBtn${locale === 'de' ? ' langToggleBtn--active' : ''}`}
        onClick={() => setLocale('de')}
        aria-pressed={locale === 'de'}
        aria-label="Deutsch"
      >
        DE
      </button>
      <button
        type="button"
        className={`langToggleBtn${locale === 'en' ? ' langToggleBtn--active' : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        aria-label="English"
      >
        E
      </button>
    </div>
  )
}
