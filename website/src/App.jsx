import { Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { localizedPath } from './utils/localePaths.js'
import { lazyNamed } from './utils/lazyNamed.js'

import { ScrollToTop } from './components/common/ScrollToTop.jsx'
import { ToastProvider } from './components/ui/ToastProvider.jsx'
import { SiteShell } from './components/layout/SiteShell.jsx'
import { LanguageProvider } from './context/LanguageProvider.jsx'
import { Home } from './pages/Home.jsx'

const BlogPost = lazyNamed(() => import('./pages/BlogPost.jsx'), 'BlogPost')
const Blogs = lazyNamed(() => import('./pages/Blogs.jsx'), 'Blogs')
const PrivacyPolicy = lazyNamed(() => import('./pages/PrivacyPolicy.jsx'), 'PrivacyPolicy')
const About = lazyNamed(() => import('./pages/About.jsx'), 'About')
const IT = lazyNamed(() => import('./pages/IT.jsx'), 'IT')
const Marketing = lazyNamed(() => import('./pages/Marketing.jsx'), 'Marketing')
const Branding = lazyNamed(() => import('./pages/Branding.jsx'), 'Branding')
const Packages = lazyNamed(() => import('./pages/Packages.jsx'), 'Packages')
const Contact = lazyNamed(() => import('./pages/Contact.jsx'), 'Contact')
const Accessibility = lazyNamed(() => import('./pages/Accessibility.jsx'), 'Accessibility')
const NotFound = lazyNamed(() => import('./pages/NotFound.jsx'), 'NotFound')

const AOS_MIN_WIDTH = 1024

const PAGE_ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/blogs', element: <Blogs /> },
  { path: '/blogs/:slug', element: <BlogPost /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/about', element: <About /> },
  { path: '/it-solutions', element: <IT /> },
  { path: '/digital-marketing', element: <Marketing /> },
  { path: '/branding', element: <Branding /> },
  { path: '/packages', element: <Packages /> },
  { path: '/contact', element: <Contact /> },
  { path: '/accessibility', element: <Accessibility /> },
]

function shouldDisableAos() {
  return window.innerWidth < AOS_MIN_WIDTH
}

function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {PAGE_ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {PAGE_ROUTES.map(({ path, element }) => {
          const arPath = localizedPath(path, 'ar')
          return <Route key={arPath} path={arPath} element={element} />
        })}
        <Route path="/blog" element={<Navigate to="/blogs" replace />} />
        <Route path="/ar/blog" element={<Navigate to="/ar/blogs" replace />} />
        <Route path="/blog/:slug" element={<BlogRedirect />} />
        <Route path="/ar/blog/:slug" element={<BlogRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

function BlogRedirect() {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const blogsBase = localizedPath('/blogs', pathname.startsWith('/ar') ? 'ar' : 'en')
  return <Navigate to={slug ? `${blogsBase}/${slug}` : blogsBase} replace />
}

function App() {
  useEffect(() => {
    if (shouldDisableAos()) return undefined

    let cancelled = false
    let aosApi = null

    Promise.all([import('aos'), import('aos/dist/aos.css')]).then(([aosMod]) => {
      if (cancelled) return
      aosApi = aosMod.default
      aosApi.init({
        duration: 700,
        once: true,
        easing: 'ease-in-out',
        disable: shouldDisableAos,
      })
    })

    const onResize = () => {
      aosApi?.refresh()
    }

    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider />
        <ScrollToTop />
        <SiteShell>
          <AppRoutes />
        </SiteShell>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
