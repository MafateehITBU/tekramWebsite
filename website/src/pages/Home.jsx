import { Suspense, useLayoutEffect } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { HeroSection } from '../components/home/Hero/HeroSection.jsx'
import { lazyNamed } from '../utils/lazyNamed.js'

const ServicesSection = lazyNamed(
  () => import('../components/home/Services/ServicesSection.jsx'),
  'ServicesSection',
)
const CompanySection = lazyNamed(
  () => import('../components/home/Company/CompanySection.jsx'),
  'CompanySection',
)
const PromoSection = lazyNamed(
  () => import('../components/home/Promo/PromoSection.jsx'),
  'PromoSection',
)
const ProcessSection = lazyNamed(
  () => import('../components/home/Process/ProcessSection.jsx'),
  'ProcessSection',
)
const PartnersSection = lazyNamed(
  () => import('../components/home/Partners/PartnersSection.jsx'),
  'PartnersSection',
)
const PricingSection = lazyNamed(
  () => import('../components/home/Pricing/PricingSection.jsx'),
  'PricingSection',
)
const TestimonialsSection = lazyNamed(
  () => import('../components/home/Testimonials/TestimonialsSection.jsx'),
  'TestimonialsSection',
)
const BlogsSection = lazyNamed(
  () => import('../components/home/Blogs/BlogsSection.jsx'),
  'BlogsSection',
)

export function Home() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-home', '')
    document.documentElement.classList.add('app-ready')
    return () => {
      document.documentElement.removeAttribute('data-home')
      document.documentElement.classList.remove('app-ready')
    }
  }, [])

  return (
    <>
      <Header />
      <main className="site-container text-white">
        <HeroSection />
      </main>
      <Suspense fallback={null}>
        <ServicesSection />
        <CompanySection />
        <PromoSection />
        <ProcessSection />
        <PartnersSection />
        <PricingSection />
        <TestimonialsSection />
        <BlogsSection />
      </Suspense>
    </>
  )
}
