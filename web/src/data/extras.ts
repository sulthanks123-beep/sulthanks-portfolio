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

export const CREATIVES: Creative[] = [
  {
    src: 'works/al-aseel/ad-creatives.webp',
    alt: 'Al Aseel Facebook and Instagram video ads',
    caption: 'Al Aseel · WhatsApp lead ads on Facebook and Instagram',
  },
]

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
  budgets: ['Under AED 2,000 / month', 'AED 2,000 – 5,000', 'AED 5,000 – 15,000', 'AED 15,000+', 'Not sure yet'],
}
