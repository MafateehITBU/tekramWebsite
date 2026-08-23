export const SITE_NAME = 'Tikram Arabia'
export const SITE_NAME_AR = 'تكرم العربية'

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? 'https://tikramarabia.com'
).replace(/\/$/, '')

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-02.png`

export const DEFAULT_DESCRIPTION =
  'Tikram Arabia delivers IT solutions, digital marketing, and branding services for businesses across Saudi Arabia and the region.'

export const DEFAULT_DESCRIPTION_AR =
  'تكرم العربية تقدم حلول تقنية المعلومات والتسويق الرقمي والعلامات التجارية للشركات في المملكة العربية السعودية والمنطقة.'

/** Static routes included in sitemap (path only). */
export const STATIC_SITEMAP_PATHS = [
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
