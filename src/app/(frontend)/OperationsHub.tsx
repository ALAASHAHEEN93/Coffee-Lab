'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { Home } from '@/payload-types'

type OperationsPanel = NonNullable<Home['operationsPanels']>[number]

const ANCHOR_ORDER = ['logistics', 'exchange', 'collective', 'terminal'] as const

function OperationsIcon({ anchor }: { anchor?: string | null }) {
  const c = 'operationsPanelIcon'
  switch (anchor) {
    case 'logistics':
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path d="M3 8h11v8H3zM14 10h4l3 3v3h-7V10z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="7" cy="17" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="17" cy="17" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )
    case 'exchange':
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <path d="M4 7h12M16 7l-3-3M20 17H8M8 17l3 3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'collective':
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <circle cx="9" cy="8" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="16" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 19c0-2.5 2.5-4.5 5-4.5s5 2 5 4.5M13 19c0-2 2-3.5 3.5-3.5S20 17 20 19" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'terminal':
    default:
      return (
        <svg className={c} viewBox="0 0 24 24" aria-hidden>
          <rect x="3" y="4" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M7 9l2.5 2.5L7 14M12 14h5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

function panelAnchorId(anchor?: string | null): string {
  return anchor?.trim() || 'logistics'
}

function resolveActiveAnchor(hash: string, panels: OperationsPanel[]): string {
  const raw = hash.replace(/^#/, '').toLowerCase()
  if (raw === 'operations') {
    return panelAnchorId(panels[0]?.anchor)
  }
  const match = panels.find((p) => panelAnchorId(p.anchor) === raw)
  if (match) return panelAnchorId(match.anchor)
  if (ANCHOR_ORDER.includes(raw as (typeof ANCHOR_ORDER)[number])) return raw
  return panelAnchorId(panels[0]?.anchor)
}

export function OperationsHub({
  phase,
  title,
  intro,
  panels,
}: {
  phase?: string | null
  title?: string | null
  intro?: string | null
  panels: OperationsPanel[]
}) {
  const sortedPanels = useMemo(() => {
    const list = [...panels]
    list.sort((a, b) => {
      const ai = ANCHOR_ORDER.indexOf(panelAnchorId(a.anchor) as (typeof ANCHOR_ORDER)[number])
      const bi = ANCHOR_ORDER.indexOf(panelAnchorId(b.anchor) as (typeof ANCHOR_ORDER)[number])
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })
    return list
  }, [panels])

  const [activeAnchor, setActiveAnchor] = useState(() =>
    resolveActiveAnchor(typeof window !== 'undefined' ? window.location.hash : '', sortedPanels),
  )

  const syncFromHash = useCallback(() => {
    setActiveAnchor(resolveActiveAnchor(window.location.hash, sortedPanels))
  }, [sortedPanels])

  useEffect(() => {
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [syncFromHash])

  const selectPanel = (anchor: string) => {
    setActiveAnchor(anchor)
    const nextHash = `#${anchor}`
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash)
    }
  }

  if (!sortedPanels.length) return null

  return (
    <section className="operationsSection" id="operations">
      <header className="operationsHeader">
        <p className="phase">{phase}</p>
        <h2 className="operationsTitle">{title}</h2>
        {intro ? <p className="operationsIntro">{intro}</p> : null}
      </header>

      <div
        className="operationsTabBar"
        role="tablist"
        aria-label={title ?? 'Operations'}
      >
        {sortedPanels.map((panel) => {
          const anchor = panelAnchorId(panel.anchor)
          const active = anchor === activeAnchor
          return (
            <button
              key={anchor}
              type="button"
              role="tab"
              id={`operations-tab-${anchor}`}
              aria-selected={active}
              aria-controls={`operations-panel-${anchor}`}
              className={`operationsTabBtn ${active ? 'operationsTabBtn--active' : ''}`}
              onClick={() => selectPanel(anchor)}
            >
              {panel.label}
            </button>
          )
        })}
      </div>

      {sortedPanels.map((panel) => {
        const anchor = panelAnchorId(panel.anchor)
        const active = anchor === activeAnchor
        const panelIsTerminal = anchor === 'terminal'
        return (
          <div
            key={anchor}
            id={anchor}
            role="tabpanel"
            aria-labelledby={`operations-tab-${anchor}`}
            className={`operationsPanel ${active ? 'operationsPanel--active' : ''} ${panelIsTerminal ? 'operationsPanel--terminal' : ''}`}
            hidden={!active}
          >
            <div className="operationsPanelInner" id={`operations-panel-${anchor}`}>
              <div className="operationsPanelMain">
                <div className="operationsPanelHead">
                  <div className="operationsPanelIconWrap" aria-hidden>
                    <OperationsIcon anchor={anchor} />
                  </div>
                  <div className="operationsPanelMeta">
                    {panel.status ? (
                      <span className="operationsStatusPill">{panel.status}</span>
                    ) : null}
                    <h3 className="operationsPanelTitle">{panel.title}</h3>
                  </div>
                </div>

                {panel.body ? <p className="operationsPanelBody">{panel.body}</p> : null}

                {(panel.metrics ?? []).length > 0 ? (
                  <dl className="operationsMetrics">
                    {(panel.metrics ?? []).map((m, i) => (
                      <div key={m.id ?? `${m.key}-${i}`} className="operationsMetric">
                        <dt>{m.key}</dt>
                        <dd>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {panel.ctaLabel?.trim() ? (
                  <a className="operationsCta" href={panel.ctaHref?.trim() || '#'}>
                    {panel.ctaLabel}
                  </a>
                ) : null}
              </div>

              {(panel.feed ?? []).length > 0 ? (
                <div className="operationsFeed" aria-label="Activity feed">
                  <div className="operationsFeedHead">
                    <span className="operationsFeedLabel">
                      {panelIsTerminal ? 'SYS_STREAM' : 'ACTIVITY_LOG'}
                    </span>
                    <span className="operationsFeedDot" aria-hidden />
                  </div>
                  <ul className="operationsFeedList">
                    {(panel.feed ?? []).map((line, i) => (
                      <li key={line.id ?? `${line.code}-${i}`} className="operationsFeedLine">
                        {line.code ? <span className="operationsFeedCode">{line.code}</span> : null}
                        <span className="operationsFeedMsg">{line.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </section>
  )
}
