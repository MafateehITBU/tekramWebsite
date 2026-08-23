/**
 * Rewrite Cloudinary delivery URLs with f_auto / q_auto / optional width.
 * Non-Cloudinary URLs are returned unchanged so CMS and static assets keep working.
 *
 * @param {unknown} url
 * @param {{ width?: number }} [opts]
 * @returns {string}
 */
export function optimizeMediaUrl(url, opts = {}) {
  if (typeof url !== 'string' || !url.trim()) return ''

  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('res.cloudinary.com')) return url

    const segments = parsed.pathname.split('/').filter(Boolean)
    const uploadAt = segments.indexOf('upload')
    if (uploadAt === -1) return url

    const next = segments[uploadAt + 1] || ''
    const alreadyTransformed = /(?:^|,)(?:f_auto|q_auto|w_\d+)(?:$|,)/.test(next)
    if (alreadyTransformed) return url

    const transforms = ['f_auto', 'q_auto']
    if (typeof opts.width === 'number' && opts.width > 0) {
      transforms.push(`w_${Math.round(opts.width)}`)
    }

    segments.splice(uploadAt + 1, 0, transforms.join(','))
    parsed.pathname = `/${segments.join('/')}`
    return parsed.toString()
  } catch {
    return url
  }
}
