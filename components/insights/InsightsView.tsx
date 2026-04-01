'use client'

import { motion } from 'framer-motion'
import {
  Trophy, TrendingDown, TrendingUp, Wallet, Calendar,
  Utensils, Home, ShoppingBag, Car, Zap,
  Briefcase, HeartPulse, Laptop, Monitor,
  BookOpen, ShoppingCart, Circle,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import { useFinanceStore, categoryColor, Category } from '@/store/useFinanceStore'

const ICON_MAP: Record<string, React.ElementType> = {
  utensils: Utensils, home: Home, 'shopping-bag': ShoppingBag,
  car: Car, zap: Zap, briefcase: Briefcase, 'heart-pulse': HeartPulse,
  laptop: Laptop, monitor: Monitor, 'book-open': BookOpen,
  'shopping-cart': ShoppingCart, 'trending-up': TrendingUp, circle: Circle,
}

function inr(v: number) {
  const n = Math.abs(v)
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}k`
  return `₹${n.toLocaleString('en-IN')}`
}

function inrFull(v: number) {
  return `₹${Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

const fade = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }

function InsightCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string; sub: string; accent: string
}) {
  return (
    <motion.div
      variants={fade}
      className="rounded-3xl p-8 lg:p-10 relative overflow-hidden glass-panel hover-glow group min-h-[180px] flex flex-col justify-between"
    >
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: accent }} />
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}1A` }}>
          <Icon size={24} style={{ color: accent }} />
        </div>
        <p className="font-inter text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      </div>

      <div className="mt-6">
        <p className="font-manrope font-semibold text-3xl lg:text-4xl text-white">{value}</p>
        <p className="font-inter text-sm text-slate-500 mt-2">{sub}</p>
      </div>
    </motion.div>
  )
}

interface BarTip {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}
function BarTooltip({ active, payload, label }: BarTip) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-panel p-5 rounded-2xl shadow-2xl backdrop-blur-3xl min-w-[200px]">
      <p className="font-inter text-sm text-slate-400 font-semibold mb-3">{label}</p>
      <div className="space-y-3">
        {payload.map(p => (
          <div key={p.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
              <span className="font-inter text-sm text-slate-300">{p.name}</span>
            </div>
            <span className="font-manrope text-base font-bold text-white">{inr(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InsightsView() {
  const { transactions } = useFinanceStore()

  const march  = transactions.filter(t => t.date >= '2026-03-01' && t.date < '2026-04-01')
  const feb    = transactions.filter(t => t.date >= '2026-02-01' && t.date < '2026-03-01')
  const april  = transactions.filter(t => t.date >= '2026-04-01')

  const allExpenses = [...march, ...april].filter(t => t.type === 'debit')

  const catTotals = allExpenses.reduce<Record<string, number>>((a, t) => {
    a[t.category] = (a[t.category] || 0) + Math.abs(t.amount)
    return a
  }, {})
  const sortedCats = Object.entries(catTotals).sort(([, a], [, b]) => b - a)
  const totalSpend = sortedCats.reduce((s, [, v]) => s + v, 0)

  const [topCat] = sortedCats
  const topCatColor = topCat ? categoryColor(topCat[0] as Category) : '#3b82f6'

  const marchExp = march.filter(t => t.type === 'debit').reduce((s, t) => s + Math.abs(t.amount), 0)
  const marchInc = march.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const febExp   = feb.filter(t => t.type === 'debit').reduce((s, t) => s + Math.abs(t.amount), 0)

  const monthChange = febExp > 0 ? ((marchExp - febExp) / febExp * 100) : 0
  const savingsRate = marchInc > 0 ? (((marchInc - marchExp) / marchInc) * 100) : 0
  const dailyAvg = marchExp / 31

  const top5 = [...allExpenses].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)).slice(0, 5)

  const allCats = new Set([
    ...march.filter(t => t.type === 'debit').map(t => t.category),
    ...feb.filter(t => t.type === 'debit').map(t => t.category),
  ])
  const barData = Array.from(allCats)
    .map(cat => ({
      cat: cat.length > 8 ? cat.slice(0, 8) + '.' : cat, // truncate long names
      March: march.filter(t => t.type === 'debit' && t.category === cat).reduce((s, t) => s + Math.abs(t.amount), 0),
      Feb:   feb.filter(t => t.type === 'debit' && t.category === cat).reduce((s, t) => s + Math.abs(t.amount), 0),
    }))
    .filter(d => d.March > 0 || d.Feb > 0)
    .sort((a, b) => (b.March + b.Feb) - (a.March + a.Feb))
    .slice(0, 8)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 max-w-[1600px] mx-auto pb-12 px-1">
      
      <motion.div variants={fade} className="mb-4">
        <h1 className="font-manrope font-semibold text-3xl lg:text-4xl text-white">Insights & Analytics</h1>
        <p className="font-inter text-base text-slate-400 mt-3">
          Algorithmic observations extracted from your financial ledgers.
        </p>
      </motion.div>

      {/* ── 4 Insight Cards ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {topCat && (
          <InsightCard
            icon={Trophy}
            label="Peak Target"
            value={inr(topCat[1])}
            sub={topCat[0]}
            accent={topCatColor}
          />
        )}
        <InsightCard
          icon={Wallet}
          label="Retention"
          value={`${savingsRate.toFixed(1)}%`}
          sub="of available March income saved"
          accent={savingsRate > 30 ? '#10b981' : '#ef4444'}
        />
        <InsightCard
          icon={Calendar}
          label="Burn Rate"
          value={inr(dailyAvg)}
          sub="Average daily spend (March)"
          accent="#f59e0b"
        />
        <InsightCard
          icon={monthChange > 0 ? TrendingDown : TrendingUp}
          label="MoM Variance"
          value={`${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)}%`}
          sub={monthChange > 0 ? 'Negative variance vs Feb' : 'Positive variance vs Feb'}
          accent={monthChange > 0 ? '#ef4444' : '#10b981'}
        />
      </div>

      {/* ── Month Comparison Chart ─────────────────────── */}
      <motion.div
        variants={fade}
        className="rounded-3xl p-8 lg:p-10 glass-panel shadow-2xl relative"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-manrope font-semibold text-2xl text-white">
              Relative Context
            </h2>
            <p className="font-inter text-base text-slate-400 mt-2">
              February vs March 2026 categorically distributed
            </p>
          </div>
          <div className="flex items-center gap-8 bg-white/5 px-6 py-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-inter text-sm font-semibold text-white">March</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500/30" />
              <span className="font-inter text-sm font-medium text-slate-400">February</span>
            </div>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto pb-4" style={{ height: 350 }}>
          <div className="min-w-[600px] h-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="cat" tick={{ fill: '#cdd5e0', fontSize: 13, fontFamily: 'Inter' }} axisLine={false} tickLine={false} dy={16} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 13, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={inr} dx={-10} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="March" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Feb" fill="rgba(59,130,246,0.3)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom: Category Breakdown + Top Expenses ──── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Category breakdown */}
        <motion.div variants={fade} className="rounded-3xl p-8 lg:p-10 glass-panel">
          <h2 className="font-manrope font-semibold text-2xl text-white mb-8">Aggregated Overview</h2>
          <div className="space-y-6">
            {sortedCats.slice(0, 7).map(([cat, amt]) => {
              const color = categoryColor(cat as Category)
              const pct = totalSpend > 0 ? (amt / totalSpend) * 100 : 0
              return (
                <div key={cat} className="group cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-inter text-sm font-semibold text-slate-300">{cat}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-inter text-sm font-medium text-slate-500">{pct.toFixed(1)}%</span>
                      <span className="font-manrope text-base font-bold text-white">{inrFull(amt)}</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden bg-slate-800 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Top 5 expenses */}
        <motion.div variants={fade} className="rounded-3xl p-8 lg:p-10 glass-panel">
          <h2 className="font-manrope font-semibold text-2xl text-white mb-8">Outflow Anomalies</h2>
          <div className="space-y-4">
            {top5.map((t, i) => {
              const Icon = ICON_MAP[t.icon] ?? Circle
              const color = categoryColor(t.category)
              return (
                <div key={t.id} className="flex items-center gap-5 py-3 px-4 -mx-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                  <span className="font-manrope font-bold text-sm w-6 text-center text-slate-500 bg-white/5 rounded-lg py-1.5 group-hover:bg-white/10 transition-colors">
                    {i + 1}
                  </span>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}1A` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-[15px] font-semibold truncate text-white">
                      {t.description}
                    </p>
                    <p className="font-inter text-sm text-slate-500 mt-1">
                      {t.category} <span className="mx-1.5 opacity-50">•</span> {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className="font-manrope text-lg font-bold flex-shrink-0 text-rose-400">
                    −{inrFull(t.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
