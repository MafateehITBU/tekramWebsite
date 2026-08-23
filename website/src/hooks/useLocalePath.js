import { useCallback } from 'react'
import { useLanguage } from '../context/useLanguage.js'
import { localizedPath } from '../utils/localePaths.js'

/** @returns {(path: string) => string} */
export function useLocalePath() {
  const { locale } = useLanguage()
  return useCallback((path) => localizedPath(path, locale), [locale])
}
