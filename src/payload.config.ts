import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Coffee } from './collections/Coffee'
import { Home } from './globals/Home'
import { payloadPlugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || process.env.MONGODB_URI || ''

if (!databaseUrl) {
  console.warn(
    '[payload] DATABASE_URL or MONGODB_URI is not set — API routes (signup, login) will fail to initialize Payload.',
  )
}

if (!process.env.PAYLOAD_SECRET) {
  console.warn(
    '[payload] PAYLOAD_SECRET is not set — Payload initialization may fail or JWT auth will be invalid.',
  )
}

/**
 * Atlas + Vercel/serverless: bounded pool and timeouts.
 * `family: 4` prefers IPv4 — Vercel often uses IPv6; if Atlas “Network Access” only allows
 * IPv4 (or SRV resolves oddly), TLS can fail with “alert internal error” without this.
 * Set `MONGODB_DISABLE_IPV4=1` to skip (e.g. IPv6-only clusters).
 */
const mongoConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 45000,
  ...(process.env.MONGODB_DISABLE_IPV4 === '1' ? {} : { family: 4 as const }),
}

export default buildConfig({
  /** Surface real error details in API JSON during local dev (see routeError). */
  debug: process.env.NODE_ENV === 'development',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Coffee],
  globals: [Home],
  localization: {
    locales: [
      { label: 'Deutsch', code: 'de' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'de',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: databaseUrl,
    connectOptions: mongoConnectOptions,
  }),
  sharp,
  plugins: payloadPlugins,
})
