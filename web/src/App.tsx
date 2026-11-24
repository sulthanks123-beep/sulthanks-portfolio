import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'
import Scene from './scene/Scene'
// import NoiseOverlay from './ui/NoiseOverlay'
import Resume from './ui/Resume'
import Works from './ui/Works'
import Extras from './ui/Extras'
import FloatingNav from './ui/FloatingNav'
import CustomCursor from './ui/CustomCursor'
import { DubaiClock } from './ui/Flair'
import { scrollToEl, startSmoothScroll } from './ui/smoothScroll'
import HeroName from './ui/HeroName'
import LoadingScreen from './ui/LoadingScreen'
import { useStore } from './store'

function Backdrop() {
  // 点击空白处收起详情
  const setActive = useStore((s) => s.setActive)
  return (
    <mesh position={[0, 0, -40]} onClick={() => setActive(null)}>
      <planeGeometry args={[600, 300]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

type Lang = 'en' | 'zh'

// About copy. The site is English-only; both language keys share the same text.
const ABOUT = {
  title: 'About Sulthan',
  paragraphs: [
    "I'm Sulthan — a digital marketer in Dubai and performance marketing specialist for founders. I build ads and content that convert, with Meta Ads, Google Ads and strategy behind 20+ brands. Based in Dubai, UAE. From Kerala, India.",
  ],
}
const COPY = { en: ABOUT, zh: ABOUT }

// Hero (Nov 2026 redesign): one statement, the about text and a link to the work, top left.
// The giant name (HeroName) and the light beams sit behind the 3D character.
// The previous hero is kept on the GitHub branch backup-before-hero-redesign.
function Hero({ lang }: { lang: Lang }) {
  const { paragraphs } = COPY[lang]
  const { scrollY } = useScroll()
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const blur = useTransform(scrollY, [0, vh * 0.45], ['blur(0px)', 'blur(14px)'])
  const opacity = useTransform(scrollY, [0, vh * 0.45], [1, 0])
  const y = useTransform(scrollY, [0, vh], [0, -80])
  const goWorks = () => {
    const el = document.querySelector('.works')
    if (el) scrollToEl(el)
  }
  return (
    <section className="hero">
      <motion.div className="hx" lang={lang} style={{ filter: blur, opacity, y }}>
        <h1 className="sr-only">Sulthan K S, digital marketer in Dubai</h1>
        <p className="hx-statement">
          Performance marketing for founders who want sales, <span>not likes.</span>
        </p>
        {paragraphs.map((p, i) => (
          <p key={i} className="hx-about">
            {p}
          </p>
        ))}
        <button type="button" className="hx-link" onClick={goWorks}>
          See the work
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </motion.div>
    </section>
  )
}

// Top bar shown over the hero; fades out as the floating menu takes over
function HeroBar() {
  const go = (sel: string) => {
    const el = document.querySelector(sel)
    if (el) scrollToEl(el)
  }
  return (
    <>
      <nav className="hc-nav" aria-label="Main">
        <button type="button" className="hc-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Sulthan K S
        </button>
        <div className="hc-right">
          <button type="button" className="hc-link" onClick={() => go('.works')}>Work</button>
          <button type="button" className="hc-link" onClick={() => go('#services')}>Services</button>
          <button type="button" className="hc-link" onClick={() => go('#process')}>Process</button>
          <a className="hc-talk" href="https://wa.me/919745850621" target="_blank" rel="noopener noreferrer">
            Let’s talk
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </i>
          </a>
        </div>
      </nav>
      <div className="hc-place">
        <b>Digital marketer in Dubai</b>
        <DubaiClock />
      </div>
    </>
  )
}

function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button className="lang-toggle" onClick={onToggle} aria-label="切换语言 / Switch language">
      {lang === 'en' ? '中文' : 'EN'}
    </button>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  useEffect(() => startSmoothScroll(), [])

  // Stop redrawing the 3D scene while the opaque lower section (.extras) fully covers the
  // screen; it resumes as soon as you scroll back up. Saves the GPU most of the page.
  const [sceneHidden, setSceneHidden] = useState(false)
  useEffect(() => {
    const check = () => {
      const ex = document.querySelector('.extras')
      setSceneHidden(!!ex && ex.getBoundingClientRect().top <= -2)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])
  const { scrollY } = useScroll()
  // 作品区蒙层：以作品区顶部从视口底进入到视口中部的进度，驱动 3D 渐暗 + 模糊
  const worksRef = useRef(null)
  const { scrollYProgress: worksProgress } = useScroll({
    target: worksRef,
    offset: ['start end', 'start center'],
  })
  const fogBg = useTransform(
    worksProgress,
    [0, 1],
    ['rgba(8, 11, 18, 0)', 'rgba(8, 11, 18, 0.41)'] // 压暗减半（原 0.82）
  )
  const fogBlur = useTransform(worksProgress, [0, 1], ['blur(0px)', 'blur(10px)'])
  // 滚动渐暗：离开首屏后压暗 3D 场景，保证履历文字可读
  const scrimOpacity = useTransform(scrollY, [0, 520], [0, 0.4])
  // 首屏底部渐变底色：开始滑动后淡出
  const heroGradientOpacity = useTransform(scrollY, [0, 240], [1, 0])
  // 磨砂右轨：进入履历区后淡入（首屏不磨砂）
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const railOpacity = useTransform(scrollY, [vh * 0.5, vh * 1.1], [0, 1])
  // 首屏装饰画框/角标：滚动后淡出
  const heroChromeOpacity = useTransform(scrollY, [0, 280], [1, 0])
  const heroChromeVisibility = useTransform(heroChromeOpacity, (v) => (v < 0.02 ? 'hidden' : 'visible'))

  return (
    <>
      {/* 加载遮罩：模型全部加载完成前覆盖全屏，完成后淡出 */}
      <LoadingScreen />

      {/* Violet light beams on grain, fixed behind everything (the canvas is see-through) */}
      <div className="stage-light" aria-hidden="true">
        <span className="sl-beam sl-b3" />
        <span className="sl-beam sl-b1" />
        <span className="sl-beam sl-b2" />
        <span className="sl-grain" />
      </div>

      {/* Giant name: between the light and the 3D canvas, so the character stands in front */}
      <HeroName />

      {/* 固定的 3D 背景 */}
      <div className="scene-bg">
        <Canvas
          frameloop={sceneHidden ? 'never' : 'always'}
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 5, 19], fov: 39, near: 0.1, far: 500 }}
          gl={{ alpha: true, antialias: false, stencil: false, depth: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Suspense fallback={null}>
            <Backdrop />
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* 滚动渐暗蒙层 */}
      <motion.div className="scrim" style={{ opacity: scrimOpacity }} aria-hidden="true" />

      {/* 作品区固定蒙层：仅压暗（减半），模糊先注释掉 */}
      <motion.div
        className="stage-fog"
        style={{ background: fogBg /* , backdropFilter: fogBlur, WebkitBackdropFilter: fogBlur */ }}
        aria-hidden="true"
      />

      {/* 固定磨砂右轨（进入履历区淡入） */}
      <motion.div className="glass-rail" style={{ opacity: railOpacity }} aria-hidden="true" />

      {/* 首屏底部渐变底色，滚动后淡出 —— 暂时注释查看效果 */}
      {/* <motion.div
        className="hero-gradient"
        style={{ opacity: heroGradientOpacity }}
        aria-hidden="true"
      /> */}

      {/* Language toggle hidden; the site is English-only */}
      {/* <LangToggle lang={lang} onToggle={() => setLang((l) => (l === 'en' ? 'zh' : 'en'))} /> */}

      {/* 首屏装饰：发丝内框 + 四角定位标 + 角标元数据（随滚动淡出） */}
      <motion.div className="hero-chrome" style={{ opacity: heroChromeOpacity, visibility: heroChromeVisibility }}>
        <HeroBar />
      </motion.div>

      {/* Film-grain overlay turned off: it showed as dark specks on the character's face */}
      {/* <NoiseOverlay /> */}

      {/* Desktop cursor + magnetic buttons */}
      <CustomCursor />

      {/* Floating glass section menu (appears after the hero) */}
      <FloatingNav />

      {/* 可滚动内容 */}
      <main className="content">
        <Hero lang={lang} />
        <Resume lang={lang} />
        <Works lang={lang} innerRef={worksRef} />
        <Extras />
      </main>
    </>
  )
}
