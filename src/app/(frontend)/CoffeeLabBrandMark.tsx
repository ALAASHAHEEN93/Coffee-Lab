import Image from 'next/image'
import React from 'react'

const LOGO_ICON_SRC = '/images/coffeelab-logo-icon.png'

type CoffeeLabBrandMarkProps = {
  siteName: string
  /** `header` = top bar; `footer` = slightly smaller */
  size?: 'header' | 'footer'
  className?: string
  priority?: boolean
}

/**
 * Navbar wordmark: flask + flashing dot + COFFEE/LAB + MOLECULAR ROASTERY + // + V.4.2
 */
export function CoffeeLabBrandMark({
  siteName,
  size = 'header',
  className = '',
  priority,
}: CoffeeLabBrandMarkProps) {
  const rootClass = `coffeeLabBrandMark coffeeLabBrandMark--${size} ${className}`.trim()
  const iconPx = size === 'footer' ? 22 : 28

  return (
    <div className={rootClass} role="img" aria-label={siteName}>
      <span className="coffeeLabBrandMark__iconWrap" aria-hidden>
        <Image
          src={LOGO_ICON_SRC}
          alt=""
          width={iconPx}
          height={iconPx}
          className="coffeeLabBrandMark__iconImg"
          priority={priority}
          sizes={`${iconPx}px`}
        />
      </span>
      <span className="coffeeLabBrandMark__pulseDot" aria-hidden />
      <div className="coffeeLabBrandMark__textCol">
        <div className="coffeeLabBrandMark__titleRow">
          <span className="coffeeLabBrandMark__coffee">COFFEE</span>
          <span className="coffeeLabBrandMark__lab">LAB</span>
        </div>
        <div className="coffeeLabBrandMark__tagRow">
          <span className="coffeeLabBrandMark__tag">MOLECULAR ROASTERY</span>
        </div>
        <span className="coffeeLabBrandMark__slashes" aria-hidden>
          //
        </span>
        <span className="coffeeLabBrandMark__ver">V.4.2</span>
      </div>
    </div>
  )
}
