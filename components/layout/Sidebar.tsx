'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Settings,
  Shield,
  X
} from 'lucide-react'
import { useFinanceStore } from '@/store/useFinanceStore'

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Overview' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/insights', icon: Lightbulb, label: 'Insights' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const { currentUserRole } = useFinanceStore()

  return (
    <aside
      className="flex flex-col h-[100dvh] flex-shrink-0 glass-panel border-y-0 border-l-0 bg-[#020617]/90"
      style={{ width: 260 }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-5 h-[76px] flex-shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #4d8eff 0%, #a78bfa 100%)' }}
          >
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="font-manrope font-bold text-[15px] leading-tight text-white tracking-wide">
              Luminous Ledger
            </p>
            <p className="font-inter text-[11px] text-slate-500 font-medium">
              Private Vault
            </p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <X size={20} />
        </button>
      </div>

      <p className="px-5 pt-8 pb-3 font-inter text-[10px] font-bold tracking-[0.15em] uppercase text-slate-500">
        Main Navigation
      </p>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className="block" onClick={onClose}>
              <motion.div
                whileHover={{ x: active ? 0 : 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-colors"
                style={{
                  background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute left-0 inset-y-2 w-[3px] rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                )}
                <Icon
                  size={18}
                  style={{ color: active ? '#3b82f6' : '#64748b', flexShrink: 0 }}
                />
                <span
                  className="font-inter text-[14px] tracking-wide"
                  style={{
                    color: active ? '#ffffff' : '#94a3b8',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      <div className="m-5 p-4 rounded-2xl glass-panel hover:bg-white/5 transition-colors cursor-pointer border shadow-lg border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-manrope font-bold text-[13px] flex-shrink-0 shadow-inner"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}
          >
            AM
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-inter text-sm font-semibold truncate text-white">
              Arjun Mehta
            </p>
            <p className="font-inter text-xs text-slate-400 font-medium">
              {currentUserRole}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
      </div>
    </aside>
  )
}
