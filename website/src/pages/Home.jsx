import { Suspense, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Header } from '../components/layout/Header.jsx'
import { HeroSection } from '../components/home/Hero/HeroSection.jsx'
import { HeroSocialLinks } from '../components/home/Hero/HeroSocialLinks.jsx'
import { lazyNamed } from '../utils/lazyNamed.js'
import { useIsNarrow } from '../hooks/useIsNarrow.js'

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

function HomeBelowFold() {
  return (
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
  )
}

function MobileHomeHero() {
  const [socialSlot, setSocialSlot] = useState(/** @type {HTMLElement | null} */ (null))

  useLayoutEffect(() => {
    setSocialSlot(document.getElementById('boot-social'))
  }, [])

  return (
    <>
      <div className="min-h-[calc(100dvh-3.5rem)] w-full" aria-hidden />
      {socialSlot
        ? createPortal(
            <div className="mt-6">
              <HeroSocialLinks />
            </div>,
            socialSlot,
          )
        : null}
    </>
  )
}

export function Home() {
  const isNarrow = useIsNarrow()

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
      {isNarrow ? (
        <MobileHomeHero />
      ) : (
        <main className="site-container text-white">
          <HeroSection />
        </main>
      )}
      <HomeBelowFold />
    </>
  )
}
