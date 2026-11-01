import { useEffect, useRef, useState } from 'react'

// Desktop-only cursor: a small purple dot that tracks the mouse exactly, and a ring that
// trails behind it. Over links/buttons the ring grows; over a project row it becomes a
// "View" bubble. Elements marked [data-magnetic] lean toward the pointer when it's close.
// Touch devices and reduced-motion users keep the normal cursor.
const MAGNET_RANGE = 90 // px around the element where the pull starts
const MAGNET_PULL = 0.32 // share of the pointer offset the element follows

export default function CustomCursor() {
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'idle' | 'link' | 'view' | 'text'>('idle')
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf = 0

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      setHidden(false)
      const t = e.target as Element | null
      if (t?.closest('input, textarea, select, [contenteditable]')) setMode('text')
      else if (t?.closest('.wk-line-btn')) setMode('view')
      else if (t?.closest('a, button, [role="button"], label, .lead-chip')) setMode('link')
      else setMode('idle')
    }
    const onLeave = () => setHidden(true)

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`

      // magnetic elements
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = pos.x - cx
        const dy = pos.y - cy
        const inside =
          pos.x > r.left - MAGNET_RANGE && pos.x < r.right + MAGNET_RANGE &&
          pos.y > r.top - MAGNET_RANGE && pos.y < r.bottom + MAGNET_RANGE
        el.style.translate = inside ? `${dx * MAGNET_PULL}px ${dy * MAGNET_PULL}px` : '0px 0px'
      })
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className={`cur-ring is-${mode}${hidden ? ' is-hidden' : ''}`} aria-hidden="true">
        <span className="cur-label">View</span>
      </div>
      <div ref={dot} className={`cur-dot is-${mode}${hidden ? ' is-hidden' : ''}`} aria-hidden="true" />
    </>
  )
}
