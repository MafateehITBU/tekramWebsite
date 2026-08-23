/** Optical offset below flex center (image has extra space above the hand) */
const VERTICAL_OFFSET =
  'translate-y-10 sm:translate-y-12 md:translate-y-14 lg:translate-y-16'

/**
 * Decorative hand — fixed in the viewport; stays put while scrolling.
 * Solid sections (section-solid) cover it when they pass over.
 * Public URLs so index.html can preload the LCP image before JS.
 */
export function DecorHand({ isRtl }) {
  return (
    <div
      className={`pointer-events-none fixed inset-y-0 z-[3] flex items-center ${
        isRtl ? 'right-0 justify-end' : 'left-0 justify-start'
      }`}
      aria-hidden
    >
      <img
        src="/hand.webp"
        srcSet="/hand-sm.webp 720w, /hand.webp 1600w"
        sizes="(max-width: 768px) 78vw, min(58vw, 52rem)"
        alt=""
        className={`block w-[min(78vw,40rem)] max-h-[92dvh] max-w-none select-none object-contain ${VERTICAL_OFFSET} sm:w-[min(68vw,44rem)] lg:w-[min(58vw,52rem)] ${
          isRtl ? '-scale-x-100' : ''
        }`}
        width={832}
        height={832}
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  )
}
