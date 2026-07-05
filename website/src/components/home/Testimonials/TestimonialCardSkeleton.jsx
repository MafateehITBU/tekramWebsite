/** Placeholder card while testimonials load — keeps marquee scrolling immediately. */
export function TestimonialCardSkeleton() {
  return (
    <article
      aria-hidden
      className="flex w-[min(100%,22rem)] shrink-0 animate-pulse flex-col rounded-xl border border-primary/40 bg-card px-5 py-5 sm:w-[26rem] lg:w-[25rem] sm:px-6 sm:py-6"
    >
      <div className="h-9 w-9 shrink-0 rounded bg-foreground/10" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-foreground/10" />
        <div className="h-3 w-[85%] rounded bg-foreground/10" />
        <div className="h-3 w-[65%] rounded bg-foreground/10" />
      </div>
      <div className="mt-5 flex items-center gap-3 sm:mt-6">
        <div className="h-12 w-12 shrink-0 rounded-full bg-foreground/10 sm:h-14 sm:w-14" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-28 rounded bg-foreground/10" />
          <div className="h-3 w-20 rounded bg-foreground/10" />
        </div>
      </div>
    </article>
  )
}
