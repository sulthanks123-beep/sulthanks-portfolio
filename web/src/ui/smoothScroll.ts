import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Inertia scrolling for mouse wheels and trackpads. Touch scrolling stays native
// (Lenis leaves touch alone by default), so phones feel exactly as before.
let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
  const raf = (t: number) => {
    lenis?.raf(t)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

// Smooth jump to an element (falls back to native smooth scroll)
export function scrollToEl(el: Element) {
  const top = el.getBoundingClientRect().top + window.scrollY
  if (lenis) lenis.scrollTo(top, { duration: 1.4 })
  else window.scrollTo({ top, behavior: 'smooth' })
}

// Pause while a full-screen sheet is open, so only the sheet scrolls
export function pauseSmoothScroll(paused: boolean) {
  if (!lenis) return
  if (paused) lenis.stop()
  else lenis.start()
}
