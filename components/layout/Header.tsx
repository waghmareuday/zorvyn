'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Menu, Moon, Sun } from 'lucide-react'
import { useFinanceStore } from '@/store/useFinanceStore'

export default function Header({ title, onMenuClick }: { title: string, onMenuClick: () => void }) {
  const { currentUserRole, toggleUserRole, theme, toggleTheme } = useFinanceStore()
  const isAdmin = currentUserRole === 'Admin'
  
  const [bellOpen, setBellOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme')
    } else {
      document.body.classList.remove('light-theme')
    }
  }, [theme])

  function markRead() {
    setHasUnread(false)
    setBellOpen(false)
  }

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-[76px] flex-shrink-0 z-10 glass-panel border-x-0 border-t-0 sticky top-0 bg-[#020617]/80 backdrop-blur-2xl"
    >
      {/* Left side: Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="font-manrope font-bold text-lg md:text-xl tracking-wide text-white">
            {title}
          </h1>
          <p className="hidden sm:block font-inter text-xs text-slate-400 mt-0.5 font-medium">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right side: Tools */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border focus-within:border-blue-500/50 transition-colors">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input
            placeholder="Search vault..."
            className="bg-transparent outline-none font-inter text-sm w-40 placeholder:text-slate-500 text-slate-200"
          />
        </div>

        {/* Role toggle */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl glass-panel shadow-sm">
          <span className={`font-inter text-xs font-semibold transition-colors ${isAdmin ? 'text-blue-400' : 'text-slate-500'}`}>
            Admin
          </span>
          <motion.button
            onClick={toggleUserRole}
            className="relative w-10 h-5 rounded-full focus:outline-none flex-shrink-0"
            style={{
              background: isAdmin ? 'linear-gradient(90deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-md"
              style={{
                left: isAdmin ? '2px' : 'calc(100% - 18px)',
              }}
            />
          </motion.button>
          <span className={`font-inter text-xs font-semibold transition-colors ${!isAdmin ? 'text-blue-400' : 'text-slate-500'}`}>
            Viewer
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 glass-panel hover:bg-white/5 transition-colors text-slate-300 hover:text-white"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setBellOpen(!bellOpen)
              setHasUnread(false)
            }}
            className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 glass-panel hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <Bell size={18} className="text-slate-300 group-hover:text-white transition-colors" />
            {hasUnread && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </button>
          
          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-14 w-64 p-4 rounded-2xl glass-panel shadow-2xl border border-white/10 z-50 bg-[#020617]/95"
              >
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <span className="font-manrope text-sm font-semibold text-white">Notifications</span>
                  <span className="font-inter text-[10px] text-blue-400 font-medium cursor-pointer" onClick={markRead}>Mark read</span>
                </div>
                <div className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-default">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-inter text-[13px] font-medium text-slate-200">System updated successfully</p>
                    <p className="font-inter text-[11px] text-slate-500 mt-0.5">Just now</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Avatar (to access role toggle if hidden on narrow screens) */}
        <div 
          className="sm:hidden w-10 h-10 rounded-xl flex items-center justify-center font-manrope font-bold text-sm bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg cursor-pointer ml-1"
          onClick={toggleUserRole}
          title={`Currently: ${currentUserRole}. Tap to swap.`}
        >
          {isAdmin ? 'A' : 'V'}
        </div>
      </div>
    </header>
  )
}
