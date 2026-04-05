import React from 'react'
import { AuthShell } from '../auth/AuthShell'
import { LoginForm } from '../auth/LoginForm'

export const metadata = {
  title: 'Sign in · CoffeeLab',
  description: 'Sign in to your CoffeeLab account.',
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to access your roastery account.">
      <LoginForm />
    </AuthShell>
  )
}
