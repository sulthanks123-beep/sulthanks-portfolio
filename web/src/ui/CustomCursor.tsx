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
    let moved = false
    let magnets: HTMLElement[] = []
    let lastMode = ''
    const refreshMagnets = () => {
      magnets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'))
    }
    refreshMagnets()
    const magnetTimer = window.setInterval(refreshMagnets, 1500) // pick up buttons that mount later

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      moved = true
      setHidden(false)
      const t = e.target as Element | null
      const next = t?.closest('input, textarea, select, [contenteditable]')
        ? 'text'
        : t?.closest('.wk-line-btn')
          ? 'view'
          : t?.closest('a, button, [role="button"], label, .lead-chip')
            ? 'link'
            : 'idle'
      if (next !== lastMode) {
        lastMode = next
        setMode(next as typeof mode)
      }
    }
    const onLeave = () => setHidden(true)

    // magnetic pull: measured only when the pointer has moved (not every frame)
    const updateMagnets = () => {
      for (const el of magnets) {
        if (!el.isConnected) continue
        const r = el.getBoundingClientRect()
        const inside =
          pos.x > r.left - MAGNET_RANGE && pos.x < r.right + MAGNET_RANGE &&
          pos.y > r.top - MAGNET_RANGE && pos.y < r.bottom + MAGNET_RANGE
        const next = inside
          ? `${(pos.x - (r.left + r.width / 2)) * MAGNET_PULL}px ${(pos.y - (r.top + r.height / 2)) * MAGNET_PULL}px`
          : ''
        if (el.style.translate !== next) el.style.translate = next
      }
    }

    const tick = () => {
      const dx = pos.x - ringPos.x
      const dy = pos.y - ringPos.y
      const settling = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1
      if (moved || settling) {
        ringPos.x += dx * 0.18
        ringPos.y += dy * 0.18
        if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
        if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      }
      if (moved) {
        updateMagnets()
        moved = false
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(magnetTimer)
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
