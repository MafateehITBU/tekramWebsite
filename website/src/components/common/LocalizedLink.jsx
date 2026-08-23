import { Link } from 'react-router-dom'
import { useLocalePath } from '../../hooks/useLocalePath.js'

/**
 * react-router Link with the current locale prefix (/ar when Arabic).
 * @param {import('react-router-dom').LinkProps} props
 */
export function LocalizedLink({ to, ...props }) {
  const localePath = useLocalePath()
  const resolved = typeof to === 'string' ? localePath(to) : to
  return <Link to={resolved} {...props} />
}
