'use client'

import React, { useEffect, useMemo } from 'react'
import { Media } from '@/components/Media'
import { resolveProductImage, type LaboratoryProductView } from '@/lib/laboratoryFallbackProducts'
import type { CartLine } from './CartContext'
import { useCart } from './CartContext'

function parsePrice(price: string): number {
  const n = parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

function formatSubtotal(items: CartLine[]): string {
  const sum = items.reduce((acc, item) => acc + parsePrice(item.price), 0)
  const sample = items[0]?.price ?? ''
  if (sample.includes('€')) return `€${sum.toFixed(2).replace('.', ',')}`
  return `$${sum.toFixed(2)}`
}

export function CartDrawer({
  catalog = [],
  title = 'SPECIMEN_CART',
  phase = 'LAB_PROTOCOL // CART',
  emptyLabel = 'No specimens in cart yet.',
  emptyHint = 'Browse the laboratory store and add a roast to begin.',
  priceLabel = 'PRICE / 12OZ',
  subtotalLabel = 'SUBTOTAL',
  checkoutLabel = 'CHECKOUT',
  removeLabel = 'Remove item',
}: {
  catalog?: LaboratoryProductView[]
  title?: string
  phase?: string
  emptyLabel?: string
  emptyHint?: string
  priceLabel?: string
  subtotalLabel?: string
  checkoutLabel?: string
  removeLabel?: string
}) {
  const { items, isOpen, closeCart, removeItem } = useCart()
  const subtotal = useMemo(() => formatSubtotal(items), [items])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div className="cartDrawerBackdrop" onClick={closeCart} role="presentation">
      <aside
        className="cartDrawer"
        id="cart"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cartDrawerHead">
          <div className="cartDrawerHeadText">
            <p className="cartDrawerPhase">{phase}</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="cartDrawerClose" onClick={closeCart} aria-label="Close cart">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="cartDrawerBody">
          {items.length === 0 ? (
            <div className="cartDrawerEmpty">
              <div className="cartDrawerEmptyIcon" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M6.2 7.5h11l-1.4 7.2H8z" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M8.6 7.5 9.8 5h3.5l1.2 2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </div>
              <p className="cartDrawerEmptyTitle">{emptyLabel}</p>
              <p className="cartDrawerEmptyHint">{emptyHint}</p>
            </div>
          ) : (
            <ul className="cartDrawerList">
              {items.map((item, i) => {
                const image = resolveProductImage(item, catalog)
                return (
                <li key={`${item.key}-${i}`} className="cartDrawerItem">
                  <div className="cartDrawerItemThumb">
                    <Media
                      resource={image}
                      alt={item.title}
                      fill
                      className="cartDrawerItemImg"
                      sizes="72px"
                    />
                  </div>
                  <div className="cartDrawerItemMain">
                    <h3 className="cartDrawerItemTitle">{item.title}</h3>
                    <p className="cartDrawerItemMeta">{priceLabel}</p>
                    <p className="cartDrawerItemPrice">{item.price}</p>
                  </div>
                  <button
                    type="button"
                    className="cartDrawerItemRemove"
                    onClick={() => removeItem(i)}
                    aria-label={`${removeLabel}: ${item.title}`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              )})}
            </ul>
          )}
        </div>

        <footer className="cartDrawerFoot">
          <div className="cartDrawerSummary">
            <span className="cartDrawerSummaryLabel">{subtotalLabel}</span>
            <strong className="cartDrawerSummaryValue">{items.length ? subtotal : '—'}</strong>
          </div>
          {items.length > 0 ? (
            <p className="cartDrawerFootNote">
              {items.length} specimen{items.length === 1 ? '' : 's'} · roasted to order · Köln
            </p>
          ) : null}
          <button type="button" className="cartDrawerCheckout" disabled={items.length === 0}>
            {checkoutLabel}
          </button>
        </footer>
      </aside>
    </div>
  )
}
