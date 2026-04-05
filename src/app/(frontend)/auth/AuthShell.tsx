import React from 'react'
import { CoffeeLabLogo } from '../CoffeeLabLogo'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="authPage">
      <div className="authPageBg" aria-hidden />
      <header className="authTopbar">
        <a className="logoHomeLink" href="/" aria-label="CoffeeLab — home">
          <CoffeeLabLogo siteName="CoffeeLab" size="header" />
        </a>
      </header>

      <div className="authMain">
        <div className="authCard">
          <p className="authKicker">CoffeeLab · Molecular Roastery</p>
          <h1 className="authTitle">{title}</h1>
          {subtitle ? <p className="authSubtitle">{subtitle}</p> : null}
          {children}
        </div>
      </div>
    </div>
  )
}
