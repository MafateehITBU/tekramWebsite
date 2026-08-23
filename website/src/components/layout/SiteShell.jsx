import { useLocation } from 'react-router-dom'
import { CtaSection } from './CtaSection.jsx'
import { Footer } from './Footer.jsx'
import { Analytics } from './Analytics.jsx'
import { CookieConsent } from './CookieConsent.jsx'
import { SeoManager } from '../../seo/SeoManager.jsx'
import { SiteBackground } from './SiteBackground.jsx'
import { stripLocalePrefix } from '../../utils/localePaths.js'

/**
 * App shell: background decor, page content, optional CTA, footer.
 *
 * ADD a route without CTA → extend `shouldShowCta` (e.g. blogs, privacy, home).
 * CTA copy lives in `content/cta.js`; component is `CtaSection.jsx`.
 */

const STATIC_ROUTES = new Set([
  '/',
  '/blogs',
  '/privacy-policy',
  '/about',
  '/it-solutions',
  '/digital-marketing',
  '/branding',
  '/packages',
  '/contact',
  '/accessibility',
])

/** @param {string} pathname — full pathname (may include /ar) */
function isKnownRoute(pathname) {
  const path = stripLocalePrefix(pathname)
  if (STATIC_ROUTES.has(path)) return true
  if (/^\/blogs\/[^/]+$/.test(path)) return true
  return false
}

/** Return false on paths that should NOT show the shared CTA above the footer. */
function shouldShowCta(pathname) {
  const path = stripLocalePrefix(pathname)
  if (!isKnownRoute(pathname)) return false
  if (path === '/') return false
  if (path === '/contact') return false
  if (path === '/privacy-policy') return false
  if (path === '/blogs') return false
  if (path.startsWith('/blogs/')) return false
  return true
}

/**
 * Wraps every page: full-height decor behind, content stacked above.
 */
export function SiteShell({ children }) {
  const { pathname } = useLocation()
  const showCta = shouldShowCta(pathname)

  return (
    <div className="relative isolate flex min-h-0 w-full flex-1 flex-col">
      <SiteBackground />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <SeoManager />
        <Analytics />
        {children}
        {showCta ? <CtaSection /> : null}
        <Footer />
        <CookieConsent />
      </div>
    </div>
  )
}
