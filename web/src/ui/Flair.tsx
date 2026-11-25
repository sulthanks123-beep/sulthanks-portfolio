import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { scrollToEl } from './smoothScroll'

const S_IMG = `${import.meta.env.BASE_URL}images/chrome-s.webp`

// Round sticker: text spins around the chrome S; clicking it jumps to the contact form
export function SpinBadge() {
  const text = 'Available for projects ✦ Performance marketer ✦ Dubai ✦ '
  return (
    <button
      type="button"
      className="spin-badge"
      data-magnetic
      aria-label="Available for projects, go to contact"
      onClick={() => {
        const el = document.querySelector('#contact')
        if (el) scrollToEl(el)
      }}
    >
      <svg className="spin-ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="spin-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href="#spin-circle" textLength="488">
            {text}
          </textPath>
        </text>
      </svg>
      <img className="spin-s" src={S_IMG} alt="" />
    </button>
  )
}

// Live local time in Dubai, e.g. "Dubai · 6:01 PM"
export function DubaiClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', minute: '2-digit' }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 10_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="dubai-clock">
      <span className="dubai-dot" aria-hidden="true" />
      Dubai · {time}
    </span>
  )
}

// Text that scrambles through random characters on hover, then settles back
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦#%&'
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [out, setOut] = useState(text)
  const timer = useRef<number | null>(null)
  const run = () => {
    if (timer.current) return
    let frame = 0
    const total = text.length * 3
    timer.current = window.setInterval(() => {
      frame++
      setOut(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || i < frame / 3 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      )
      if (frame >= total) {
        clearInterval(timer.current!)
        timer.current = null
        setOut(text)
      }
    }, 28)
  }
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])
  return (
    <span className={className} onPointerEnter={run} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

// Headline whose letters flip up in 3D one after another, like a departure board, when it
// scrolls into view. The heading is what's watched; it passes "show" down to each letter.
const letterV = {
  hidden: { rotateX: -95, y: '40%', opacity: 0 },
  show: (i: number) => ({
    rotateX: 0,
    y: '0%',
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.028 },
  }),
}

export function RevealText({ text, as = 'h2', className }: { text: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag
      className={className}
      aria-label={text}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-8% 0px' }}
    >
      {words.map((w, i) => {
        const start = words.slice(0, i).join('').length + i // letter index where this word starts
        return (
          <Fragment key={i}>
            <span className="rv-flip-word" aria-hidden="true">
              {Array.from(w).map((ch, k) => (
                <motion.span key={k} className="rv-letter" variants={letterV} custom={start + k}>
                  {ch}
                </motion.span>
              ))}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        )
      })}
    </Tag>
  )
}
