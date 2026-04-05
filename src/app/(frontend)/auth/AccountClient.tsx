'use client'

import { parsePayloadError } from '@/lib/authApi'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

type MeUser = {
  id: string
  email?: string
  roles?: string[]
}

export function AccountClient() {
  const router = useRouter()
  const [user, setUser] = useState<MeUser | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [logoutPending, setLogoutPending] = useState(false)

  const loadMe = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch('/api/users/me', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.status === 401) {
        setUser(null)
        return
      }
      if (!res.ok) {
        setError(await parsePayloadError(res))
        setUser(null)
        return
      }
      const data = (await res.json()) as { user?: MeUser }
      setUser(data.user ?? null)
    } catch {
      setError('Could not load your session.')
      setUser(null)
    }
  }, [])

  useEffect(() => {
    void loadMe()
  }, [loadMe])

  async function logout() {
    setLogoutPending(true)
    setError(null)
    try {
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        setError(await parsePayloadError(res))
        return
      }
      setUser(null)
      router.push('/login')
      router.refresh()
    } catch {
      setError('Could not sign out.')
    } finally {
      setLogoutPending(false)
    }
  }

  if (user === undefined) {
    return (
      <div className="authForm">
        <p className="authMuted">Loading your lab profile…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="authForm">
        <p className="authMuted">You’re not signed in.</p>
        <a className="authSubmit authSubmit--link" href="/login">
          Sign in
        </a>
        <p className="authFoot">
          New here?{' '}
          <a href="/signup" className="authLink">
            Create an account
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="authForm authForm--account">
      {error ? (
        <p className="authError" role="alert">
          {error}
        </p>
      ) : null}
      <dl className="authDl">
        <div>
          <dt className="authDt">Email</dt>
          <dd className="authDd">{user.email ?? '—'}</dd>
        </div>
        {user.roles?.length ? (
          <div>
            <dt className="authDt">Access</dt>
            <dd className="authDd">{user.roles.join(', ')}</dd>
          </div>
        ) : null}
      </dl>
      <div className="authActions">
        <a className="authSecondary" href="/">
          Back to site
        </a>
        <button className="authSubmit" type="button" onClick={() => void logout()} disabled={logoutPending}>
          {logoutPending ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  )
}
