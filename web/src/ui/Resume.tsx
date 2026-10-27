import { motion } from 'framer-motion'
import { ZooopLogo } from './ZooopLogo'
import { SOCIAL_ICONS } from './SocialIcons'
import { FOCUS_POINTS } from '../data/focusPoints'

const LOGO = (name: string) => `${import.meta.env.BASE_URL}images/logos/${name}`

const CONTACT_LINKS = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/sulthan-ks/' },
  { id: 'instagram', label: 'Instagram @_.sulth4n._', href: 'https://www.instagram.com/_.sulth4n._/' },
  { id: 'email', label: 'sulthansalavudeen@gmail.com', href: 'mailto:sulthansalavudeen@gmail.com' },
  { id: 'phone', label: 'Call (UAE) +971 50 605 2016', href: 'tel:+971506052016' },
  { id: 'whatsapp', label: 'WhatsApp (India) +91 97458 50621', href: 'https://wa.me/919745850621' },
]

// Résumé data. Each entry lines up with one camera stop in the 3D model
// (see data/focusPoints.ts), so keep exactly 5 entries unless the glb changes.
interface ResumeGroup {
  heading?: string
  logo?: string
  logoImg?: string
  wordmark?: { src: string; alt: string }
  sub?: string
  link?: string
  items?: string[]
  links?: { id: string; label: string; href: string }[]
}
interface ResumeEntry {
  period: string
  place: string
  role?: string
  logo?: { src: string; alt: string }
  wordmark?: { src: string; alt: string }
  points?: string[]
  groups?: ResumeGroup[]
}

const ENTRIES: ResumeEntry[] = [
  {
    period: '2019 – 2023',
    place: 'Education',
    groups: [
      {
        heading: 'BBA, Marketing',
        sub: 'MES Asmabi College, Kodungallur · 2019 – 2022',
      },
      {
        heading: 'Advanced Diploma in Digital Marketing',
        wordmark: { src: LOGO('dotin.webp'), alt: 'Dotin Digital Academy' },
        sub: 'Dotin Digital Academy · 2022 – 2023',
      },
    ],
  },
  {
    period: 'Jul 2022 – Jan 2024',
    place: 'Kerala, India',
    groups: [
      {
        heading: 'Digital Marketing Intern',
        wordmark: { src: LOGO('dotin.webp'), alt: 'Dotin Digital Academy' },
        sub: 'Dotin Digital Academy · Thrissur · Jul 2022 – Mar 2023',
        items: ['Started in campaign execution and social media management.'],
      },
      {
        heading: 'Digital Marketing Executive',
        wordmark: { src: LOGO('xylem.webp'), alt: 'Xylem Learning' },
        sub: 'Xylem Learning · Kozhikode · Mar 2023 – Jan 2024',
        items: ['Ran paid campaigns and lead generation for an ed-tech brand.'],
      },
    ],
  },
  {
    period: '2022 – Present',
    place: 'Independent & agency clients',
    role: 'Freelance Performance Marketer · Remote',
    points: [
      'Strategy, creative and paid media for e-commerce, education, real estate, automotive, media and fitness brands.',
    ],
  },
  {
    period: 'Jan 2024 – Mar 2026',
    place: 'Kerala, India',
    groups: [
      {
        heading: 'Branding Team Lead',
        wordmark: { src: LOGO('dotcom.webp'), alt: 'Dotcom Creativez' },
        sub: 'Dotcom Creativez',
        items: ['Led the branding team, delivering brand identity, content and ad campaigns for agency clients.'],
      },
      {
        heading: 'Digital Marketing Trainer',
        wordmark: { src: LOGO('dotin.webp'), alt: 'Dotin Digital Academy' },
        sub: 'Dotin Digital Academy',
        items: [
          'Trained and mentored students in social media, Meta Ads and performance marketing, while running the academy’s own admission campaigns.',
        ],
      },
    ],
  },
  {
    period: 'Mar 2026 – Present',
    place: 'Al Aseel Business Hub · Dubai',
    wordmark: { src: LOGO('al-aseel.webp'), alt: 'Al Aseel Business Hub' },
    role: 'Head of Digital Marketing',
    points: [
      'Lead digital strategy, brand growth and lead generation for a UAE business-setup firm.',
      'Performance campaigns, social media, content, SEO, Google Ads, Meta Ads and the website.',
    ],
    groups: [
      {
        heading: 'Get in touch',
        items: [
          'sulthansalavudeen@gmail.com',
          'UAE +971 50 605 2016 · WhatsApp (India) +91 97458 50621',
        ],
        links: CONTACT_LINKS,
      },
    ],
  },
]

