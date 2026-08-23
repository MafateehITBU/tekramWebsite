import { useEffect } from 'react'
import { absoluteUrl } from './routeSeo.js'
import { DEFAULT_OG_IMAGE, SITE_NAME } from './siteConfig.js'
import { serializeJsonLd } from './jsonLd.js'
import { localizedPath, stripLocalePrefix } from '../utils/localePaths.js'

/**
 * @param {string} name
 * @param {string} content
 */
function upsertMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * @param {string} property
 * @param {string} content
 */
function upsertOg(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * @param {string} rel
 * @param {string} href
 * @param {Record<string, string>} [extra]
 */
function upsertLink(rel, href, extra = {}) {
  const selector = Object.entries(extra).reduce(
    (acc, [key, value]) => `${acc}[${key}="${value}"]`,
    `link[rel="${rel}"]`,
  )
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    Object.entries(extra).forEach(([key, value]) => el.setAttribute(key, value))
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * @param {string} id
 * @param {unknown} data
 */
function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = serializeJsonLd(data)
}

/**
 * @param {{
 *   title: string,
 *   description: string,
 *   path: string,
 *   locale?: 'en' | 'ar',
 *   ogImage?: string,
 *   noindex?: boolean,
 *   jsonLd?: unknown[],
 * }} props
 */
export function SeoHead({
  title,
  description,
  path,
  locale = 'en',
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  jsonLd = [],
}) {
  useEffect(() => {
    document.title = title
    upsertMeta('description', description)
    upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('author', SITE_NAME)

    const canonical = absoluteUrl(path)
    upsertLink('canonical', canonical)

    const logicalPath = stripLocalePrefix(path)
    const enUrl = absoluteUrl(localizedPath(logicalPath, 'en'))
    const arUrl = absoluteUrl(localizedPath(logicalPath, 'ar'))
    upsertLink('alternate', enUrl, { hreflang: 'en' })
    upsertLink('alternate', arUrl, { hreflang: 'ar' })
    upsertLink('alternate', enUrl, { hreflang: 'x-default' })

    upsertOg('og:type', 'website')
    upsertOg('og:site_name', SITE_NAME)
    upsertOg('og:title', title)
    upsertOg('og:description', description)
    upsertOg('og:url', canonical)
    upsertOg('og:image', ogImage)
    upsertOg('og:locale', locale === 'ar' ? 'ar_SA' : 'en_US')

    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', title)
    upsertMeta('twitter:description', description)
    upsertMeta('twitter:image', ogImage)

    jsonLd.forEach((block, index) => {
      upsertJsonLd(`json-ld-${index}`, block)
    })

    const staleCount = document.querySelectorAll('script[id^="json-ld-"]').length
    for (let i = jsonLd.length; i < staleCount; i += 1) {
      document.getElementById(`json-ld-${i}`)?.remove()
    }
  }, [title, description, path, locale, ogImage, noindex, JSON.stringify(jsonLd)])

  return null
}
