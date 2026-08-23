import { useEffect, useState } from 'react'
import { LocalizedLink } from '../common/LocalizedLink.jsx'
import { useLanguage } from '../../context/useLanguage.js'
import { dispatchAnalyticsConsent, COOKIE_CONSENT_KEY } from '../../utils/analyticsConsent.js'

const COPY = {
  en: {
    message:
      'We use essential cookies and optional analytics to improve your experience. See our Privacy Policy.',
    accept: 'Accept',
    privacy: 'Privacy Policy',
  },
  ar: {
    message:
      'نستخدم cookies أساسية وتحليلات اختيارية لتحسين تجربتك. راجع سياسة الخصوصية.',
    accept: 'موافق',
    privacy: 'سياسة الخصوصية',
  },
}

export function CookieConsent() {
  const { locale } = useLanguage()
  const copy = COPY[locale]
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(COOKIE_CONSENT_KEY) !== 'accepted') setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-line bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-live="polite"
      aria-label={locale === 'ar' ? 'موافقة cookies' : 'Cookie consent'}
    >
      <div className="site-container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm leading-relaxed text-foreground/90">
          {copy.message}{' '}
          <LocalizedLink to="/privacy-policy" className="font-semibold text-primary underline">
            {copy.privacy}
          </LocalizedLink>
        </p>
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white"
          onClick={() => {
            try {
              localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
            } catch {
              /* ignore */
            }
            dispatchAnalyticsConsent()
            setVisible(false)
          }}
        >
          {copy.accept}
        </button>
      </div>
    </div>
  )
}
