// 作品集数据（双语）。5 大板块 → 点击展开作品详情。
// 纯数据驱动：增删板块 / 作品只改本文件，Works.jsx 仅负责渲染。
//
// 板块字段：
//   id        唯一标识（用于 framer layoutId 共享元素动画）
//   no        编号 '01'…'05'
//   title     板块标题
//   tagline   索引行右侧一句话
//   items[]   扁平作品列表：{ name, meta?, tags?, link? }
//             点击 item 弹出全屏详情，可补充可选媒体/文案字段：
//             { image?, video?, year?, desc? }（缺省时媒体用占位、简介回退 meta/标签）
//   groups[]  分组作品（与 items 二选一）：{ heading, items: string[] }
//   awards[]  奖项 chip（可选）
//   footer    底部技术/备注一行（可选）

export interface WorkListItem {
  name: string
  meta?: string
  tags?: string[]
  link?: string
  slug?: string
}

export interface WorkGroup {
  heading: string
  items: string[]
}

export interface WorkSection {
  id: string
  no: string
  title: string
  tagline: string
  items?: WorkListItem[]
  groups?: WorkGroup[]
  awards?: string[]
  footer?: string
}

export interface WorksLang {
  title: string
  closeLabel: string
  openLabel: string
  hint: string
  awardsLabel: string
  visitLabel: string
  detailPlaceholder: string
  phImageLabel: string
  phButtonLabel: string
  countLabel: (n: number) => string
  sections: WorkSection[]
}

// Works content (English only; both language keys share the same data).
// Each item's `slug` links to src/content/works/<slug>.md for its detail view.
const EN: WorksLang = {
  title: 'Works',
  closeLabel: 'Back',
  openLabel: 'Explore',
  hint: 'Keep scrolling',
  awardsLabel: 'Platforms',
  visitLabel: 'Visit site',
  detailPlaceholder: 'Details coming soon.',
  phImageLabel: 'Image / Video',
  phButtonLabel: 'Link',
  countLabel: (n) => `${n} ${n === 1 ? 'project' : 'projects'}`,
  sections: [
    {
      id: 'performance',
      no: '01',
      title: 'Performance Marketing',
      tagline: 'Lead generation · Paid media',
      items: [
        { name: 'Al Aseel Business Hub', meta: 'Business setup · WhatsApp lead gen', slug: 'al-aseel' },
        { name: 'Xylem Learning', meta: 'Ed-tech · Paid campaigns', slug: 'xylem' },
        { name: 'Dotin Digital Academy', meta: '35.9M impressions · 14.4% search CTR', slug: 'dotin-admissions' },
      ],
      awards: ['Meta Ads', 'Google Ads', 'SEO'],
    },
    {
      id: 'branding',
      no: '02',
      title: 'Branding & Content',
      tagline: 'Dotcom Creativez',
      items: [
        {
          name: 'Agency brand work',
          meta: 'Brand identity · Content · Ad campaigns',
          slug: 'dotcom-branding',
        },
      ],
      footer: 'Led the branding team for agency clients',
    },
    {
      id: 'freelance',
      no: '03',
      title: 'Freelance',
      tagline: '20+ brands',
      items: [
        { name: 'WayHomes', meta: 'D2C e-commerce · Meta Ads', slug: 'wayhomes' },
        { name: 'Offenso Hackers Academy', meta: 'Education · Snapchat Ads', slug: 'offenso' },
      ],
      footer: 'E-commerce · Education · Real estate · Automotive · Media · Fitness',
    },
    {
      id: 'training',
      no: '04',
      title: 'Training',
      tagline: 'Dotin Digital Academy',
      items: [
        {
          name: 'Digital marketing trainer',
          meta: 'Social media · Meta Ads · Performance marketing',
          slug: 'dotin-training',
        },
      ],
    },
  ],
}

export const WORKS: Record<'zh' | 'en', WorksLang> = { en: EN, zh: EN }

// Optional full-height cover per section, keyed by section id, from public/works/covers/.
// Sections without a cover show a numbered gradient placeholder.
export const SECTION_COVERS: Record<string, string> = {}

// 统计一个板块的作品数（items 或 groups 求和），用于索引行 hover 显示
export function sectionCount(section: WorkSection): number {
  if (section.items) return section.items.length
  if (section.groups) return section.groups.reduce((n, g) => n + g.items.length, 0)
  return 0
}
