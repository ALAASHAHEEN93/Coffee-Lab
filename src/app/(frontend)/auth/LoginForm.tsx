'use client'

import { parsePayloadError } from '@/lib/authApi'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (!res.ok) {
        setError(await parsePayloadError(res))
        return
      }
      router.push('/account')
      router.refresh()
    } catch {
      setError('Network error — try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="authForm" onSubmit={onSubmit}>
      {error ? (
        <p className="authError" role="alert">
          {error}
        </p>
      ) : null}
      <label className="authField">
        <span className="authLabel">Email</span>
        <input
          className="authInput"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="authField">
        <span className="authLabel">Password</span>
        <input
          className="authInput"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button className="authSubmit" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="authFoot">
        No account yet?{' '}
        <a href="/signup" className="authLink">
          Create one
        </a>
      </p>
    </form>
  )
}
