'use client'

import { motion, Variants } from 'framer-motion'
import {
  ArrowUpRight, ArrowDownRight, TrendingUp,
  Utensils, Home, ShoppingBag, Car, Zap,
  Briefcase, HeartPulse, Laptop, Monitor,
  BookOpen, ShoppingCart, DollarSign, Circle,
  ShieldCheck, Eye,
} from 'lucide-react'
import { useFinanceStore, Transaction, categoryColor } from '@/store/useFinanceStore'
import BalanceTrendChart from '@/components/charts/BalanceTrendChart'
import SpendingDonutChart from '@/components/charts/SpendingDonutChart'
import Link from 'next/link'

/* ─── helpers ─────────────────────────────────────────── */
const ICON_MAP: Record<string, React.ElementType> = {
  utensils: Utensils, home: Home, 'shopping-bag': ShoppingBag,
  car: Car, zap: Zap, briefcase: Briefcase, 'heart-pulse': HeartPulse,
  laptop: Laptop, monitor: Monitor, 'book-open': BookOpen,
  'shopping-cart': ShoppingCart, 'trending-up': TrendingUp,
  'dollar-sign': DollarSign, circle: Circle,
}

function inr(v: number) {
  const n = Math.abs(v)
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}k`
  return `₹${n.toLocaleString('en-IN')}`
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  const h = ms / 3_600_000, d = ms / 86_400_000
  if (h < 1)  return 'Just now'
  if (h < 24) return `${Math.floor(h)}h ago`
  if (d < 2)  return 'Yesterday'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const fade: Variants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } }
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }

/* ─── Stat card ───────────────────────────────────────── */
function StatCard({ label, value, change, up, accent }: {
  label: string; value: string; change: string; up: boolean; accent: string
}) {
  return (
    <motion.div
      variants={fade}
      className="rounded-3xl p-6 lg:p-8 relative overflow-hidden glass-panel hover-glow group flex flex-col justify-between min-h-[160px]"
    >
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: accent }} />
      <p className="font-inter text-sm font-medium tracking-wide text-slate-400 pl-2">
        {label}
      </p>
      
      <div className="mt-4 pl-2">
        <p className="font-manrope font-semibold text-3xl lg:text-4xl text-white">
          {value}
        </p>
        <div className="flex items-center gap-2 mt-3 w-fit px-2.5 py-1 rounded-lg" style={{ background: up ? 'rgba(78,222,163,0.1)' : 'rgba(248,113,113,0.1)' }}>
          {up
            ? <ArrowUpRight size={14} style={{ color: '#4edea3' }} />
            : <ArrowDownRight size={14} style={{ color: '#f87171' }} />
          }
          <span className="font-inter text-xs font-semibold" style={{ color: up ? '#4edea3' : '#f87171' }}>
            {change}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Transaction row ─────────────────────────────────── */
function TxRow({ t }: { t: Transaction }) {
  const Icon = ICON_MAP[t.icon] ?? Circle
  const credit = t.type === 'credit'
  return (
    <div className="flex items-center gap-5 py-4 px-2 hover:bg-white/5 transition-colors rounded-xl min-w-0 cursor-default">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${categoryColor(t.category)}1A` }}
      >
        <Icon size={20} style={{ color: categoryColor(t.category) }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-inter text-[15px] font-medium text-slate-100 truncate">
          {t.description}
        </p>
        <p className="font-inter text-sm text-slate-500 mt-1">
          {t.category} <span className="mx-1.5 opacity-50">•</span> {timeAgo(t.date)}
        </p>
      </div>
      <p
        className="font-manrope text-lg font-semibold flex-shrink-0 px-2"
        style={{ color: credit ? '#4edea3' : '#f8fafc' }}
      >
        {credit ? '+' : '−'}{inr(t.amount)}
      </p>
    </div>
  )
}

