import { useState, type FormEvent, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { STATS, SERVICES, STEPS, CREATIVES, TESTIMONIALS, CONTACT } from '../data/extras'
import { Star, TiltedBands, ScrollBanner } from './Banners'

// Sections below Works: numbers, services, process, creatives, testimonials, contact.
// Content lives in data/extras.ts.

const EASE = [0.22, 1, 0.36, 1]
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.7, ease: EASE },
}
const BASE = import.meta.env.BASE_URL

// Glass cards get a soft light that follows the pointer (CSS vars read by .glass::before)
function spot(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function Heading({ title }: { title: string }) {
  return (
    <motion.header className="ex-head" {...reveal}>
      <h2 className="ex-title">{title}</h2>
    </motion.header>
  )
}

function Stats() {
  return (
    <section className="ex-section ex-stats" aria-label="Results">
      {STATS.map((s, i) => (
        <motion.div key={s.label} className="ex-stat glass" onPointerMove={spot} style={{ animationDelay: `${i * -1.4}s` }} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
          <span className="ex-stat-value">{s.value}</span>
          <span className="ex-stat-label">{s.label}</span>
        </motion.div>
      ))}
    </section>
  )
}

function Services() {
  return (
    <section className="ex-section" id="services">
      <Heading title="How I can help" />
      <div className="ex-grid ex-grid-services">
        {SERVICES.map((s, i) => (
          <motion.article key={s.title} className="ex-card glass" onPointerMove={spot} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }}>
            <Star className="ex-card-icon" />
            <h3 className="ex-card-title">{s.title}</h3>
            <p className="ex-card-body">{s.body}</p>
            <ul className="ex-card-points">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="ex-section" id="process">
      <Heading title="How I work" />
      <ol className="ex-steps">
        {STEPS.map((s, i) => (
          <motion.li key={s.title} className="ex-step glass" onPointerMove={spot} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
            <span className="ex-step-no">{i + 1}</span>
            <h3 className="ex-step-title">{s.title}</h3>
            <p className="ex-step-body">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

function Creatives() {
  if (CREATIVES.length === 0) return null
  return (
    <section className="ex-section" id="creatives">
      <Heading title="Ads I've made" />
      <div className={`ex-grid ex-grid-creatives${CREATIVES.length === 1 ? ' is-single' : ''}`}>
        {CREATIVES.map((c) => (
          <motion.figure key={c.src} className="ex-creative" {...reveal}>
            {c.video ? (
              <video src={BASE + c.src} autoPlay muted loop playsInline aria-label={c.alt} />
            ) : (
              <img src={BASE + c.src} alt={c.alt} loading="lazy" />
            )}
            <figcaption>{c.caption}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  if (TESTIMONIALS.length === 0) return null
  return (
    <section className="ex-section" id="testimonials">
      <Heading title="What clients say" />
      <div className="ex-grid ex-grid-quotes">
        {TESTIMONIALS.map((t) => (
          <motion.blockquote key={t.name} className="ex-quote glass" onPointerMove={spot} {...reveal}>
            <p>“{t.quote}”</p>
            <footer>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  )
}

// The form doesn't post anywhere: it opens WhatsApp with the visitor's details typed in,
// addressed to CONTACT.whatsapp, and the visitor presses send there.
function whatsappText(data: FormData) {
  const v = (k: string) => String(data.get(k) || '').trim()
  const lines = [
    `Hi Sulthan, I found you through your portfolio.`,
    '',
    `Name: ${v('name')}`,
    `Contact: ${v('contact')}`,
    v('business') ? `Business: ${v('business')}` : null,
    v('budget') ? `Monthly ad budget: ${v('budget')}` : null,
    '',
    v('message'),
  ]
  return lines.filter((l) => l !== null).join('\n')
}

function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const url = `${CONTACT.whatsapp}?text=${encodeURIComponent(whatsappText(new FormData(e.currentTarget)))}`
    // open straight from the click so browsers don't block it; fall back to same-tab
    const win = window.open(url, '_blank')
    if (win) win.opener = null
    else window.location.href = url
    setSent(true)
  }

  return (
    <section className="ex-section ex-contact" id="contact">
      <Heading title="Start a project" />
      <div className="ex-contact-grid">
        <motion.div className="ex-contact-side glass" onPointerMove={spot} {...reveal}>
          <p className="ex-contact-lead">
            Tell me about your business and what you want to grow. I usually reply within a day.
          </p>
          <a className="ex-btn ex-btn-primary" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
          <ul className="ex-contact-links">
            <li>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <a href={CONTACT.phone}>{CONTACT.phoneLabel}</a>
            </li>
            <li>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                {CONTACT.whatsappLabel}
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.form
          className="ex-form glass"
          onPointerMove={spot}
          name="contact"
          onSubmit={onSubmit}
          {...reveal}
        >
          <label className="ex-field">
            <span>Name</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label className="ex-field">
            <span>Email or WhatsApp</span>
            <input name="contact" required autoComplete="email" />
          </label>
          <label className="ex-field">
            <span>Business</span>
            <input name="business" placeholder="Brand name or website" />
          </label>
          <label className="ex-field">
            <span>Monthly ad budget</span>
            <select name="budget" defaultValue="">
              <option value="" disabled>
                Choose one
              </option>
              {CONTACT.budgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="ex-field ex-field-wide">
            <span>What do you need?</span>
            <textarea name="message" rows={4} required />
          </label>
          <button className="ex-btn ex-btn-primary ex-field-wide" type="submit">
            Send on WhatsApp
          </button>
          <p className={`ex-form-note ex-field-wide${sent ? ' is-ok' : ''}`}>
            {sent
              ? 'WhatsApp opened with your message. Press send there and I’ll reply soon.'
              : 'This opens WhatsApp with your details filled in. Just press send.'}
          </p>
        </motion.form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="ex-footer">
      <span>© {new Date().getFullYear()} Sulthan K S · Performance Marketer · Dubai</span>
      <span className="ex-footer-links">
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href={`mailto:${CONTACT.email}`}>Email</a>
      </span>
    </footer>
  )
}

export default function Extras() {
  return (
    <div className="extras">
      <TiltedBands />
      <div className="ex-orbs" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <Stats />
      <Services />
      <Process />
      <Creatives />
      <Testimonials />
      <ScrollBanner text="Let's grow your brand" />
      <Contact />
      <Footer />
    </div>
  )
}
