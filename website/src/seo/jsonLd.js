import { SITE_NAME, SITE_URL } from './siteConfig.js'

/**
 * @param {Record<string, unknown> | null | undefined} staticInfo
 */
export function buildOrganizationJsonLd(staticInfo) {
  const sameAs = [
    staticInfo?.socialInstagram,
    staticInfo?.socialFacebook,
    staticInfo?.socialLinkedin,
    staticInfo?.socialYoutube,
  ].filter((url) => typeof url === 'string' && url.trim())

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo-02.png`,
    ...(staticInfo?.email ? { email: staticInfo.email } : {}),
    ...(staticInfo?.phoneNumber ? { telephone: staticInfo.phoneNumber } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: ['en', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/blogs?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * @param {{ title: string, description: string, slug: string, imageUrl?: string | null, createdAt?: string, updatedAt?: string }} blog
 */
export function buildBlogPostJsonLd(blog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    url: `${SITE_URL}/blogs/${blog.slug}`,
    mainEntityOfPage: `${SITE_URL}/blogs/${blog.slug}`,
    image: blog.imageUrl || `${SITE_URL}/logo-02.png`,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-02.png`,
      },
    },
  }
}

/**
 * @param {unknown} data
 */
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