/* ─── main ────────────────────────────────────────────── */
export default function DashboardContent() {
  const { transactions, currentUserRole } = useFinanceStore()

  const totalBalance = 412560

  const march = transactions.filter(t => t.date >= '2026-03-01' && t.date < '2026-04-01')
  const feb   = transactions.filter(t => t.date >= '2026-02-01' && t.date < '2026-03-01')

  const marchIncome   = march.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const marchExpenses = march.filter(t => t.type === 'debit').reduce((s, t) => s + Math.abs(t.amount), 0)
  const febExpenses   = feb.filter(t => t.type === 'debit').reduce((s, t) => s + Math.abs(t.amount), 0)
  const expChange     = febExpenses > 0 ? ((marchExpenses - febExpenses) / febExpenses * 100).toFixed(1) : '0'
  const netSavings    = marchIncome - marchExpenses

  const recent = transactions.slice(0, 6)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 max-w-[1400px] mx-auto pb-10">

      {/* Role badge */}
      <motion.div variants={fade} className="flex items-center gap-3">
        {currentUserRole === 'Admin'
          ? <><div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><ShieldCheck size={18} /></div>
              <span className="font-inter text-sm font-medium text-indigo-300">
                Admin — You have full data access & edit privileges.
              </span></>
          : <><div className="p-2 rounded-xl bg-slate-500/10 text-slate-400"><Eye size={18} /></div>
              <span className="font-inter text-sm font-medium text-slate-400">
                Viewer — Read-only mode active.
              </span></>
        }
      </motion.div>

      {/* ── Stat Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Total Portfolio" value={inr(totalBalance)} change="+8.2% vs last quarter" up accent="#3b82f6" />
        <StatCard label="March Income" value={inr(marchIncome)} change="+3.1% vs Feb" up accent="#10b981" />
        <StatCard label="March Expenses" value={inr(marchExpenses)} change={`${Number(expChange) >= 0 ? '+' : ''}${expChange}% vs Feb`} up={Number(expChange) < 0} accent="#ef4444" />
        <StatCard label="Net Savings" value={inr(netSavings)} change="+5.4% vs Feb" up accent="#8b5cf6" />
      </div>

      {/* ── Balance Trend ─────────────────────────────── */}
      <motion.div
        variants={fade}
        className="rounded-3xl p-8 lg:p-10 glass-panel relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-manrope font-semibold text-2xl text-white">
              Balance Trajectory
            </h2>
            <p className="font-inter text-sm text-slate-400 mt-2">6-month savings equity growth visualization</p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
            <TrendingUp size={18} className="text-emerald-400" />
            <span className="font-inter text-sm font-semibold text-emerald-400">+69.2% All-time</span>
          </div>
        </div>
        <div className="h-[280px] overflow-x-auto pb-4">
          <div className="min-w-[500px] h-full pr-4">
            <BalanceTrendChart height={280} />
          </div>
        </div>
      </motion.div>

      {/* ── Transactions + Spending ────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Transactions */}
        <motion.div
          variants={fade}
          className="rounded-3xl p-8 glass-panel flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-manrope font-semibold text-2xl text-white">
                Recent Transactions
              </h2>
              <p className="font-inter text-sm text-slate-400 mt-2">
                Your latest financial activities.
              </p>
            </div>
            <Link href="/transactions">
              <span
                className="font-inter text-sm font-medium px-5 py-2.5 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5 whitespace-nowrap"
              >
                View All
              </span>
            </Link>
          </div>
          <div className="flex flex-col gap-2 mt-2 -mx-2 flex-1">
            {recent.map(t => <TxRow key={t.id} t={t} />)}
          </div>
        </motion.div>

        {/* Right Area */}
        <div className="flex flex-col gap-8">
          {/* Donut */}
          <motion.div
            variants={fade}
            className="rounded-3xl p-8 glass-panel flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-manrope font-semibold text-2xl text-white">Spending Analytics</h2>
              <span className="font-inter text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 border border-white/10">
                Categorical Split
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[300px]">
              <SpendingDonutChart />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
