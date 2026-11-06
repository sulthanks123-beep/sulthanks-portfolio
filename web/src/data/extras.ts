// Content for the sections below Works (Extras.tsx). Pure data: edit here, not in the component.

export interface Stat {
  value: string
  label: string
}

export interface Service {
  title: string
  body: string
  points: string[]
}

export interface Step {
  title: string
  body: string
}

export interface Creative {
  src: string // path under public/, e.g. 'works/al-aseel/ad-creatives.webp'
  alt: string
  caption: string
  video?: boolean // true for .mp4 files (plays muted on loop)
}

export interface Testimonial {
  quote: string
  name: string
  role: string
}

export const STATS: Stat[] = [
  { value: '₹6.5M', label: 'in store sales for a D2C client I run ads for' },
  { value: '35.9M', label: 'ad impressions delivered for one education brand' },
  { value: '14.4%', label: 'Google Search click-through rate' },
  { value: '20+', label: 'brands across six industries' },
]

export const SERVICES: Service[] = [
  {
    title: 'Meta & Google Ads',
    body: 'Campaigns built around leads and sales, not likes.',
    points: ['Campaign strategy and setup', 'Audience and regional targeting', 'Daily optimisation and reporting'],
  },
  {
    title: 'WhatsApp lead generation',
    body: 'Ads that start real conversations with your sales team.',
    points: ['Click-to-WhatsApp campaigns', 'Influencer-led video creatives', 'Malayalam, English and regional ads'],
  },
  {
    title: 'E-commerce growth',
    body: 'Paid social for D2C and Shopify stores.',
    points: ['Purchase and checkout campaigns', 'Creative testing by region and language', 'Scaling what converts'],
  },
  {
    title: 'Brand & content',
    body: 'A brand people remember and content that sells it.',
    points: ['Brand identity', 'Social media content', 'Ad creative direction'],
  },
]

export const STEPS: Step[] = [
  { title: 'Audit', body: 'I look at your current ads, funnel and numbers to find what is working and what is wasting money.' },
  { title: 'Strategy', body: 'We agree on goals, budget and the channels and offers most likely to hit them.' },
  { title: 'Launch', body: 'Creatives, targeting and tracking go live, starting small so we learn fast.' },
  { title: 'Optimise', body: 'Weekly tuning and clear reports: cut what does not perform, scale what does.' },
]

// FAQ shown on the page. Keep in sync with the FAQPage JSON-LD and static copy in index.html.
export const FAQS: { q: string; a: string }[] = [
  { q: "What does a performance marketer do?", a: "I plan, launch and optimise paid campaigns on Meta (Facebook and Instagram) and Google so that ad spend turns into leads and sales, not just likes and views." },
  { q: "How much should I spend on Meta Ads in Dubai?", a: "Most small businesses can start learning with AED 2,000–5,000 a month. Bigger budgets scale results once we know what converts. The budget calculator on this page gives a rough estimate." },
  { q: "What's a good cost per lead for WhatsApp ads in the UAE?", a: "In my recent business-setup campaigns in Dubai, WhatsApp conversations cost about AED 2.28–7.74 each. Your costs depend on your offer, audience and creative." },
  { q: "Do you work with businesses outside the UAE?", a: "Yes. I've run campaigns for brands in the UAE and India across e-commerce, education, real estate, automotive, media and fitness." },
  { q: "Which platforms do you run ads on?", a: "Meta (Facebook and Instagram), Google Search, Snapchat, plus SEO and organic social content." },
  { q: "How do we start working together?", a: "Message me on WhatsApp or use the form on this page. I'll reply within a day with a few questions, then we plan your first campaign." },
]

// Ad creatives gallery: the section stays hidden while this list is empty.
export const CREATIVES: Creative[] = []

// Only real client quotes. The section stays hidden while this list is empty.
export const TESTIMONIALS: Testimonial[] = []

export const CONTACT = {
  email: 'sulthansalavudeen@gmail.com',
  whatsapp: 'https://wa.me/919745850621',
  whatsappLabel: 'WhatsApp +91 97458 50621',
  phone: 'tel:+971506052016',
  phoneLabel: 'Call (UAE) +971 50 605 2016',
  linkedin: 'https://www.linkedin.com/in/sulthan-ks/',
  instagram: 'https://www.instagram.com/_.sulth4n._/',
  needs: ['Meta Ads', 'Google Ads', 'WhatsApp leads', 'E-commerce growth', 'Brand & content', 'Full strategy'],
  budgets: ['Under AED 2k', 'AED 2–5k', 'AED 5–15k', 'AED 15k+', 'Not sure yet'],
}
