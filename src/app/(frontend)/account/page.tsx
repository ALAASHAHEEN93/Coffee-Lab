import React from 'react'
import { AccountClient } from '../auth/AccountClient'
import { AuthShell } from '../auth/AuthShell'

export const metadata = {
  title: 'Your account · CoffeeLab',
  description: 'CoffeeLab account and session.',
}

export default function AccountPage() {
  return (
    <AuthShell title="Your account" subtitle="Session and profile for CoffeeLab Molecular Roastery.">
      <AccountClient />
    </AuthShell>
  )
}
