import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import api from '../axiosConfig.js'
import { BlogPostArticle } from '../components/blog/BlogPostArticle.jsx'
import { BlogPostSidebar } from '../components/blog/BlogPostSidebar.jsx'
import { LocalizedLink } from '../components/common/LocalizedLink.jsx'
import { Header } from '../components/layout/Header.jsx'
import { getBlogPostContent } from '../content/blogPost.js'
import { getHomeContent } from '../content/index.js'
import { useLanguage } from '../context/useLanguage.js'
import { formatBlogDate, getBlogLabels } from '../components/home/Blogs/blogLocale.js'
import { SeoHead } from '../seo/SeoHead.jsx'
import { optimizeMediaUrl } from '../utils/mediaUrl.js'
import { buildBlogPostJsonLd, buildOrganizationJsonLd } from '../seo/jsonLd.js'
import { SITE_NAME } from '../seo/siteConfig.js'

export function BlogPost() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const { locale } = useLanguage()
  const copy = getBlogPostContent(locale)
  const { blogs: cardCopy } = getHomeContent(locale)
  const isRtl = locale === 'ar'

  const [blog, setBlog] = useState(/** @type {Record<string, unknown> | null} */ (null))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .get(`/public/blogs/${slug}`)
      .then((res) => {
        if (!cancelled) {
          setBlog(res.data)
          const viewKey = `blog-view-recorded:${slug}`
          if (!sessionStorage.getItem(viewKey)) {
            sessionStorage.setItem(viewKey, '1')
            void api.post(`/public/blogs/${slug}/view`).catch(() => {})
          }
        }
      })
      .catch(() => {
        if (!cancelled) setError('not-found')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const labels = blog ? getBlogLabels(locale, blog) : null
  const createdAt = blog ? formatBlogDate(String(blog.createdAt ?? ''), locale) : ''

  const seo = useMemo(() => {
    if (!blog || !labels || !slug) return null
    const plain = labels.excerpt || labels.title
    return {
      title: `${labels.title} | ${SITE_NAME}`,
      description: plain.slice(0, 160),
      path: pathname,
      ogImage:
        typeof blog.featuredImageUrl === 'string'
          ? optimizeMediaUrl(blog.featuredImageUrl, { width: 1200 }) || undefined
          : undefined,
      jsonLd: [
        buildOrganizationJsonLd(null),
        buildBlogPostJsonLd({
          title: labels.title,
          description: plain.slice(0, 300),
          slug,
          imageUrl:
            typeof blog.featuredImageUrl === 'string'
              ? optimizeMediaUrl(blog.featuredImageUrl, { width: 1200 })
              : null,
          createdAt: String(blog.createdAt ?? ''),
          updatedAt: String(blog.updatedAt ?? blog.createdAt ?? ''),
        }),
      ],
    }
  }, [blog, labels, slug, pathname])

  return (
    <>
      {seo ? (
        <SeoHead
          title={seo.title}
          description={seo.description}
          path={seo.path}
          locale={locale}
          ogImage={seo.ogImage}
          jsonLd={seo.jsonLd}
        />
      ) : error && !loading ? (
        <SeoHead
          title={`Not Found | ${SITE_NAME}`}
          description="The requested blog post could not be found."
          path={pathname}
          locale={locale}
          noindex
          jsonLd={[]}
        />
      ) : null}
      <Header />
      <main
        className="section-solid site-container md:px-25 min-h-[50vh] py-10 sm:py-12 lg:py-14"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {loading ? (
          <p className="font-body text-foreground/70">{copy.loading}</p>
        ) : null}

        {error || !blog ? (
          !loading ? (
            <div>
              <p className="font-body text-foreground/70">{copy.notFound}</p>
              <LocalizedLink
                to="/blogs"
                className="mt-4 inline-block font-body text-primary hover:underline dark:text-secondary"
              >
                {copy.backToBlog}
              </LocalizedLink>
            </div>
          ) : null
        ) : null}

        {blog && labels ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
            <BlogPostArticle
              title={labels.title}
              categoryName={labels.categoryName}
              bodyHtml={labels.bodyHtml}
              createdAt={createdAt}
              readTime={labels.readTime}
              featuredImageUrl={blog.featuredImageUrl}
              minReadLabel={cardCopy.minRead}
              locale={locale}
            />
            <BlogPostSidebar locale={locale} currentSlug={slug} />
          </div>
        ) : null}
      </main>
    </>
  )
}
