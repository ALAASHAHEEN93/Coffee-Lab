import React from 'react'
import { AuthShell } from './auth/AuthShell'
import { withBase } from '@/lib/withBase'

/** Shown instead of login / sign-up / account in the static demo (there is no server there). */
export function DemoNotice() {
  return (
    <AuthShell
      title="Demo version"
      subtitle="Accounts need the full version of CoffeeLab (Next.js + Payload CMS + MongoDB). This page is a static demo for GitHub Pages."
    >
      <p className="authSubtitle" lang="de">
        Konten gibt es nur in der Vollversion (Next.js + Payload CMS + MongoDB). Diese Seite ist eine statische Demo auf GitHub Pages.
      </p>
      <a className="authSubmit authSubmit--link" href={withBase('/')}>
        Back to the shop
      </a>
      <p className="authFoot">
        <a className="authLink" href="https://github.com/ALAASHAHEEN93/Coffee-Lab">View the code on GitHub</a>
      </p>
    </AuthShell>
  )
}
