'use client'

import { parsePayloadError } from '@/lib/authApi'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }
    setPending(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (!res.ok) {
        setError(await parsePayloadError(res))
        return
      }
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (!loginRes.ok) {
        setError('Account created — sign in to continue.')
        router.push('/login')
        router.refresh()
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </label>
      <label className="authField">
        <span className="authLabel">Confirm password</span>
        <input
          className="authInput"
          type="password"
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
        />
      </label>
      <button className="authSubmit" type="submit" disabled={pending}>
        {pending ? 'Creating account…' : 'Create account'}
      </button>
      <p className="authFoot">
        Already have an account?{' '}
        <a href="/login" className="authLink">
          Sign in
        </a>
      </p>
    </form>
  )
}
