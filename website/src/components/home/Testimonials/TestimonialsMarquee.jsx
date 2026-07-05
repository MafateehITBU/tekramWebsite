import { useEffect, useState } from 'react'
import { InfiniteMarquee } from '../../common/InfiniteMarquee.jsx'
import { TestimonialCard } from './TestimonialCard.jsx'
import { TestimonialCardSkeleton } from './TestimonialCardSkeleton.jsx'

const SKELETON_COUNT = 6

/** Faster scroll on narrow viewports so motion is obvious on mobile. */
function useMarqueeDuration(desktopSeconds, mobileSeconds) {
  const [duration, setDuration] = useState(desktopSeconds)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setDuration(mq.matches ? mobileSeconds : desktopSeconds)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [desktopSeconds, mobileSeconds])

  return duration
}

/**
 * @param {Array<Record<string, unknown>>} testimonials
 */
function buildMarqueeSequence(testimonials) {
  if (testimonials.length === 0) return []
  const minItems = 6
  let expanded = [...testimonials]
  while (expanded.length < minItems) {
    expanded = [...expanded, ...testimonials]
  }
  return expanded
}

/**
 * @param {{
 *   testimonials: Array<Record<string, unknown>>,
 *   locale: 'en' | 'ar',
 *   skeleton?: boolean,
 * }} props
 */
export function TestimonialsMarquee({ testimonials, locale, skeleton = false }) {
  const duration = useMarqueeDuration(50, 28)

  if (skeleton) {
    return (
      <InfiniteMarquee
        className="testimonials-marquee mt-10 min-h-[14rem] sm:mt-12 sm:min-h-[15rem]"
        groupClassName="flex shrink-0 items-stretch gap-4 sm:gap-5"
        duration={duration}
        direction="rtl"
      >
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <TestimonialCardSkeleton key={`skeleton-${index}`} />
        ))}
      </InfiniteMarquee>
    )
  }

  const sequence = buildMarqueeSequence(testimonials)
  if (sequence.length === 0) return null

  return (
    <InfiniteMarquee
      className="testimonials-marquee mt-10 min-h-[14rem] sm:mt-12 sm:min-h-[15rem]"
      groupClassName="flex shrink-0 items-stretch gap-4 sm:gap-5"
      duration={duration}
      direction="rtl"
    >
      {sequence.map((item, index) => (
        <TestimonialCard
          key={`${String(item.id)}-${index}`}
          item={item}
          locale={locale}
        />
      ))}
    </InfiniteMarquee>
  )
}
