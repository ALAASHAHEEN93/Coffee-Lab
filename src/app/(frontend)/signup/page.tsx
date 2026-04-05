import React from 'react'
import { AuthShell } from '../auth/AuthShell'
import { SignupForm } from '../auth/SignupForm'

export const metadata = {
  title: 'Create account · CoffeeLab',
  description: 'Join CoffeeLab Molecular Roastery.',
}

export default function SignupPage() {
  return (
    <AuthShell title="Join the lab" subtitle="Create an account to track orders and preferences.">
      <SignupForm />
    </AuthShell>
  )
}
