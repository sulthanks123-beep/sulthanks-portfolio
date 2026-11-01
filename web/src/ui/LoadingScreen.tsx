import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'

// Full-screen loader shown until the 3D scene's files are in. The chrome S breathes in
// the middle while a big counter climbs to 100, then everything fades away.
// Progress comes from three's LoadingManager (useProgress); the counter eases toward the
// highest value seen so it never jumps backwards when files register in batches.
const S_IMG = `${import.meta.env.BASE_URL}images/chrome-s.webp`

export default function LoadingScreen() {
  const { progress } = useProgress()
  const [reached, setReached] = useState(false)
  const [hiding, setHiding] = useState(false)
  const [removed, setRemoved] = useState(false)
  const [shown, setShown] = useState(0) // number on screen
  const peak = useRef(0)
  peak.current = Math.max(peak.current, Math.min(Math.max(progress, 0), 100))

  // ease the counter toward the real progress (interval, so it also runs in background tabs)
  useEffect(() => {
    const id = setInterval(() => {
      setShown((v) => {
        const target = peak.current
        if (v >= target) return v
        return Math.min(target, v + Math.max(1, Math.round((target - v) * 0.18)))
      })
    }, 30)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (progress >= 100) setReached(true)
  }, [progress])

  // once the counter shows 100: hold a moment, fade, unmount
  useEffect(() => {
    if (!reached || shown < 100) return
    const t1 = setTimeout(() => setHiding(true), 350)
    const t2 = setTimeout(() => setRemoved(true), 1250)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reached, shown])

  if (removed) return null

  return (
    <div className={`loading-screen${hiding ? ' is-hidden' : ''}`} aria-hidden="true">
      <div className="ld-glow" />
      <img className="ld-s" src={S_IMG} alt="" fetchPriority="high" />
      <div className="ld-foot">
        <span className="ld-name">Sulthan K S</span>
        <span className="ld-count">
          {String(shown).padStart(3, '0')}
          <small>%</small>
        </span>
      </div>
      <div className="ld-bar">
        <span style={{ transform: `scaleX(${shown / 100})` }} />
      </div>
    </div>
  )
}
