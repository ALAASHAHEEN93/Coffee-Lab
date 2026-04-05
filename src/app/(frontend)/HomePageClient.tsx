'use client'

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { Home } from '@/payload-types'
import { Media } from '@/components/Media'
import { mergeHome } from '@/lib/mergeHome'
import { LABORATORY_FALLBACK_PRODUCTS } from '@/lib/laboratoryFallbackProducts'
import PrecisionLab from './PrecisionLab'
import { CoffeeLabLogo } from './CoffeeLabLogo'
import { LaboratoryStore } from './LaboratoryStore'
import { LanguageToggle } from '@/components/LanguageToggle'
import './styles.css'

/** Default hero when CMS has no `heroBackground` (coffee / coaster photo). */
const HERO_FALLBACK_SRC = '/images/hero-bg-caffe-zapra.png'

/** Static fallbacks for PHASE_01 / 02 / 03 story blocks when CMS has no upload yet. */
const PHASE_STORY_IMAGES = {
  genetic: '/images/phase-01-packaging.png',
  thermal: '/images/phase-02-roaster.png',
  value: '/images/phase-03-retail.png',
} as const

function vaultPriceDisplay(item: NonNullable<Home['vaultCards']>[number]): string {
  const raw = item.price?.trim()
  if (raw) return raw
  const m = item.priceButton?.match(/\$[\d.]+/)
  return m?.[0] ?? '$32.00'
}

function LabGridIcon({ icon }: { icon?: 'flask' | 'bean' | 'chart' | 'atom' | null }) {
  const c = 'labGridIconSvg'
  switch (icon) {
    case 'bean':
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <ellipse cx="9" cy="12" rx="4" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <ellipse cx="15" cy="12" rx="4" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )
    case 'chart':
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path d="M4 18V6M8 18v-7M12 18V9M16 18v-5M20 18V4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'atom':
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="currentColor" strokeWidth="1.3" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="currentColor" strokeWidth="1.3" transform="rotate(-60 12 12)" />
        </svg>
      )
    case 'flask':
    default:
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M10 3h4v5.2l4.2 8.3c.6 1.2-.3 2.5-1.7 2.5H7.5c-1.4 0-2.3-1.3-1.7-2.5L10 8.2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

