'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { Home } from '@/payload-types'
import { Media } from '@/components/Media'
import type { LaboratoryProductView } from '@/lib/laboratoryFallbackProducts'
import { useCart } from './CartContext'

type StoreFilter =
  | 'all'
  | 'bestseller'
  | 'single-origin'
  | 'espresso-blend'
  | 'rare-varietal'

type Props = {
  phase: string
  title: string
  intro: string
  emptyMessage: string
  priceLabel: string
  addToCartAriaTemplate: string
  addToCartLabel?: string
  closeLabel?: string
  filters: NonNullable<Home['storeFilters']>
  products: LaboratoryProductView[]
  stats: NonNullable<Home['labStats']>
}

function LabStatIcon({ type }: { type: 'box' | 'medal' | 'star' | 'trend' }) {
  const s = { fill: 'none' as const, stroke: 'currentColor', strokeWidth: 1.55, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (type) {
    case 'box':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="labStatSvg">
          <path d="M12 3 4 7v10l8 4 8-4V7l-8-4z" {...s} />
          <path d="M4 7l8 4 8-4M12 11v13" {...s} />
        </svg>
      )
    case 'medal':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="labStatSvg">
          <path d="M8 3h8l1 4v2H7V7z" {...s} />
          <circle cx="12" cy="15" r="3.5" {...s} />
          <path d="M9 21h6" {...s} />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="labStatSvg">
          <path
            d="M12 4.2l1.9 4.7 5.1.4-3.9 3.3 1.2 5-4.3-2.6-4.3 2.6 1.2-5-3.9-3.3 5.1-.4z"
            {...s}
          />
        </svg>
      )
    case 'trend':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="labStatSvg">
          <path d="M4 17V9" {...s} />
          <path d="M4 17h4l3.5-4 3 2.5L20 8" {...s} />
          <path d="M17 8h3v3" {...s} />
        </svg>
      )
  }
}

function starStateForIndex(rating: number, index: number): 'full' | 'half' | 'empty' {
  const v = rating - index
  if (v >= 1) return 'full'
  if (v >= 0.25) return 'half'
  return 'empty'
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="labStoreStars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const state = starStateForIndex(rating, i)
        if (state === 'full') {
          return (
            <span key={i} className="labStar labStar--full" aria-hidden="true">
              ★
            </span>
          )
        }
        if (state === 'half') {
          return (
            <span key={i} className="labStar labStar--half" aria-hidden="true">
              <span className="labStarBg">★</span>
              <span className="labStarFg">★</span>
            </span>
          )
        }
        return (
          <span key={i} className="labStar labStar--empty" aria-hidden="true">
            ★
          </span>
        )
      })}
    </div>
  )
}

export function LaboratoryStore({
  phase,
  title,
  intro,
  emptyMessage,
  priceLabel,
  addToCartAriaTemplate,
  addToCartLabel = 'ADD TO CART',
  closeLabel = 'CLOSE',
  filters,
  products,
  stats,
}: Props) {
  const [filter, setFilter] = useState<StoreFilter>('all')
  const [selected, setSelected] = useState<LaboratoryProductView | null>(null)
  const { addItem } = useCart()

  const visible = useMemo(() => {
    if (filter === 'all') return products
    return products.filter((p) => p.categories.includes(filter))
  }, [filter, products])

  function addProductToCart(p: LaboratoryProductView, e?: React.MouseEvent) {
    e?.stopPropagation()
    addItem({ key: p.key, title: p.title, price: p.price, image: p.image })
  }

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <section className="laboratoryStoreSection" id="roastery" aria-labelledby="laboratory-store-heading">
      <p className="phase">{phase}</p>
      <h2 id="laboratory-store-heading">{title}</h2>
      <p className="laboratoryStoreIntro">{intro}</p>

      <div className="laboratoryStoreFilters" role="tablist" aria-label="Product categories">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={filter === f.id ? 'active' : ''}
            onClick={() => setFilter(f.id as StoreFilter)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="laboratoryStoreGrid">
        {visible.length === 0 ? (
          <p className="laboratoryStoreEmpty">{emptyMessage}</p>
        ) : (
          visible.map((p) => (
            <article
              className="labProductCard labProductCard--clickable"
              key={p.key}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(p)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelected(p)
                }
              }}
            >
              <div className="labProductImage">
                <Media
                  resource={p.image}
                  alt={`${p.title} – product`}
                  fill
                  className="labProductImageMedia"
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
              <div className="labProductBody">
                <h3>{p.title}</h3>
                <p className="labProductDesc">{p.description}</p>
                <div className="labProductTags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="labProductRating">
                  <StarRow rating={p.rating} />
                  <span className="labRatingText">
                    {p.rating.toFixed(1)} ({p.reviews} reviews)
                  </span>
                </div>
                <div className="labProductBuy">
                  <div>
                    <small>{priceLabel}</small>
                    <strong>{p.price}</strong>
                  </div>
                  <button
                    type="button"
                    className="labCartBtn"
                    aria-label={addToCartAriaTemplate.replace('{title}', p.title)}
                    onClick={(e) => addProductToCart(p, e)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6.2 7.5h11l-1.4 7.2H8z" />
                      <path d="M8.6 7.5 9.8 5h3.5l1.2 2.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {selected ? (
        <div className="labProductModalBackdrop" onClick={() => setSelected(null)} role="presentation">
          <div
            className="labProductModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-product-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="labProductModalImage">
              <Media
                resource={selected.image}
                alt={`${selected.title} – product`}
                fill
                className="labProductImageMedia"
                sizes="(max-width: 700px) 100vw, 420px"
              />
            </div>
            <div className="labProductModalBody">
              <button
                type="button"
                className="labProductModalClose"
                onClick={() => setSelected(null)}
                aria-label={closeLabel}
              >
                ×
              </button>
              <h3 id="lab-product-modal-title">{selected.title}</h3>
              <p className="labProductDesc">{selected.description}</p>
              <div className="labProductTags">
                {selected.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="labProductRating">
                <StarRow rating={selected.rating} />
                <span className="labRatingText">
                  {selected.rating.toFixed(1)} ({selected.reviews} reviews)
                </span>
              </div>
              <div className="labProductModalBuy">
                <div>
                  <small>{priceLabel}</small>
                  <strong>{selected.price}</strong>
                </div>
                <button
                  type="button"
                  className="labProductModalCta"
                  onClick={() => {
                    addProductToCart(selected)
                    setSelected(null)
                  }}
                >
                  {addToCartLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="laboratoryStoreStats">
        {(stats ?? []).map((s) => (
          <div className="labStat" key={s.id ?? s.label}>
            <span className="labStatIcon" aria-hidden="true">
              <LabStatIcon type={s.icon} />
            </span>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
