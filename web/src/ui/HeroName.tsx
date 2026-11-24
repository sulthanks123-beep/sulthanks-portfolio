import { useEffect, useRef } from 'react'
import { useStore } from '../store'

// The giant "sulthan" at the foot of the hero. It sits between the light beams and the
// 3D canvas, so the character stands in front of it. Mona Sans is variable in width and
// weight: on load the letters grow from thin and narrow to wide and black one by one,
// and on desktop the letters near the cursor slim down as it passes.
const LETTERS = 'sulthan'.split('')
const WIDE = { w: 125, g: 900 }
const THIN = { w: 75, g: 200 }

export default function HeroName() {
  const ref = useRef<HTMLDivElement>(null)
  const entered = useStore((s) => s.entered)
  const startIntro = useRef<() => void>(() => {})

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const letters = Array.from(el.children) as HTMLElement[]
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const cur = letters.map(() => ({ ...WIDE }))
    const tgt = letters.map(() => ({ ...WIDE }))
    const paint = (i: number, w: number, g: number) => {
      letters[i].style.fontVariationSettings = `"wdth" ${w.toFixed(1)}, "wght" ${g.toFixed(0)}`
    }

    // size the word so it runs edge to edge at its widest, heaviest setting
    const fit = () => {
      letters.forEach((_, i) => paint(i, WIDE.w, WIDE.g))
      el.style.fontSize = '100px'
      const w = el.getBoundingClientRect().width
      el.style.fontSize = `${((100 * document.documentElement.clientWidth * 0.985) / w).toFixed(2)}px`
      letters.forEach((_, i) => paint(i, cur[i].w, cur[i].g))
    }

    let mouseX: number | null = null
    let introUntil = 0
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.25, (now - last) / 1000) // seconds, capped so a stall doesn't jump
      last = now
      if (window.scrollY > window.innerHeight * 1.1) return // off screen: do nothing
      if (now > introUntil) {
        letters.forEach((l, i) => {
          if (mouseX === null) {
            tgt[i] = { ...WIDE }
            return
          }
          const r = l.getBoundingClientRect()
          const k = Math.max(0, 1 - (Math.abs(mouseX - (r.left + r.width / 2)) / window.innerWidth) * 4.2)
          tgt[i] = { w: WIDE.w - k * 50, g: WIDE.g - k * 650 }
        })
      }
      const ease = 1 - Math.exp(-dt * (now > introUntil ? 7 : 3.6)) // time-based, same speed at any frame rate
      letters.forEach((_, i) => {
        const dw = tgt[i].w - cur[i].w
        const dg = tgt[i].g - cur[i].g
        if (Math.abs(dw) < 0.05 && Math.abs(dg) < 0.5) return // settled
        cur[i].w += dw * ease
        cur[i].g += dg * ease
        paint(i, cur[i].w, cur[i].g)
      })
    }

    startIntro.current = () => {
      if (calm) return
      letters.forEach((_, i) => {
        cur[i] = { ...THIN }
        tgt[i] = { ...THIN }
        paint(i, THIN.w, THIN.g)
      })
      introUntil = performance.now() + 2400
      letters.forEach((_, i) => setTimeout(() => (tgt[i] = { ...WIDE }), 150 + i * 110))
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') mouseX = e.clientX
    }
    const onLeave = () => (mouseX = null)
    if (!calm) {
      if (fine) {
        window.addEventListener('pointermove', onMove)
        document.addEventListener('pointerleave', onLeave)
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('resize', fit)
    document.fonts.load('900 100px "Mona Sans"').then(fit, fit)
    fit()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', fit)
    }
  }, [])

  // play the grow-in once the loading screen starts to fade
  useEffect(() => {
    if (entered) startIntro.current()
  }, [entered])

  return (
    <div className="hero-name" ref={ref} aria-hidden="true">
      {LETTERS.map((c, i) => (
        <span key={i}>{c}</span>
      ))}
    </div>
  )
}