function ArchivesBookIcon() {
  return (
    <svg className="archivesBookIcon" viewBox="0 0 48 48" aria-hidden>
      <path
        d="M12 8h11c4.5 0 8 3.2 8 7.5V38h-2V15.5c0-3.1-2.5-5.5-6-5.5H12V8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M36 8H25c-4.5 0-8 3.2-8 7.5V38h2V15.5c0-3.1 2.5-5.5 6-5.5h11V8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M24 10v24" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <path d="M16 18h6M16 23h6M32 18h-6M32 23h-6" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

function ArchivesPhilosophyDocIcon() {
  return (
    <svg className="archivesPhilosophyDocIcon" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8l-6-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.1" opacity="0.85" />
    </svg>
  )
}

function GenomeHelixIcon() {
  return (
    <svg className="genomeHelixIcon" viewBox="0 0 56 56" aria-hidden>
      <path
        d="M14 8c3.5 0 6.5 2.2 8.2 5.4 1.8 3.2 2.5 7.3 2.5 11.6s-.7 8.4-2.5 11.6C20.5 39.8 17.5 42 14 42"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M42 8c-3.5 0-6.5 2.2-8.2 5.4-1.8 3.2-2.5 7.3-2.5 11.6s.7 8.4 2.5 11.6c1.7 3.2 4.7 5.4 8.2 5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14 14c6 4 10 10 12 18M42 14c-6 4-10 10-12 18M14 42c6-4 10-10 12-18M42 42c-6-4-10-10-12-18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="14" cy="14" r="2.2" fill="currentColor" opacity="0.9" />
      <circle cx="42" cy="14" r="2.2" fill="currentColor" opacity="0.9" />
      <circle cx="14" cy="42" r="2.2" fill="currentColor" opacity="0.9" />
      <circle cx="42" cy="42" r="2.2" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

function mapScanTemplate(template: string, brewMode: 'espresso' | 'filter') {
  const beam = brewMode === 'espresso' ? '165' : '99'
  const water = brewMode === 'espresso' ? '92.4' : '99'
  return template.replace(/\{beam\}/g, beam).replace(/\{water\}/g, water)
}

export default function HomePageClient({
  home,
  locale,
}: {
  home: Home | null
  locale: 'de' | 'en'
}) {
  const cms = useMemo(() => mergeHome(home, locale), [home, locale])
  const [brewMode, setBrewMode] = useState<'espresso' | 'filter'>('filter')
  const [assemblyMode, setAssemblyMode] = useState<'expert' | 'manual'>('expert')
  const [manualBlend, setManualBlend] = useState({
    originA: 60,
    originB: 20,
    roastLab: 20,
  })
  const [genomeView, setGenomeView] = useState<'gallery' | 'detailed'>('detailed')
  const [archiveFilter, setArchiveFilter] = useState('all')
  const blendSectionRef = useRef<HTMLElement>(null)
  const [blendSectionRevealed, setBlendSectionRevealed] = useState(false)

  useLayoutEffect(() => {
    const el = blendSectionRef.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBlendSectionRevealed(true)
      return
    }
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    if (rect.top < vh * 0.9 && rect.bottom > vh * 0.08) {
      setBlendSectionRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlendSectionRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    setManualBlend(
      brewMode === 'espresso'
        ? { originA: 60, originB: 20, roastLab: 20 }
        : { originA: 45, originB: 35, roastLab: 20 },
    )
  }, [brewMode])

  const adjustBlend = (key: 'originA' | 'originB' | 'roastLab', delta: number) => {
    setManualBlend((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, prev[key] + delta)),
    }))
  }

  const blendTotal = manualBlend.originA + manualBlend.originB + manualBlend.roastLab
  /** Ring stroke caps at 100%; center can show e.g. 120% */
  const strokePercent = Math.min(100, blendTotal)
  const isBlendComplete = blendTotal >= 100

  const [neuralEmail, setNeuralEmail] = useState('')
  const [neuralNotice, setNeuralNotice] = useState<string | null>(null)

  function submitNeuralFeed(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = neuralEmail.trim()
    if (!email) return

    const recipient =
      process.env.NEXT_PUBLIC_NEURAL_FEED_EMAIL?.trim() || 'hello@coffeelab.com'
    const subject = cms.neuralFeedMailSubject ?? ''
    const body = [cms.neuralFeedMailBodyIntro ?? '', '', `My email: ${email}`].join('\n')

    const href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setNeuralNotice(cms.footerFeedSuccess ?? '')
  }

  const laboratoryProducts = useMemo(() => {
    const rows = cms.storeProducts
    if (!rows?.length) return LABORATORY_FALLBACK_PRODUCTS
    return rows.map((p) => ({
      key: p.key,
      title: p.title,
      description: p.description ?? '',
      tags: p.tags?.map((t) => t.label) ?? [],
      rating: p.rating,
      reviews: p.reviews,
      price: p.price,
      image: typeof p.image === 'object' && p.image !== null ? p.image : undefined,
      categories: p.categories,
    }))
  }, [cms.storeProducts])

  const heroBg =
    cms.heroBackground && typeof cms.heroBackground === 'object' && 'url' in cms.heroBackground && cms.heroBackground.url
      ? cms.heroBackground
      : null

  return (
    <main className="home" id="main-content">
      <a className="skipLink" href="#variable-lab">
        {cms.skipLinkLabel}
      </a>
      <section className="hero hero--hasBg">
        <div className="heroBgMedia" aria-hidden="true">
          {heroBg ? (
            <Media resource={heroBg} fill className="heroBgImage" sizes="100vw" priority />
          ) : (
            <Image
              src={HERO_FALLBACK_SRC}
              alt=""
              fill
              className="heroBgImage"
              sizes="100vw"
              priority
            />
          )}
        </div>
        <div className="heroBgOverlay" aria-hidden="true" />
        <header className="topbar">
          <div className="logoWrap">
            <a className="logoHomeLink" href="/" aria-label={cms.siteName ?? 'CoffeeLab'}>
              <CoffeeLabLogo logo={cms.siteLogo} siteName={cms.siteName} priority size="header" />
            </a>
          </div>

          <div className="navCluster">
            <nav className="nav" aria-label="Primary">
              {(cms.navItems ?? []).map((item) => (
                <a key={item.href + item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="topbarRight">
            <div className="navIcons">
              <a className="iconButton" href="/account" aria-label={cms.accountAriaLabel ?? 'Account'}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.3" />
                  <path d="M5.6 18.2c1.7-2.7 4.1-4.1 6.4-4.1s4.7 1.4 6.4 4.1" />
                </svg>
              </a>
              <a className="iconButton cartButton" href="#cart" aria-label={cms.cartAriaLabel ?? 'Cart'}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.2 7.5h11l-1.4 7.2H8z" />
                  <path d="M8.6 7.5 9.8 5h3.5l1.2 2.5" />
                </svg>
                <span className="cartCount">0</span>
              </a>
            </div>
            <LanguageToggle locale={locale} variant="inline" />
          </div>
        </header>

        <div className="heroContent">
          <p className="kicker">{cms.heroKicker}</p>
          <h1>
            {cms.heroTitleLine1}
            <br />
            <span>{cms.heroTitleLine2}</span>
          </h1>
          <p className="subtitle">
            {cms.heroSubtitle}
            {cms.heroAccentWord1 ? (
              <>
                {' '}
                <span className="accentWord">{cms.heroAccentWord1}</span>
              </>
            ) : null}
            {cms.heroAccentWord2 ? (
              <>
                {' '}
                <span className="accentWord">{cms.heroAccentWord2}</span>
              </>
            ) : null}
          </p>

          <div className="actions">
            <a className="primary" href={cms.heroPrimaryCtaHref ?? '#roastery'}>
              <span className="actionLabel">{cms.heroPrimaryCtaLabel}</span>
            </a>
            <a className="secondary" href={cms.heroSecondaryCtaHref ?? '#archives'}>
              <span className="actionLabel">{cms.heroSecondaryCtaLabel}</span>
            </a>
          </div>
        </div>
      </section>

      <LaboratoryStore
        phase={cms.laboratoryPhase ?? ''}
        title={cms.laboratoryTitle ?? ''}
        intro={cms.laboratoryIntro ?? ''}
        emptyMessage={cms.laboratoryEmptyFilter ?? ''}
        priceLabel={cms.laboratoryPriceLabel ?? ''}
        addToCartAriaTemplate={cms.laboratoryAddToCartAriaTemplate ?? ''}
        filters={cms.storeFilters ?? []}
        products={laboratoryProducts}
        stats={cms.labStats ?? []}
      />

      <section className="protocolStrip" id="variable-lab" aria-label="Extraction protocol controls">
        <div className="calibration">
          <p>{cms.protocolEyebrow}</p>
          <h3>{cms.protocolTitle}</h3>
        </div>

        <div className="brewToggle" aria-label="Brew type">
          <button
            type="button"
            className={brewMode === 'espresso' ? 'active' : ''}
            onClick={() => setBrewMode('espresso')}
          >
            <span className="toggleIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M13.5 2.8 5.8 12h5.3l-0.9 9.2 8-10h-5.1z" />
              </svg>
            </span>
            {cms.brewEspressoLabel}
          </button>
          <button
            className={brewMode === 'filter' ? 'active' : ''}
            type="button"
            onClick={() => setBrewMode('filter')}
          >
            <span className="toggleIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M3.5 5h17l-6.8 8v5.4l-3.4 1.6V13z" />
              </svg>
            </span>
            {cms.brewFilterLabel}
          </button>
        </div>
      </section>

      <section className="geneticSection" id="genetic-blending">
        <div className="geneticTopRow">
          <div className="geneticMedia">
            <p className="mediaTag thermalMediaTag">
              <span className="thermoIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4v9" />
                  <path d="M9 14.5a3 3 0 1 0 6 0V7a3 3 0 1 0-6 0z" />
                </svg>
              </span>
              {cms.geneticSection?.mediaTag}
            </p>
            <div className="mediaFrame">
              <Media
                resource={cms.geneticSection?.image ?? PHASE_STORY_IMAGES.genetic}
                alt=""
                width={1024}
                height={1024}
                className="mediaFrameImg"
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </div>

          <div className="geneticContent">
            <p className="phase">{cms.geneticSection?.phase}</p>
            <h2>{cms.geneticSection?.title}</h2>
            <p>{cms.geneticSection?.body}</p>
            <a href={cms.geneticSection?.ctaHref ?? '#archives'}>{cms.geneticSection?.ctaLabel}</a>
          </div>
        </div>

      </section>

      <section className="thermalSection" id="thermal-precision">
        <div className="thermalContent">
          <p className="phase">{cms.thermalSection?.phase}</p>
          <h2>{cms.thermalSection?.title}</h2>
          <p>{cms.thermalSection?.body}</p>
          <a href={cms.thermalSection?.ctaHref ?? '#archives'}>{cms.thermalSection?.ctaLabel}</a>
        </div>

        <div className="thermalMedia">
          <p className="mediaTag thermalMediaTag">
            <span className="thermoIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 4v9" />
                <path d="M9 14.5a3 3 0 1 0 6 0V7a3 3 0 1 0-6 0z" />
              </svg>
            </span>
            {cms.thermalSection?.mediaTag}
          </p>
          <div className="mediaFrame">
            <Media
              resource={cms.thermalSection?.image ?? PHASE_STORY_IMAGES.thermal}
              alt=""
              width={1024}
              height={1024}
              className="mediaFrameImg"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="valueSection" id="whitepapers">
        <div className="valueMedia">
          <p className="mediaTag thermalMediaTag">
            <span className="thermoIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 4v9" />
                <path d="M9 14.5a3 3 0 1 0 6 0V7a3 3 0 1 0-6 0z" />
              </svg>
            </span>
            {cms.valueSection?.mediaTag}
          </p>
          <div className="mediaFrame">
            <Media
              resource={cms.valueSection?.image ?? PHASE_STORY_IMAGES.value}
              alt=""
              width={1024}
              height={1024}
              className="mediaFrameImg"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
        </div>

        <div className="valueContent">
          <p className="phase">{cms.valueSection?.phase}</p>
          <h2>{cms.valueSection?.title}</h2>
          <p>{cms.valueSection?.body}</p>
          <a href={cms.valueSection?.ctaHref ?? '#archives'}>{cms.valueSection?.ctaLabel}</a>
        </div>
      </section>

      <PrecisionLab brewMode={brewMode} cms={cms} mapScanTemplate={mapScanTemplate} />

      <section
        ref={blendSectionRef}
        className={`blendingSection${blendSectionRevealed ? ' blendSectionRevealed' : ''}`}
      >
        <p className="phase">{cms.blendingPhase}</p>
        <h2>{cms.blendingTitle}</h2>
        <p className="blendingIntro">{cms.blendingIntro}</p>

        <div
          className={`blendingTabs${assemblyMode === 'manual' ? ' blendingTabs--manual' : ''}`}
          role="tablist"
          aria-label="Assembly mode"
        >
          <span className="blendingTabsThumb" aria-hidden="true" />
          <button
            className={assemblyMode === 'expert' ? 'active' : ''}
            type="button"
            role="tab"
            aria-selected={assemblyMode === 'expert'}
            onClick={() => setAssemblyMode('expert')}
          >
            {cms.blendingTabExpert}
          </button>
          <button
            className={assemblyMode === 'manual' ? 'active' : ''}
            type="button"
            role="tab"
            aria-selected={assemblyMode === 'manual'}
            onClick={() => setAssemblyMode('manual')}
          >
            {cms.blendingTabManual}
          </button>
        </div>

        {assemblyMode === 'expert' ? (
          <div className="blendCards">
            {(cms.blendingExpertCards ?? []).map((card) => (
              <article className="blendCard" key={card.id ?? card.title}>
                <div className="blendHead">
                  <div>
                    <p>{card.intensityLabel}</p>
                    <h3>{card.title}</h3>
                  </div>
                  <span className="cardIcon" aria-hidden="true">
                    {brewMode === 'filter' ? (
                      <svg viewBox="0 0 24 24">
                        <path d="M3.5 5h17l-6.8 8v5.4l-3.4 1.6V13z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24">
                        <path d="M13.5 2.8 5.8 12h5.3l-0.9 9.2 8-10h-5.1z" />
                      </svg>
                    )}
                  </span>
                </div>

                <div className="sensory">
                  <small>SENSORY LOG:</small>
                  <em>{brewMode === 'filter' ? card.sensoryFilter : card.sensoryEspresso}</em>
                </div>

                <div className="meta">
                  <div>
                    <small>GENETIC_BASE</small>
                    <span>{card.geneticBase}</span>
                  </div>
                  <div>
                    <small>METHODOLOGY</small>
                    <span>{brewMode === 'filter' ? card.methodologyFilter : card.methodologyEspresso}</span>
                  </div>
                </div>

                <div className="cardFooter">
                  <strong>{card.price}</strong>
                  <button
                    type="button"
                    className="blendCardCartBtn"
                    aria-label={`${card.cta}: ${card.title}`}
                  >
                    <svg className="blendCardCartIcon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6.2 7.5h11l-1.4 7.2H8z" />
                      <path d="M8.6 7.5 9.8 5h3.5l1.2 2.5" />
                    </svg>
                    <span>{card.cta}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="manualAssemblyPanel">
            <div className="manualLeft">
              <div className="manualHeader">
                <span className="manualIcon" aria-hidden="true">
                  {brewMode === 'filter' ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M3.5 5h17l-6.8 8v5.4l-3.4 1.6V13z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M5.5 4h13v3.2l-1.5 1.8v8.6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V9L5.5 7.2z" />
                    </svg>
                  )}
                </span>
                <div>
                  <h3>{cms.manualAssemblerTitle}</h3>
                  <p>
                    {cms.manualAssemblerProtocolPrefix} {brewMode.toUpperCase()}
                  </p>
                </div>
                <button type="button" className="recalibrateBtn">
                  {cms.manualRecalibrate}
                </button>
              </div>

              {(brewMode === 'espresso' ? cms.manualRowsEspresso : cms.manualRowsFilter)?.map((row, idx) => {
                const keys: Array<'originA' | 'originB' | 'roastLab'> = ['originA', 'originB', 'roastLab']
                const key = keys[idx] ?? 'originA'
                return (
                  <div className="blendRow" key={row.id ?? `${row.code}-${idx}`}>
                    <div className="blendRowLabel">
                      <small>{row.code}</small>
                      <span>{row.name}</span>
                    </div>
                    <div className="blendRowControls">
                      <button type="button" onClick={() => adjustBlend(key, -5)}>
                        -
                      </button>
                      <strong>{manualBlend[key]}%</strong>
                      <button type="button" onClick={() => adjustBlend(key, 5)}>
                        +
                      </button>
                    </div>
                    <progress max={100} value={manualBlend[key]} />
                  </div>
                )
              })}
            </div>

            <div className="manualRight">
              <div className="saturationRing" style={{ ['--sat' as string]: `${strokePercent}` }}>
                <span>{blendTotal}%</span>
                <small>{cms.saturationLabel}</small>
              </div>
              <div className="manualStatus">
                <span>{cms.stabilityLabel}</span>
                <strong className={isBlendComplete ? 'ok' : 'warn'}>
                  {isBlendComplete ? cms.stabilityLocked : cms.stabilityCalibrating}
                </strong>
              </div>
              <button
                type="button"
                className={`finalizeBtn ${isBlendComplete ? 'active' : ''}`}
                disabled={!isBlendComplete}
              >
                {cms.finalizeAssembly}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="vaultSection" id="vault">
        <p className="phase">{cms.vaultPhase}</p>
        <h2 className="vaultSectionTitle">{cms.vaultTitle}</h2>
        <p className="vaultIntro">{cms.vaultIntro}</p>

        <div className="vaultGrid">
          {(cms.vaultCards ?? []).map((item) => {
            const metaPill = item.metadataPill?.trim() || cms.vaultMetadataValue || ''
            const cta = item.addToCartLabel?.trim() || 'ADD TO CART'
            const spec =
              locale === 'de'
                ? { origin: 'HERKUNFT', roast: 'RÖSTGRAD', flavor: 'GESCHMACK' }
                : { origin: 'ORIGIN', roast: 'ROAST LEVEL', flavor: 'FLAVOR PROFILE' }
            return (
              <article className="vaultCard" key={item.id ?? item.title}>
                <div className="vaultCardGlow" aria-hidden="true" />
                <div className="vaultCardSeal" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="vaultSealSvg">
                    <circle cx="12" cy="12" r="10.2" fill="none" stroke="currentColor" strokeWidth="0.65" opacity="0.55" />
                    <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.85" />
                    <path
                      d="M12 5.2 7.2 7.4v4.1c0 3.1 2 6 4.9 6.9 2.9-0.9 4.9-3.8 4.9-6.9V7.4L12 5.2z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.15"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="vaultCategory vaultCategory--center">{item.label}</p>
                <h3 className="vaultCardTitle vaultCardTitleSerif">{item.title}</h3>
                <ul className="vaultCardSpecs">
                  {item.originLine ? (
                    <li>
                      <span className="vaultSpecKey">{spec.origin}</span>
                      <span className="vaultSpecVal">{item.originLine}</span>
                    </li>
                  ) : null}
                  {item.roastLine ? (
                    <li>
                      <span className="vaultSpecKey">{spec.roast}</span>
                      <span className="vaultSpecVal">{item.roastLine}</span>
                    </li>
                  ) : null}
                  {item.flavorLine ? (
                    <li>
                      <span className="vaultSpecKey">{spec.flavor}</span>
                      <span className="vaultSpecVal">{item.flavorLine}</span>
                    </li>
                  ) : null}
                </ul>
                <p className="vaultCardDesc">{item.description}</p>
                <div className="vaultMetaRow">
                  <span className="vaultMetaKey">{cms.vaultMetadataLabel}</span>
                  <span className="vaultMetaPill">{metaPill}</span>
                </div>
                <div className="vaultDivider" aria-hidden="true" />
                <div className="vaultCardFooter">
                  <div className="vaultPriceStack">
                    <span className="vaultPriceKey">{cms.vaultPriceLabel ?? 'SPECIMEN_COST'}</span>
                    <strong className="vaultPriceAmount">{vaultPriceDisplay(item)}</strong>
                  </div>
                  <button type="button" className="vaultAddToCartBtn" aria-label={`${cta}: ${item.title ?? ''}`}>
                    <svg className="vaultCartIcon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6.2 7.5h11l-1.4 7.2H8z" />
                      <path d="M8.6 7.5 9.8 5h3.5l1.2 2.5" />
                    </svg>
                    <span>{cta}</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="blendingGenomeSection" id="blending-genome" aria-labelledby="genome-title">
        <div className="blendingGenomeHeader">
          <div className="genomeHelixWrap">
            <GenomeHelixIcon />
          </div>
          <p className="genomePhase">{cms.genomePhase}</p>
          <h2 id="genome-title" className="genomeTitle">
            {cms.genomeTitle}
          </h2>
          <p className="genomeIntro">{cms.genomeIntro}</p>
          <div className="genomeViewToggle" role="tablist" aria-label={cms.genomeTitle ?? 'View'}>
            <button
              type="button"
              role="tab"
              aria-selected={genomeView === 'gallery'}
              className={`genomeTabBtn ${genomeView === 'gallery' ? 'genomeTabBtn--active' : ''}`}
              onClick={() => setGenomeView('gallery')}
            >
              {cms.genomeTabGallery}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={genomeView === 'detailed'}
              className={`genomeTabBtn ${genomeView === 'detailed' ? 'genomeTabBtn--active' : ''}`}
              onClick={() => setGenomeView('detailed')}
            >
              {cms.genomeTabDetailed}
            </button>
          </div>
        </div>

        {genomeView === 'detailed' ? (
          <>
            <div className="genomeBackRow">
              <button type="button" className="genomeBackLink" onClick={() => setGenomeView('gallery')}>
                <svg className="genomeBackChevron" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M15 6l-6 6 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {cms.genomeBackLabel}
              </button>
            </div>

            <div className="genomeDetailGrid">
              <article className="genomeCard genomeCard--spec">
                <div className="genomeCardTopRow">
                  <div className="genomeMutationRow">
                    <span className="genomeMutationIcon" aria-hidden>
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <circle cx="8" cy="8" r="2" fill="currentColor" />
                        <circle cx="16" cy="8" r="2" fill="currentColor" />
                        <circle cx="8" cy="16" r="2" fill="currentColor" />
                        <circle cx="16" cy="16" r="2" fill="currentColor" />
                        <path
                          d="M10 8h4M8 10v4M16 10v4M10 16h4"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </svg>
                    </span>
                    <span className="genomeDataCaps">{cms.genomeMutationLabel}</span>
                  </div>
                  <div className="genomeExtractionBlock">
                    <span className="genomeDataLabelSm">{cms.genomeExtractionGradeLabel}</span>
                    <span className="genomeGradeValue">{cms.genomeExtractionGradeValue}</span>
                  </div>
                </div>

                <h3 className="genomeSpecimenTitle">{cms.genomeSpecimenTitle}</h3>
                <div className="genomeSpecimenTags">
                  <span className="genomeCodeTag">{cms.genomeSpecimenCode}</span>
                  {cms.genomeSpecimenStatus ? (
                    <span className="genomeStatusPill">{cms.genomeSpecimenStatus}</span>
                  ) : null}
                </div>

                <div className="genomeSequenceBlock">
                  <span className="genomeBlockLabel">{cms.genomeGeneticSequenceLabel}</span>
                  <p className="genomeSequenceText">{cms.genomeGeneticSequenceText}</p>
                </div>

                <div className="genomeSensoryBlock">
                  <span className="genomeBlockLabel">{cms.genomeSensoryLabel}</span>
                  <p className="genomeSensoryQuote">{cms.genomeSensoryQuote}</p>
                </div>

                <ul className="genomeMetricsList">
                  {(cms.genomeMetrics ?? []).map((m, i) => (
                    <li key={m.id ?? `${m.label}-${i}`}>
                      <div className="genomeMetricRow">
                        <span className="genomeDataCaps">{m.label}</span>
                        <span className="genomeMetricPct">{Math.round(Number(m.value) || 0)}%</span>
                      </div>
                      <div className="genomeBarTrack" aria-hidden>
                        <div
                          className="genomeBarFill"
                          style={{ width: `${Math.min(100, Math.max(0, Number(m.value) || 0))}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="genomeCard genomeCard--purchase">
                <div className="genomeStabilityHead">
                  <span className="genomeBlockLabel">{cms.genomeStabilityLabel}</span>
                  <div className="genomeStabilityRow">
                    <span className="genomeStabilityBig">{cms.genomeStabilityPercent}</span>
                    {cms.genomeStabilityStatus ? (
                      <span className="genomeOptimalBadge">{cms.genomeStabilityStatus}</span>
                    ) : null}
                  </div>
                  <div className="genomeBarTrack genomeBarTrack--stability" aria-hidden>
                    <div
                      className="genomeBarFill"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            typeof cms.genomeStabilityBar === 'number'
                              ? cms.genomeStabilityBar
                              : parseInt(String(cms.genomeStabilityPercent ?? '').replace(/\D/g, '') || '96', 10) ||
                                  96,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <dl className="genomeTechList">
                  <div>
                    <dt className="genomeDataCaps">{cms.genomeRoastProfileLabel}</dt>
                    <dd>{cms.genomeRoastProfileValue}</dd>
                  </div>
                  <div>
                    <dt className="genomeDataCaps">{cms.genomeMethodologyLabel}</dt>
                    <dd>{cms.genomeMethodologyValue}</dd>
                  </div>
                  <div>
                    <dt className="genomeDataCaps">{cms.genomeComplexityLabel}</dt>
                    <dd>{cms.genomeComplexityValue}</dd>
                  </div>
                </dl>

                <div className="genomePriceBlock">
                  <span className="genomeBlockLabel">{cms.genomeSpecimenCostLabel}</span>
                  <div className="genomePriceLine">
                    <span className="genomePriceAmount">{cms.genomePriceDisplay}</span>
                    {cms.genomePerUnit ? <span className="genomePerUnit">{cms.genomePerUnit}</span> : null}
                  </div>
                </div>

                <button type="button" className="genomeAddToCartBtn">
                  <svg className="genomeCartIcon" viewBox="0 0 24 24" aria-hidden>
                    <path d="M6.2 7.5h11l-1.4 7.2H8z" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M8.6 7.5 9.8 5h3.5l1.2 2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  {cms.genomeAddToCartLabel}
                </button>

                <div className="genomeLabNotes">
                  <span className="genomeLabNotesLabel">
                    <svg className="genomeLockIcon" viewBox="0 0 24 24" aria-hidden>
                      <rect x="5" y="10" width="14" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M8 10V8a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    {cms.genomeLabNotesLabel}
                  </span>
                  <p className="genomeLabNotesText">{cms.genomeLabNotes}</p>
                </div>
              </article>
            </div>
          </>
        ) : (
          <div className="genomeGalleryBody">
            {cms.genomeGalleryIntro ? <p className="genomeGalleryIntro">{cms.genomeGalleryIntro}</p> : null}
            <div className="genomeGalleryGrid">
              {(cms.vaultCards ?? []).slice(0, 3).map((vc) => (
                <div className="genomeGalleryTile" key={vc.id ?? vc.title}>
                  <p className="genomeGalleryTileCode">{vc.label}</p>
                  <h4 className="genomeGalleryTileTitle">{vc.title}</h4>
                  <p className="genomeGalleryTileMeta">{vc.originLine}</p>
                  <button
                    type="button"
                    className="genomeGalleryTileBtn"
                    onClick={() => setGenomeView('detailed')}
                  >
                    {cms.genomeGalleryCta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="labFeatureSection" id="the-lab">
        <p className="phase">{cms.labPhase}</p>
        <h2 className="labSectionTitle">{cms.labTitle}</h2>
        <p className="labFeatureSubtitle">{cms.labSubtitle}</p>
        <div className="labFeatureLayout">
          <div className="labFeatureAccent" aria-hidden="true" />
          <p className="labFeatureBody">{cms.labBody}</p>
        </div>
        <div className="labFeatureGrid">
          {(cms.labGridCards ?? []).map((card) => (
            <div className="labFeatureCard" key={card.id ?? card.title}>
              <div className="labFeatureCardIcon">
                <LabGridIcon icon={card.icon ?? 'flask'} />
              </div>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="archivesResearchSection" id="archives">
        <header className="archivesResearchHeader">
          <div className="archivesBookIconWrap" aria-hidden>
            <ArchivesBookIcon />
          </div>
          <p className="archivesResearchPhase">{cms.archivesListPhase}</p>
          <h2 className="archivesResearchTitle">{cms.archivesListTitle}</h2>
          <p className="archivesResearchIntro">{cms.archivesListIntro}</p>
        </header>

        {cms.archivesPhilosophyTitle?.trim() || cms.archivesPhilosophyBody?.trim() ? (
          <div className="archivesPhilosophy">
            <div className="archivesPhilosophyInner">
              <div className="archivesPhilosophyHead">
                <ArchivesPhilosophyDocIcon />
                <h3 className="archivesPhilosophyTitle">{cms.archivesPhilosophyTitle}</h3>
              </div>
              {(cms.archivesPhilosophyBody ?? '')
                .split(/\n\n+/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="archivesPhilosophyPara">
                    {para}
                  </p>
                ))}
            </div>
          </div>
        ) : null}

        <div className="archivesFilterBar" role="tablist" aria-label={cms.archivesListTitle ?? 'Archive filters'}>
          {(cms.archivesFilterTabs ?? []).map((tab) => {
            const tid = tab.id?.trim() ?? 'all'
            const active = archiveFilter === tid.toLowerCase()
            return (
              <button
                key={tid}
                type="button"
                role="tab"
                aria-selected={active}
                className={`archivesFilterBtn ${active ? 'archivesFilterBtn--active' : ''}`}
                onClick={() => setArchiveFilter(tid.toLowerCase())}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <ul className="archivesArticleList">
          {(cms.archivesListRows ?? [])
            .filter((row) => {
              if (archiveFilter === 'all') return true
              const fk = (row.filterKey ?? '').trim().toLowerCase()
              return fk === archiveFilter
            })
            .map((row) => {
              const href = row.href?.trim() || '#'
              const mins = row.readMinutes != null ? Math.max(0, Math.round(Number(row.readMinutes))) : null
              const readLabel =
                locale === 'de'
                  ? mins != null
                    ? `${mins} MIN LESEN`
                    : ''
                  : mins != null
                    ? `${mins} MIN READ`
                    : ''
              return (
                <li key={row.id ?? row.title}>
                  <a className="archivesArticleCard" href={href}>
                    <div className="archivesArticleMain">
                      <div className="archivesArticleTop">
                        <span className="archivesCategoryTag">{row.category}</span>
                        <div className="archivesArticleMeta">
                          {row.dateDisplay ? (
                            <span className="archivesMetaLine">
                              <svg className="archivesMetaIcon" viewBox="0 0 24 24" aria-hidden>
                                <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M8 3v4M16 3v4M3 11h18" stroke="currentColor" strokeWidth="1.2" />
                              </svg>
                              {row.dateDisplay}
                            </span>
                          ) : null}
                          {row.pagesLabel ? (
                            <span className="archivesMetaLine">
                              <svg className="archivesMetaIcon" viewBox="0 0 24 24" aria-hidden>
                                <path
                                  d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                  strokeLinejoin="round"
                                />
                                <path d="M14 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                              </svg>
                              {row.pagesLabel}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <h3 className="archivesArticleTitle">{row.title}</h3>
                      {row.summary ? <p className="archivesArticleSummary">{row.summary}</p> : null}
                      <div className="archivesArticleBottom">
                        {row.authors ? (
                          <span className="archivesAuthors">
                            <svg className="archivesAuthorsIcon" viewBox="0 0 24 24" aria-hidden>
                              <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                              <path
                                d="M4 19c0-3 3-6 5-6s5 3 5 6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                              />
                              <circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                              <path d="M14 19c0-2 2.5-3.5 4-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                            </svg>
                            {row.authors}
                          </span>
                        ) : null}
                        {readLabel ? <span className="archivesReadTime">{readLabel}</span> : null}
                      </div>
                    </div>
                    <span className="archivesArticleChevron" aria-hidden>
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          d="M9 6l6 6-6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>
                </li>
              )
            })}
        </ul>
      </section>

      <footer className="siteFooter">
        <div className="footerBrand">
          <div className="footerBrandLogo">
            <CoffeeLabLogo siteName={cms.siteName} logo={cms.siteLogo} size="footer" />
          </div>
          <p>{cms.footerTagline}</p>
          <p>{cms.footerMission}</p>
        </div>

        <div className="footerLinks">
          <h4>{cms.footerMapTitle}</h4>
          {(cms.footerMapLinks ?? []).map((l) => (
            <a key={l.href + l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="footerLinks">
          <h4>{cms.footerOpsTitle}</h4>
          {(cms.footerOpsLinks ?? []).map((l) => (
            <a key={l.href + l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="footerFeed">
          <h4>{cms.footerFeedTitle}</h4>
          <p>{cms.footerFeedDescription}</p>
          <form className="feedForm" onSubmit={submitNeuralFeed} aria-label="Neural feed email signup">
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={cms.footerFeedPlaceholder ?? ''}
              value={neuralEmail}
              onChange={(e) => {
                setNeuralEmail(e.target.value)
                setNeuralNotice(null)
              }}
              required
              aria-label="Email address"
            />
            <button type="submit">{cms.footerFeedSubmit}</button>
          </form>
          {neuralNotice ? (
            <p className="feedFormStatus success" role="status">
              {neuralNotice}
            </p>
          ) : null}
          <small>{cms.footerFeedEncryption}</small>
        </div>
      </footer>

      <div className="siteCopyright">
        <p>
          {(cms.footerCopyright ?? '').replace(
            '{year}',
            String(new Date().getFullYear()),
          )}
        </p>
      </div>
    </main>
  )
}
