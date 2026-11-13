/**
 * Builds the static demo of CoffeeLab for GitHub Pages into ./out
 *
 * GitHub Pages can only host static files, so this build leaves out everything that needs
 * a server (Payload CMS admin + API, middleware, accounts) and renders the shop from the
 * built-in content in ./src/lib (homeDefaults + homeSeedDe).
 *
 * It REWRITES THE CHECKOUT IN PLACE, so it only runs in CI (GitHub Actions) or with --force.
 * The full app for Vercel is not affected: it never runs this script.
 */
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'

const root = process.cwd()
if (!process.env.CI && !process.argv.includes('--force')) {
  console.error('build-pages: this script modifies the working tree. Run it in CI, or pass --force in a throwaway copy.')
  process.exit(1)
}

const rel = (...p) => path.join(root, ...p)
const front = rel('src/app/(frontend)')

// 1. Remove server-only parts
for (const p of ['src/app/(payload)', 'src/app/api', 'src/middleware.ts', 'next.config.ts']) {
  rmSync(rel(p), { recursive: true, force: true })
}
for (const r of ['account', 'login', 'signup']) rmSync(path.join(front, r), { recursive: true, force: true })

// 2. Static pages + config
cpSync(rel('pages-demo/app'), front, { recursive: true })
cpSync(rel('pages-demo/DemoNotice.tsx'), path.join(front, 'DemoNotice.tsx'))
cpSync(rel('pages-demo/next.config.mjs'), rel('next.config.mjs'))

// 3. Build
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Coffee-Lab'
execSync('pnpm exec next build', {
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_STATIC_DEMO: '1', NEXT_TELEMETRY_DISABLED: '1' },
})

if (!existsSync(rel('out/index.html'))) throw new Error('build-pages: out/index.html missing')
writeFileSync(rel('out/.nojekyll'), '')
console.log('build-pages: static demo ready in ./out')
