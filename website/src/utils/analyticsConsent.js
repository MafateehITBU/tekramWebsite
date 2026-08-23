export const COOKIE_CONSENT_KEY = 'tikram-arabia-cookie-consent'
export const ANALYTICS_CONSENT_EVENT = 'tikram-analytics-consent'

/** @returns {boolean} */
export function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

/** @param {() => void} callback */
export function onAnalyticsConsent(callback) {
  window.addEventListener(ANALYTICS_CONSENT_EVENT, callback)
  return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, callback)
}

export function dispatchAnalyticsConsent() {
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT))
}

/** @param {string} eventName @param {Record<string, unknown>} [params] */
export function trackGaEvent(eventName, params = {}) {
  if (!hasAnalyticsConsent() || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}
