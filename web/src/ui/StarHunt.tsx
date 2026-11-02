import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { create } from 'zustand'
import { CONTACT } from '../data/extras'
import { Star } from './Banners'

// Star hunt: five small chrome stars are hidden around the page. Clicking one collects it;
// the counter in the floating menu shows progress; all five unlock a reward card.
// Progress is remembered in this browser (localStorage, best-effort).
export const STAR_IDS = ['resume', 'works', 'calc', 'process', 'footer'] as const
export type StarId = (typeof STAR_IDS)[number]

// Change the reward here
export const REWARD = {
  title: 'You found all 5 stars ✦',
  body: 'Nice eyes. That kind of attention to detail is how good ads get made. Your reward: a free 15-minute ad audit.',
  cta: 'Claim my free ad audit',
  message: 'Hi Sulthan, I found all 5 stars on your portfolio 👀 I’d like to claim my free 15-minute ad audit.',
}

const KEY = 'star-hunt-v1'
const load = (): StarId[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v.filter((x) => (STAR_IDS as readonly string[]).includes(x)) : []
  } catch {
    return []
  }
}

interface HuntState {
  found: StarId[]
  toast: string | null
  rewardOpen: boolean
  collect: (id: StarId) => void
  showHint: () => void
  closeReward: () => void
  openReward: () => void
}

let toastTimer: number | undefined
export const useHunt = create<HuntState>((set, get) => ({
  found: load(),
  toast: null,
  rewardOpen: false,
  collect: (id) => {
    if (get().found.includes(id)) return
    const found = [...get().found, id]
    try {
      localStorage.setItem(KEY, JSON.stringify(found))
    } catch {
      /* private mode: progress just isn't saved */
    }
    const done = found.length === STAR_IDS.length
    set({ found, toast: done ? null : `✦ ${found.length} of ${STAR_IDS.length} stars found` })
    window.clearTimeout(toastTimer)
    if (done) window.setTimeout(() => set({ rewardOpen: true }), 650)
    else toastTimer = window.setTimeout(() => set({ toast: null }), 2600)
  },
  showHint: () => {
    const n = get().found.length
    if (n === STAR_IDS.length) return set({ rewardOpen: true })
    set({ toast: `${STAR_IDS.length} chrome stars are hidden on this page. Find them all for a reward. (${n}/${STAR_IDS.length})` })
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => set({ toast: null }), 4200)
  },
  closeReward: () => set({ rewardOpen: false }),
  openReward: () => set({ rewardOpen: true }),
}))

// A collectable star. Place it anywhere; it hides itself once found.
export function HiddenStar({ id, className = '' }: { id: StarId; className?: string }) {
  const found = useHunt((s) => s.found.includes(id))
  const collect = useHunt((s) => s.collect)
  const [popping, setPopping] = useState(false)
  if (found && !popping) return null
  return (
    <button
      type="button"
      className={`hstar ${className}${popping ? ' is-popping' : ''}`}
      aria-label="Hidden star: collect it"
      onClick={() => {
        setPopping(true)
        collect(id)
        window.setTimeout(() => setPopping(false), 700)
      }}
    >
      <Star className="hstar-svg" />
      {popping && (
        <span className="hstar-burst" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} style={{ ['--a' as string]: `${i * 45}deg` }} />
          ))}
        </span>
      )}
    </button>
  )
}

// Progress pill for the floating menu
export function StarCounter() {
  const n = useHunt((s) => s.found.length)
  const showHint = useHunt((s) => s.showHint)
  const done = n === STAR_IDS.length
  return (
    <button
      type="button"
      className={`hcount${done ? ' is-done' : ''}`}
      onClick={showHint}
      aria-label={`Star hunt: ${n} of ${STAR_IDS.length} found`}
      title="Find the hidden stars"
    >
      <Star className="hcount-star" />
      {n}/{STAR_IDS.length}
    </button>
  )
}

// Toasts, confetti and the reward card (mount once, near the root)
export function StarHuntLayer() {
  const toast = useHunt((s) => s.toast)
  const open = useHunt((s) => s.rewardOpen)
  const close = useHunt((s) => s.closeReward)
  // fresh confetti each time the card opens
  const confetti = useMemo(
    () =>
      open
        ? Array.from({ length: 34 }, (_, i) => ({
            x: (Math.random() - 0.5) * 120, // vw
            y: -(40 + Math.random() * 60), // vh
            r: Math.random() * 540 - 270,
            s: 0.6 + Math.random() * 1.1,
            d: Math.random() * 0.25,
            k: i,
          }))
        : [],
    [open]
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const claim = () => {
    const url = `${CONTACT.whatsapp}?text=${encodeURIComponent(REWARD.message)}`
    const win = window.open(url, '_blank')
    if (win) win.opener = null
    else window.location.href = url
  }

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="htoast"
            role="status"
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            transition={{ duration: 0.35 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="hreward-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="hconfetti" aria-hidden="true">
              {confetti.map((c) => (
                <motion.span
                  key={c.k}
                  initial={{ x: 0, y: '30vh', rotate: 0, scale: 0, opacity: 1 }}
                  animate={{ x: `${c.x}vw`, y: `${c.y}vh`, rotate: c.r, scale: c.s, opacity: 0 }}
                  transition={{ duration: 1.6, delay: c.d, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Star className="hconfetti-star" />
                </motion.span>
              ))}
            </div>
            <motion.div
              className="hreward glass"
              role="dialog"
              aria-modal="true"
              aria-label={REWARD.title}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div className="hreward-stars" aria-hidden="true">
                {STAR_IDS.map((id) => (
                  <Star key={id} className="hreward-star" />
                ))}
              </div>
              <h2 className="hreward-title">{REWARD.title}</h2>
              <p className="hreward-body">{REWARD.body}</p>
              <button type="button" className="lead-btn hreward-cta" data-magnetic onClick={claim}>
                {REWARD.cta}
              </button>
              <button type="button" className="hreward-close" onClick={close}>
                Keep exploring
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
