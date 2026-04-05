/**
 * Payload REST (same origin). Cookies: `credentials: 'include'`.
 */

/** When Payload fails to boot, the API returns this generic line — replace with something actionable. */
function explainPayloadInitFailure(message: string): string {
  const m = message.toLowerCase()
  if (!m.includes('initializing payload')) return message
  return [
    'The app cannot reach MongoDB, so the server cannot create your account.',
    'Fix: In MongoDB Atlas → Network Access, allow your current IP (or 0.0.0.0/0 for local dev only).',
    'Confirm DATABASE_URL or MONGODB_URI and PAYLOAD_SECRET in .env, then restart the dev server.',
  ].join(' ')
}

export async function parsePayloadError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as {
      message?: string
      errors?: { message?: string }[]
      stack?: string
    }
    if (body.errors?.length) {
      const joined = body.errors.map((e) => e.message).filter(Boolean).join(' · ') || res.statusText
      return explainPayloadInitFailure(joined)
    }
    if (body.message) {
      const base = explainPayloadInitFailure(body.message)
      if (process.env.NODE_ENV === 'development' && body.stack) {
        return `${base}\n${body.stack.split('\n').slice(0, 4).join('\n')}`
      }
      return base
    }
  } catch {
    // ignore
  }
  return res.statusText || 'Request failed'
}
