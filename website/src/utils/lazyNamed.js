import { lazy } from 'react'

/**
 * Lazy-load a named export. Guards against the previous production crash
 * (React #306 from an undefined default export).
 * @param {() => Promise<Record<string, unknown>>} loader
 * @param {string} exportName
 */
export function lazyNamed(loader, exportName) {
  return lazy(() =>
    loader().then((mod) => {
      const Cmp = mod[exportName]
      if (typeof Cmp !== 'function') {
        throw new Error(`lazyNamed: missing export ${exportName}`)
      }
      return { default: Cmp }
    }),
  )
}
