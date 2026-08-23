import { useEffect, useState } from 'react'

/**
 * True after a minimum delay. Do not use requestIdleCallback here — it can
 * fire immediately and let late UI steal mobile LCP.
 */
export function useAfterFirstPaint(minMs = 4000) {
  const [ready, setReady] = useState(minMs <= 0)

  useEffect(() => {
    if (minMs <= 0) return undefined
    const timer = window.setTimeout(() => setReady(true), minMs)
    return () => window.clearTimeout(timer)
  }, [minMs])

  return ready
}

export function isNarrowViewport() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}
