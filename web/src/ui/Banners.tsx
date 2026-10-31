import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

// Four-point chrome-style star, used as the separator in the banners and as the service icon
export function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="star-chrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe6ff" />
          <stop offset="0.45" stopColor="#9b74ff" />
          <stop offset="1" stopColor="#5a2be0" />
        </linearGradient>
      </defs>
      <path
        d="M24 1c1.6 11.3 7.4 17.4 23 23-15.6 5.6-21.4 11.7-23 23-1.6-11.3-7.4-17.4-23-23C16.6 18.4 22.4 12.3 24 1z"
        fill="url(#star-chrome)"
      />
    </svg>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

// One endless row. Drifts on its own and speeds up while the page is being scrolled.
function Track({ items, speed, className }: { items: string[]; speed: number; className: string }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-2000, 0, 2000], [4, 0, 4], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const move = speed * (delta / 1000)
    base.set(base.get() + move + move * Math.abs(boost.get()))
  })

  // the row is rendered twice so wrapping at -50% is seamless
  const row = [...items, ...items, ...items]
  return (
    <div className={`bn-band ${className}`}>
      <motion.div className="bn-track" style={{ x }}>
        {[0, 1].map((half) => (
          <div className="bn-row" key={half} aria-hidden={half === 1}>
            {row.map((t, i) => (
              <span className="bn-item" key={i}>
                {t}
                <Star className="bn-star" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const SERVICES = ['Meta Ads', 'Google Ads', 'WhatsApp leads', 'E-commerce growth', 'Brand & content']
const RESULTS = ['₹6.5M in sales', '35.9M impressions', '14.4% search CTR', '20+ brands', 'Dubai · Kerala']

// Two slanted bands that cross and run in opposite directions
export function TiltedBands() {
  return (
    <section className="bn-cross" aria-label="Services and results">
      <Track items={RESULTS} speed={2.2} className="bn-band-b" />
      <Track items={SERVICES} speed={-2.8} className="bn-band-a" />
    </section>
  )
}

// Oversized line of type that slides sideways as the section passes through the screen
export function ScrollBanner({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x1 = useTransform(scrollYProgress, [0, 1], ['4%', '-46%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-46%', '4%'])
  const words = Array.from({ length: 4 }, () => text)
  return (
    <section className="bn-scroll" ref={ref} aria-label={text}>
      <motion.div className="bn-scroll-line is-solid" style={{ x: x1 }} aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            {w}
            <Star className="bn-scroll-star" />
          </span>
        ))}
      </motion.div>
      <motion.div className="bn-scroll-line is-outline" style={{ x: x2 }} aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            {w}
            <Star className="bn-scroll-star" />
          </span>
        ))}
      </motion.div>
    </section>
  )
}