// The site is English-only; both language keys share the same data.
const RESUME: Record<'en' | 'zh', { title: string; entries: ResumeEntry[] }> = {
  en: { title: 'Résumé', entries: ENTRIES },
  zh: { title: 'Résumé', entries: ENTRIES },
}

// 履历条目依次对应 glb 里的聚焦锚点（相机停靠点），顺序须与 entries 一致。
// 名单是唯一真源，见 data/focusPoints.ts（Scene.tsx 也从那里取）。
const POINT_ORDER = FOCUS_POINTS

const EASE = [0.22, 1, 0.36, 1]
const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
const itemV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

function Group({ group }: { group: ResumeGroup }) {
  const heading =
    group.logo === 'zooop' ? (
      <a
        className="zooop-logo-link"
        href={group.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ZOOOP"
      >
        <ZooopLogo className="zooop-logo" animated />
      </a>
    ) : group.link ? (
      <a className="about-link" href={group.link} target="_blank" rel="noopener noreferrer">
        {group.heading}
      </a>
    ) : (
      <span>{group.heading}</span>
    )

  return (
    <motion.div className="tl-group" variants={itemV}>
      <div className="tl-group-head">
        {group.logoImg && (
          <span className="tl-group-logo">
            <img src={group.logoImg} alt={group.heading || ''} loading="lazy" />
          </span>
        )}
        {heading}
        {group.sub && <span className="tl-group-sub">{group.sub}</span>}
      </div>
      {group.wordmark && (
        <img className="tl-wordmark" src={group.wordmark.src} alt={group.wordmark.alt} loading="lazy" />
      )}
      {group.items && (
        <ul className="tl-points">
          {group.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
      {group.links && (
        <div className="tl-logos">
          {group.links.map((l) => {
            const Icon = SOCIAL_ICONS[l.id as keyof typeof SOCIAL_ICONS]
            return (
              <a
                key={l.id}
                className="tl-logo"
                href={l.href}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={l.label}
                title={l.label}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function Entry({ entry, index }: { entry: ResumeEntry; index: number }) {
  return (
    <motion.div
      className="tl-entry"
      data-point={POINT_ORDER[index]}
      variants={containerV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
    >
      <motion.span className="tl-dot" variants={itemV} aria-hidden="true" />
      {/* tl-body 包住文字内容（点保持在外做时间轴标记）：移动端可给它加卡片衬底，
          且它紧贴内容高度，不含 tl-entry 用于排布的大 padding。
          用普通 div（非 motion）：framer 变体经 React context 穿透它，叶子元素仍是
          tl-entry 的直接 stagger 子级，入场动画与包裹前完全一致。 */}
      <div className="tl-body">
        <motion.div className="tl-period" variants={itemV}>
          {entry.period}
        </motion.div>
        <motion.div className="tl-head" variants={itemV}>
          {entry.logo && (
            <span className="tl-logo-chip">
              <img src={entry.logo.src} alt={entry.logo.alt} loading="lazy" />
            </span>
          )}
          <h3 className="tl-place">{entry.place}</h3>
        </motion.div>
        {entry.wordmark && (
          <motion.img
            className="tl-wordmark"
            src={entry.wordmark.src}
            alt={entry.wordmark.alt}
            loading="lazy"
            variants={itemV}
          />
        )}
        {entry.role && (
          <motion.div className="tl-role" variants={itemV}>
            {entry.role}
          </motion.div>
        )}
        {entry.points && (
          <motion.ul className="tl-points" variants={itemV}>
            {entry.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </motion.ul>
        )}
        {entry.groups && entry.groups.map((g, i) => <Group key={i} group={g} />)}
      </div>
    </motion.div>
  )
}

export default function Resume({ lang }: { lang: 'en' | 'zh' }) {
  const data = RESUME[lang]
  return (
    <section className="resume" lang={lang}>
      <motion.h2
        className="resume-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {data.title}
      </motion.h2>
      <div className="timeline">
        {data.entries.map((e, i) => (
          <Entry key={i} entry={e} index={i} />
        ))}
      </div>
    </section>
  )
}
