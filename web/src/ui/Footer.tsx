import { useState } from 'react'
import { motion } from 'framer-motion'
import { CONTACT } from '../data/extras'
import { DubaiClock } from './Flair'
import { scrollToEl } from './smoothScroll'

const NAV = [
  { label: 'About', sel: '.hero' },
  { label: 'Résumé', sel: '.resume' },
  { label: 'Works', sel: '.works' },
  { label: 'Services', sel: '#services' },
  { label: 'Process', sel: '#process' },
  { label: 'Contact', sel: '#contact' },
]

const SOCIAL = [
  { label: 'LinkedIn', href: CONTACT.linkedin },
  { label: 'Instagram', href: CONTACT.instagram },
  { label: 'WhatsApp', href: CONTACT.whatsapp },
  { label: 'Google reviews', href: CONTACT.google },
]

const SERVICE_PAGES = [
  { label: 'Meta Ads in Dubai', href: 'meta-ads-dubai/' },
  { label: 'Google Ads in Dubai', href: 'google-ads-dubai/' },
  { label: 'WhatsApp leads in UAE', href: 'whatsapp-lead-generation-uae/' },
]

const go = (sel: string) => {
  const el = document.querySelector(sel)
  if (el) scrollToEl(el)
}

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${CONTACT.email}`
    }
  }

  return (
    <footer className="ft">
      <div className="ft-glow" aria-hidden="true" />

      <div className="ft-cta">
        <p className="ft-cta-line">Got a brand to grow?</p>
        <div className="ft-cta-actions">
          <a className="ft-btn ft-btn-main" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" data-magnetic>
            Message me on WhatsApp
          </a>
          <button type="button" className="ft-btn ft-btn-ghost" onClick={copyEmail} aria-live="polite">
            {copied ? 'Email copied' : 'Copy email'}
          </button>
        </div>
      </div>

      <div className="ft-cols">
        <nav className="ft-col" aria-label="Footer">
          <h3 className="ft-h">Explore</h3>
          <ul>
            {NAV.map((n) => (
              <li key={n.label}>
                <button type="button" className="ft-link" onClick={() => go(n.sel)}>
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ft-col">
          <h3 className="ft-h">Services</h3>
          <ul>
            {SERVICE_PAGES.map((s) => (
              <li key={s.href}>
                <a className="ft-link" href={`${import.meta.env.BASE_URL}${s.href}`}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="ft-col">
          <h3 className="ft-h">Connect</h3>
          <ul>
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a className="ft-link" href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a className="ft-link" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email.split('@')[0]}@<wbr />
                {CONTACT.email.split('@')[1]}
              </a>
            </li>
          </ul>
        </div>

        <div className="ft-col">
          <h3 className="ft-h">Based in</h3>
          <p className="ft-place">Dubai, UAE</p>
          <p className="ft-sub">From Kerala, India</p>
          <p className="ft-time">
            <DubaiClock />
          </p>
        </div>
      </div>

      <motion.div
        className="ft-sign"
        aria-hidden="true"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        Sulthan
      </motion.div>

      <div className="ft-bar">
        <span>© {new Date().getFullYear()} Sulthan K S · Performance marketer</span>
        <button type="button" className="ft-top" onClick={() => go('.hero')}>
          Back to top
        </button>
      </div>
    </footer>
  )
}
