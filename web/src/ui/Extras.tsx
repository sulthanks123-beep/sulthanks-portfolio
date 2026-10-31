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
interface Lead {
  name: string
  business: string
  contact: string
  needs: string[]
  budget: string
  message: string
}

function whatsappText(l: Lead) {
  const lines = [
    `Hi Sulthan, I'm ${l.name}${l.business ? ` from ${l.business}` : ''}. I found you through your portfolio.`,
    '',
    l.needs.length ? `I need help with: ${l.needs.join(', ')}` : null,
    l.budget ? `Monthly ad budget: ${l.budget}` : null,
    `Reach me at: ${l.contact}`,
    l.message ? ['', l.message].join('\n') : null,
  ]
  return lines.filter((x) => x !== null).join('\n')
}

// Inline text field that sits inside the sentence and grows with what's typed
function Blank({
  value,
  onChange,
  placeholder,
  label,
  required,
  type = 'text',
  autoComplete,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  label: string
  required?: boolean
  type?: string
  autoComplete?: string
}) {
  return (
    <span className="lead-blank" data-value={value || placeholder}>
      <input
        aria-label={label}
        size={1}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </span>
  )
}

function Chip({ on, children, onClick }: { on: boolean; children: string; onClick: () => void }) {
  return (
    <button type="button" className={`lead-chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onClick}>
      {on && <Star className="lead-chip-star" />}
      {children}
    </button>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="lead-wa">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"
      />
    </svg>
  )
}

function Contact() {
  const [lead, setLead] = useState<Lead>({ name: '', business: '', contact: '', needs: [], budget: '', message: '' })
  const [sent, setSent] = useState(false)
  const set = (k: keyof Lead) => (v: string) => setLead((l) => ({ ...l, [k]: v }))
  const toggleNeed = (n: string) =>
    setLead((l) => ({ ...l, needs: l.needs.includes(n) ? l.needs.filter((x) => x !== n) : [...l.needs, n] }))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const url = `${CONTACT.whatsapp}?text=${encodeURIComponent(whatsappText(lead))}`
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
          <span className="lead-status">
            <span className="lead-dot" aria-hidden="true" />
            Taking new projects
          </span>
          <p className="ex-contact-lead">
            Fill in the message, pick what you need, and it lands straight in my WhatsApp. I usually reply within a day.
          </p>
          <ol className="lead-next" aria-label="What happens next">
            <li>
              <span>1</span>You send the message on WhatsApp
            </li>
            <li>
              <span>2</span>I reply within a day with a few questions
            </li>
            <li>
              <span>3</span>We plan your first campaign together
            </li>
          </ol>
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

        <motion.form className="lead glass" name="contact" onSubmit={onSubmit} onPointerMove={spot} {...reveal}>
          <p className="lead-line">
            Hey Sulthan, I'm{' '}
            <Blank value={lead.name} onChange={set('name')} placeholder="your name" label="Your name" required autoComplete="name" />{' '}
            from{' '}
            <Blank value={lead.business} onChange={set('business')} placeholder="brand or website" label="Business" autoComplete="organization" />.
          </p>

          <div className="lead-group">
            <span className="lead-q">I need help with</span>
            <div className="lead-chips">
              {CONTACT.needs.map((n) => (
                <Chip key={n} on={lead.needs.includes(n)} onClick={() => toggleNeed(n)}>
                  {n}
                </Chip>
              ))}
            </div>
          </div>

          <div className="lead-group">
            <span className="lead-q">My monthly ad budget is</span>
            <div className="lead-chips">
              {CONTACT.budgets.map((b) => (
                <Chip key={b} on={lead.budget === b} onClick={() => set('budget')(lead.budget === b ? '' : b)}>
                  {b}
                </Chip>
              ))}
            </div>
          </div>

          <p className="lead-line">
            Reach me at{' '}
            <Blank value={lead.contact} onChange={set('contact')} placeholder="email or WhatsApp" label="Email or WhatsApp" required autoComplete="email" />
          </p>

          <label className="lead-note">
            <span className="lead-q">Anything else?</span>
            <textarea
              rows={3}
              value={lead.message}
              placeholder="Goals, timeline, links… (optional)"
              onChange={(e) => set('message')(e.target.value)}
            />
          </label>

          <div className="lead-send">
            <button className="lead-btn" type="submit">
              <WhatsAppIcon />
              Send on WhatsApp
            </button>
            <p className={`lead-hint${sent ? ' is-ok' : ''}`} role="status">
              {sent ? 'WhatsApp opened with your message. Press send there and I’ll reply soon.' : 'Opens WhatsApp with your message ready to send.'}
            </p>
          </div>
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
