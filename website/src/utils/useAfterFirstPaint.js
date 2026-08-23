import { useEffect, useState } from 'react'

/** True after the browser is idle so below-fold work does not fight LCP. */
export function useAfterFirstPaint(timeoutMs = 2200) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const start = () => setReady(true)
    if (typeof window.requestIdleCallback === 'function') {
      const idle = window.requestIdleCallback(start, { timeout: timeoutMs })
      return () => window.cancelIdleCallback(idle)
    }
    const timer = window.setTimeout(start, 350)
    return () => window.clearTimeout(timer)
  }, [timeoutMs])

  return ready
}
