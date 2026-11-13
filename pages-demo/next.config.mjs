/**
 * Next.js config for the static GitHub Pages demo only (used by scripts/build-pages.mjs).
 * The full app (Vercel) keeps using the root next.config.mjs with Payload.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Coffee-Lab'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
