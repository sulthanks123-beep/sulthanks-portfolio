import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Floating glass menu: appears after the hero, highlights the section in view,
// and scrolls smoothly to each one. Sections are found by selector, so the
// other components don't need ids.
const LINKS = [
  { label: 'About', sel: '.hero' },
  { label: 'Résumé', sel: '.resume' },
  { label: 'Works', sel: '.works' },
  { label: 'Services', sel: '#services' },
  { label: 'Process', sel: '#process' },
]

export default function FloatingNav() {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState('About')

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6)
      // active = last section whose top has passed 40% of the viewport
      const line = window.innerHeight * 0.4
      let current = LINKS[0].label
      for (const l of [...LINKS, { label: 'Contact', sel: '#contact' }]) {
        const el = document.querySelector(l.sel)
        if (el && el.getBoundingClientRect().top <= line) current = l.label
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const go = (sel: string) => {
    const el = document.querySelector(sel)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="fnav"
          aria-label="Sections"
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 24, x: '-50%' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <ul className="fnav-links">
            {LINKS.map((l) => (
              <li key={l.label}>
                <button
                  type="button"
                  className={`fnav-link${active === l.label ? ' is-active' : ''}`}
                  onClick={() => go(l.sel)}
                >
                  {active === l.label && (
                    <motion.span className="fnav-pill" layoutId="fnav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                  )}
                  <span className="fnav-text">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className={`fnav-cta${active === 'Contact' ? ' is-active' : ''}`} onClick={() => go('#contact')}>
            Let's talk
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
