import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { CONTACT } from '../data/extras'
import { RevealText } from './Flair'

// "What could your ad budget do?" — drag a monthly budget, pick a goal, see a rough range
// worked out from the cost ranges of Sulthan's past campaigns, then send it to WhatsApp.
// Costs are AED per result (INR figures converted at 1 AED ≈ 25.8 INR, Nov 2026).
interface Goal {
  id: string
  label: string
  unit: string // what the number counts
  per: number // results per "cost" unit (1 for per-result costs, 1000 for CPM)
  min: number // lowest cost seen (AED)
  max: number // highest cost seen (AED)
  source: string
}

const GOALS: Goal[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp leads',
    unit: 'WhatsApp conversations',
    per: 1,
    min: 2.28,
    max: 7.74,
    source: 'Based on cost per conversation in my UAE business-setup campaigns (AED 2.28–7.74).',
  },
  {
    id: 'sales',
    label: 'Online sales',
    unit: 'website purchases',
    per: 1,
    min: 1.76,
    max: 2.91,
    source: 'Based on cost per purchase in a low-ticket D2C store’s Meta campaigns (≈ AED 1.76–2.91).',
  },
  {
    id: 'search',
    label: 'Google Search clicks',
    unit: 'clicks from people searching',
    per: 1,
    min: 2.76,
    max: 2.95,
    source: 'Based on average cost per click in my Google Search campaigns (≈ AED 2.76–2.95).',
  },
  {
    id: 'awareness',
    label: 'Brand awareness',
    unit: 'ad impressions',
    per: 1000,
    min: 0.42,
    max: 0.86,
    source: 'Based on cost per 1,000 impressions in my Meta and Snapchat campaigns (≈ AED 0.42–0.86).',
  },
]

// slider 0–100 maps to AED 500–50,000 on a curve, so small budgets get fine control
const MIN_B = 500
const MAX_B = 50000
const toBudget = (v: number) => {
  const raw = MIN_B * Math.pow(MAX_B / MIN_B, v / 100)
  const step = raw < 2000 ? 100 : raw < 10000 ? 500 : 1000
  return Math.round(raw / step) * step
}
const toSlider = (b: number) => (Math.log(b / MIN_B) / Math.log(MAX_B / MIN_B)) * 100

const compact = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`
  if (n >= 10_000) return `${Math.round(n / 1000)}K`
  return Math.round(n).toLocaleString('en-US')
}

// number that rolls to its new value
function Rolling({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const last = useRef(value)
  useEffect(() => {
    const from = last.current
    last.current = value
    const ctl = animate(from, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = compact(v)
      },
    })
    return () => ctl.stop()
  }, [value])
  return <span ref={ref}>{compact(value)}</span>
}

export default function BudgetCalc() {
  const [goal, setGoal] = useState<Goal>(GOALS[0])
  const [slider, setSlider] = useState(toSlider(5000))
  const budget = toBudget(slider)
  const low = (budget / goal.max) * goal.per
  const high = (budget / goal.min) * goal.per

  const plan = () => {
    const text = [
      'Hi Sulthan, I tried the budget calculator on your portfolio.',
      '',
      `Monthly budget: AED ${budget.toLocaleString('en-US')}`,
      `Goal: ${goal.label}`,
      `Estimate shown: ${compact(low)}–${compact(high)} ${goal.unit}`,
      '',
      'Can you put together a real plan for this?',
    ].join('\n')
    const url = `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`
    const win = window.open(url, '_blank')
    if (win) win.opener = null
    else window.location.href = url
  }

  return (
    <section className="calc" id="calculator" aria-label="Ad budget calculator">
      <RevealText className="ex-title calc-title" text="What could your ad budget do?" />
      <div className="calc-card glass">
        <div className="calc-controls">
          <p className="calc-q">I want</p>
          <div className="calc-goals" role="radiogroup" aria-label="Goal">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={goal.id === g.id}
                className={`lead-chip${goal.id === g.id ? ' is-on' : ''}`}
                onClick={() => setGoal(g)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <label className="calc-q" htmlFor="calc-budget">
            with a monthly ad budget of
          </label>
          <p className="calc-budget">
            <small>AED</small>
            {budget.toLocaleString('en-US')}
          </p>
          <input
            id="calc-budget"
            className="calc-range"
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            style={{ ['--fill' as string]: `${slider}%` }}
            aria-valuetext={`AED ${budget.toLocaleString('en-US')} per month`}
          />
          <div className="calc-scale" aria-hidden="true">
            <span>AED 500</span>
            <span>AED 50K</span>
          </div>
        </div>

        <div className="calc-result" aria-live="polite">
          <p className="calc-q">You could expect around</p>
          <p className="calc-number">
            <Rolling value={low} />
            <span className="calc-dash">–</span>
            <Rolling value={high} />
          </p>
          <p className="calc-unit">{goal.unit} a month</p>
          <p className="calc-source">
            {goal.source} Rough estimate from past results, not a promise: your product, offer, market and creative
            all change the numbers, and UAE costs usually run higher than India’s.
          </p>
          <button type="button" className="lead-btn calc-cta" data-magnetic onClick={plan}>
            Get a real plan for this budget
          </button>
        </div>
      </div>
    </section>
  )
}
