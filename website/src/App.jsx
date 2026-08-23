import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { localizedPath } from './utils/localePaths.js'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { ScrollToTop } from './components/common/ScrollToTop.jsx'
import { ToastProvider } from './components/ui/ToastProvider.jsx'
import { SiteShell } from './components/layout/SiteShell.jsx'
import { LanguageProvider } from './context/LanguageProvider.jsx'
import { BlogPost } from './pages/BlogPost.jsx'
import { Blogs } from './pages/Blogs.jsx'
import { Home } from './pages/Home.jsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy.jsx'
import { About } from './pages/About.jsx'
import { IT } from './pages/IT.jsx'
import { Marketing } from './pages/Marketing.jsx'
import { Branding } from './pages/Branding.jsx'
import { Packages } from './pages/Packages.jsx'
import { Contact } from './pages/Contact.jsx'
import { Accessibility } from './pages/Accessibility.jsx'
import { NotFound } from './pages/NotFound.jsx'

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
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-in-out',
      disable: shouldDisableAos,
    })

    const onResize = () => {
      AOS.refresh()
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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
