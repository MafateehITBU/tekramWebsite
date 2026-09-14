/** @typedef {'en' | 'ar'} Locale */

export const AR_PREFIX = '/ar'

/**
 * Normalize a pasted/shared URL path so React Router can match it.
 * Strips trailing slashes and lowercases (slugs/ids are stored lowercase).
 * @param {string} pathname
 */
export function canonicalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/'
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  return trimmed === '/' ? '/' : trimmed.toLowerCase()
}

/**
 * @param {string} pathname
 * @returns {Locale}
 */
export function localeFromPathname(pathname) {
  const normalized = canonicalizePathname(pathname)
  if (normalized === AR_PREFIX || normalized.startsWith(`${AR_PREFIX}/`)) return 'ar'
  return 'en'
}

/**
 * Path without the /ar prefix (for route matching and SEO keys).
 * @param {string} pathname
 */
export function stripLocalePrefix(pathname) {
  const normalized = canonicalizePathname(pathname)
  if (normalized === AR_PREFIX) return '/'
  if (normalized.startsWith(`${AR_PREFIX}/`)) {
    const rest = normalized.slice(AR_PREFIX.length)
    return rest || '/'
  }
  return normalized
}

/**
 * @param {string} path — logical path (e.g. `/about`)
 * @param {Locale} locale
 */
export function localizedPath(path, locale) {
  const logical = path.startsWith('/') ? path : `/${path}`
  if (locale === 'ar') {
    return logical === '/' ? AR_PREFIX : `${AR_PREFIX}${logical}`
  }
  return logical
}

/**
 * Same page in the other language.
 * @param {string} pathname — full pathname from the router
 * @param {Locale} targetLocale
 */
export function switchLocalePath(pathname, targetLocale) {
  return localizedPath(stripLocalePrefix(pathname), targetLocale)
}

/**
 * @param {string} pathname
 */
export function isBlogPostPath(pathname) {
  return /^\/blogs\/.+/.test(stripLocalePrefix(pathname))
}

/**
 * Decode a blog slug/id from the URL (shared links often include encoding or punctuation).
 * @param {string | undefined} raw
 */
export function normalizeBlogLookupKey(raw) {
  if (!raw) return ''
  let key = String(raw)
  try {
    key = decodeURIComponent(key)
  } catch {
    /* keep raw */
  }
  return key.replace(/[.,);]+$/g, '').trim()
}
