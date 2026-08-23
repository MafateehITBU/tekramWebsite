#!/usr/bin/env node
/**
 * Generates public/sitemap.xml before Vite build.
 * Set SITEMAP_API_URL (or VITE_API_BASE_URL) to include live blog URLs.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const siteUrl = (process.env.VITE_SITE_URL ?? 'https://tikramarabia.com').replace(/\/$/, '')
const apiBase =
  process.env.SITEMAP_API_URL ??
  process.env.VITE_API_BASE_URL ??
  'https://api.tikramarabia.com/api'

const staticPaths = [
  '/',
  '/about',
  '/contact',
  '/blogs',
  '/packages',
  '/it-solutions',
  '/digital-marketing',
  '/branding',
  '/privacy-policy',
  '/accessibility',
]

/** @param {string} path */
function localizedPath(path, locale) {
  if (locale === 'ar') {
    return path === '/' ? '/ar' : `/ar${path}`
  }
  return path
}

/** @type {string[]} */
let blogPaths = []

try {
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/public/blogs`)
  if (res.ok) {
    const data = await res.json()
    if (Array.isArray(data)) {
      blogPaths = data
        .map((item) => (typeof item?.slug === 'string' ? `/blogs/${item.slug}` : null))
        .filter(Boolean)
    }
  }
} catch {
  console.warn('[sitemap] Could not fetch blogs; static routes only.')
}

const logicalPaths = [...staticPaths, ...blogPaths]
const paths = [
  ...logicalPaths.map((path) => localizedPath(path, 'en')),
  ...logicalPaths.map((path) => localizedPath(path, 'ar')),
]
const today = new Date().toISOString().slice(0, 10)

const urls = paths
  .map(
    (path) => `  <url>
    <loc>${siteUrl}${path === '/' ? '/' : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path.includes('/blogs/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' || path === '/ar' ? '1.0' : path.endsWith('/blogs') ? '0.8' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(join(root, 'public', 'sitemap.xml'), xml, 'utf8')
console.log(`[sitemap] Wrote ${paths.length} URLs to public/sitemap.xml`)
