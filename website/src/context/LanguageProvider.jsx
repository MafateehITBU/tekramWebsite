import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LanguageContext } from './languageContext.js'
import {
  localeFromPathname,
  switchLocalePath,
} from '../utils/localePaths.js'

const STORAGE_KEY = 'tikram-arabia-locale'
const LOCALE_FADE_MS = 280

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function LanguageProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const locale = localeFromPathname(location.pathname)
  const [contentVisible, setContentVisible] = useState(true)
  const timeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null))

  useLayoutEffect(() => {
    const root = document.documentElement
    root.lang = locale === 'ar' ? 'ar' : 'en'
    root.dir = locale === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  useEffect(() => {
    const root = document.documentElement
    const frame = requestAnimationFrame(() => {
      root.classList.add('locale-transition')
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    [],
  )

  const navigateToLocale = useCallback(
    /** @param {'en' | 'ar'} targetLocale */
    (targetLocale, { animate = false } = {}) => {
      const nextPath =
        switchLocalePath(location.pathname, targetLocale) +
        location.search +
        location.hash

      if (!animate || prefersReducedMotion()) {
        navigate(nextPath)
        setContentVisible(true)
        return
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setContentVisible(false)
      timeoutRef.current = setTimeout(() => {
        navigate(nextPath)
        requestAnimationFrame(() => {
          setContentVisible(true)
        })
      }, LOCALE_FADE_MS)
    },
    [location.hash, location.pathname, location.search, navigate],
  )

  const setLocale = useCallback(
    /** @param {'en' | 'ar' | ((prev: 'en' | 'ar') => 'en' | 'ar')} next */
    (next) => {
      const resolved = typeof next === 'function' ? next(locale) : next
      if (resolved !== 'en' && resolved !== 'ar') return
      if (resolved === locale) return
      navigateToLocale(resolved, { animate: true })
    },
    [locale, navigateToLocale],
  )

  const toggleLocale = useCallback(() => {
    navigateToLocale(locale === 'ar' ? 'en' : 'ar', { animate: true })
  }, [locale, navigateToLocale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      isLocaleSwitching: !contentVisible,
    }),
    [locale, setLocale, toggleLocale, contentVisible],
  )

  return (
    <LanguageContext.Provider value={value}>
      <div
        className={[
          'locale-transition-root flex min-h-dvh flex-col',
          contentVisible ? 'locale-transition-root--visible' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  )
}
