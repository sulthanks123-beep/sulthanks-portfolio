import { useState, type FormEvent, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { STATS, SERVICES, STEPS, CREATIVES, TESTIMONIALS, CONTACT } from '../data/extras'

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

function Heading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.header className="ex-head" {...reveal}>
      <span className="ex-kicker">{kicker}</span>
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
      <Heading kicker="Services" title="How I can help" />
      <div className="ex-grid ex-grid-services">
        {SERVICES.map((s, i) => (
          <motion.article key={s.title} className="ex-card glass" onPointerMove={spot} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }}>
            <span className="ex-card-no">{String(i + 1).padStart(2, '0')}</span>
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
      <Heading kicker="Process" title="How I work" />
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
      <Heading kicker="Creatives" title="Ads I've made" />
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
      <Heading kicker="Testimonials" title="What clients say" />
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

// Netlify Forms: the static twin of this form lives in index.html so Netlify can detect it.
function encode(data: FormData) {
  const p = new URLSearchParams()
  data.forEach((v, k) => p.append(k, String(v)))
  return p.toString()
}

function Contact() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setState('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(new FormData(form)),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setState('sent')
    } catch {
      setState('error')
    }
  }

  return (
    <section className="ex-section ex-contact" id="contact">
      <Heading kicker="Contact" title="Let's grow your brand" />
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
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={onSubmit}
          {...reveal}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="ex-hp" aria-hidden="true">
            <label>
              Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
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
          <button className="ex-btn ex-btn-primary ex-field-wide" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {state === 'sent' && <p className="ex-form-note is-ok ex-field-wide">Thanks! I'll get back to you soon.</p>}
          {state === 'error' && (
            <p className="ex-form-note is-err ex-field-wide">
              That didn't go through. Please{' '}
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                message me on WhatsApp
              </a>{' '}
              or email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>
          )}
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
      <Contact />
      <Footer />
    </div>
  )
}
