/** Optical offset below flex center (image has extra space above the hand) */
const VERTICAL_OFFSET =
  'translate-y-10 sm:translate-y-12 md:translate-y-14 lg:translate-y-16'

/**
 * Decorative hand as a CSS background (not an <img>) so it cannot become LCP.
 */
export function DecorHand({ isRtl }) {
  return (
    <div
      className={`pointer-events-none fixed inset-y-0 z-[3] hidden items-center md:flex ${
        isRtl ? 'right-0 justify-end' : 'left-0 justify-start'
      }`}
      aria-hidden
    >
      <div
        className={`decor-hand block h-[min(78vw,40rem)] w-[min(78vw,40rem)] max-h-[92dvh] max-w-none bg-contain bg-center bg-no-repeat sm:h-[min(68vw,44rem)] sm:w-[min(68vw,44rem)] lg:h-[min(58vw,52rem)] lg:w-[min(58vw,52rem)] ${VERTICAL_OFFSET} ${
          isRtl ? '-scale-x-100' : ''
        }`}
      />
    </div>
  )
}
