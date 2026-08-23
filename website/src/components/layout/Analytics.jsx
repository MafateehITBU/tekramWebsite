import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { hasAnalyticsConsent, onAnalyticsConsent } from '../../utils/analyticsConsent.js'

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim()

function loadGa4() {
  if (!GA_ID || typeof window === 'undefined' || !hasAnalyticsConsent()) return

  const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)
  if (existing) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(...args) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID, { anonymize_ip: true })
}

export function Analytics() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (hasAnalyticsConsent()) loadGa4()
    return onAnalyticsConsent(loadGa4)
  }, [])

  useEffect(() => {
    if (!GA_ID || !hasAnalyticsConsent() || typeof window.gtag !== 'function') return
    window.gtag('config', GA_ID, { page_path: pathname })
  }, [pathname])

  return null
}
