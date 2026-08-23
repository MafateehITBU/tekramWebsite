import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage.js'
import { useStaticInfo } from '../context/StaticInfoContext.jsx'
import { SeoHead } from './SeoHead.jsx'
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from './jsonLd.js'
import { ROUTE_SEO, getRouteSeo } from './routeSeo.js'
import { isBlogPostPath, stripLocalePrefix } from '../utils/localePaths.js'

export function SeoManager() {
  const { pathname } = useLocation()
  const { locale } = useLanguage()
  const { staticInfo } = useStaticInfo()

  const jsonLd = useMemo(
    () => [buildOrganizationJsonLd(staticInfo), buildWebSiteJsonLd()],
    [staticInfo],
  )

  const logicalPath = stripLocalePrefix(pathname)
  const isBlogPost = isBlogPostPath(pathname)
  const routeSeo = isBlogPost ? null : getRouteSeo(logicalPath)

  if (isBlogPost || !routeSeo) return null

  const title = locale === 'ar' ? routeSeo.titleAr : routeSeo.title
  const description =
    locale === 'ar' ? routeSeo.descriptionAr : routeSeo.description
  const noindex = !ROUTE_SEO[logicalPath]

  return (
    <SeoHead
      title={title}
      description={description}
      path={pathname}
      locale={locale}
      noindex={noindex}
      jsonLd={jsonLd}
    />
  )
}
