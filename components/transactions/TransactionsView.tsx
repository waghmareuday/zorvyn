'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, SlidersHorizontal, Trash2, Pencil,
  ChevronLeft, ChevronRight, X, Check,
  Utensils, Home, ShoppingBag, Car, Zap,
  Briefcase, HeartPulse, Laptop, Monitor,
  BookOpen, ShoppingCart, TrendingUp, Circle,
  ArrowUpDown, ArrowUp, ArrowDown, Download,
} from 'lucide-react'
import {
  useFinanceStore, Transaction, Category,
  categoryColor,
  INCOME_CATEGORIES, EXPENSE_CATEGORIES,
  selectFilteredTransactions,
} from '@/store/useFinanceStore'

/* ─── helpers ─────────────────────────────────────────── */
const ICON_MAP: Record<string, React.ElementType> = {
  utensils: Utensils, home: Home, 'shopping-bag': ShoppingBag,
  car: Car, zap: Zap, briefcase: Briefcase, 'heart-pulse': HeartPulse,
  laptop: Laptop, monitor: Monitor, 'book-open': BookOpen,
  'shopping-cart': ShoppingCart, 'trending-up': TrendingUp, circle: Circle,
}

function inr(v: number) {
  const n = Math.abs(v)
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

const ALL_CATS: Category[] = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
const ACCOUNTS = ['HDFC Savings', 'ICICI Savings', 'Axis Credit Card', 'Zerodha Demat']
const PAGE_SIZE = 12

/* ─── Category badge ──────────────────────────────────── */
function CatBadge({ cat }: { cat: Category }) {
  const color = categoryColor(cat)
  return (
    <span
      className="inline-flex items-center font-inter text-xs font-semibold px-3 py-1.5 rounded-lg bg-opacity-10 w-fit"
      style={{ background: `${color}1A`, color }}
    >
      {cat}
    </span>
  )
}

/* ─── Add/Edit Modal (more spacious) ──────────────────── */
interface ModalProps {
  initial?: Transaction
  onSave: (t: Omit<Transaction, 'id' | 'icon'>) => void
  onClose: () => void
}

function TxModal({ initial, onSave, onClose }: ModalProps) {
  const [form, setForm] = useState({
    description: initial?.description ?? '',
    amount: initial ? Math.abs(initial.amount).toString() : '',
    type: (initial?.type ?? 'debit') as 'credit' | 'debit',
    category: (initial?.category ?? 'Food & Dining') as Category,
    date: initial?.date ?? new Date().toISOString().split('T')[0],
    account: initial?.account ?? 'HDFC Savings',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const cats = form.type === 'credit' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function validate() {
    const e: Record<string, string> = {}
    if (!form.description.trim()) e.description = 'Required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Valid positive amount required'
    if (!form.date) e.date = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    onSave({
      description: form.description.trim(),
      amount: form.type === 'debit' ? -Number(form.amount) : Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      account: form.account,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-slate-950/80"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 20 }}
        className="w-full max-w-2xl rounded-[32px] p-8 md:p-12 glass-panel relative overflow-y-auto max-h-full"
      >
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
          <h2 className="font-manrope font-semibold text-3xl text-white">
            {initial ? 'Edit Transaction' : 'Record Transaction'}
          </h2>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Description */}
          <div>
            <label className="font-inter text-sm font-medium text-slate-400 block mb-3">Transaction Description</label>
            <input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Weekly Groceries"
              className="w-full rounded-2xl px-5 py-4 font-inter text-base outline-none bg-slate-900/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {errors.description && <p className="text-rose-400 text-sm mt-2">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Amount */}
            <div>
              <label className="font-inter text-sm font-medium text-slate-400 block mb-3">Amount (₹)</label>
              <input
                type="number" min="1" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full rounded-2xl px-5 py-4 font-manrope font-semibold text-xl outline-none bg-slate-900/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {errors.amount && <p className="text-rose-400 text-sm mt-2">{errors.amount}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="font-inter text-sm font-medium text-slate-400 block mb-3">Transaction Flow</label>
              <div className="flex rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 p-1">
                {(['debit', 'credit'] as const).map(tp => (
                  <button
                    key={tp}
                    onClick={() => setForm(f => ({ ...f, type: tp, category: tp === 'credit' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] }))}
                    className={`flex-1 py-3.5 font-inter text-sm font-semibold capitalize rounded-xl transition-all ${
                      form.type === tp 
                      ? (tp === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400')
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {tp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div>
              <label className="font-inter text-sm font-medium text-slate-400 block mb-3">Category Assignment</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                className="w-full rounded-2xl px-5 py-4 font-inter text-base outline-none bg-slate-900/50 border border-white/10 text-white focus:border-blue-500 transition-all cursor-pointer"
              >
                {cats.map(c => <option key={c} value={c} className="bg-slate-900 py-2">{c}</option>)}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="font-inter text-sm font-medium text-slate-400 block mb-3">Transaction Date</label>
              <input
                type="date" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full rounded-2xl px-5 py-4 font-inter text-base outline-none bg-slate-900/50 border border-white/10 text-white focus:border-blue-500 transition-all relative z-20"
                style={{ colorScheme: 'dark' }}
              />
              {errors.date && <p className="text-rose-400 text-sm mt-2">{errors.date}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-12 pt-8 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-inter text-base font-medium text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="flex-1 py-4 rounded-2xl font-inter text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1"
          >
            {initial ? 'Save Changes' : 'Record Transaction'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Main View ───────────────────────────────────────── */
export default function TransactionsView() {
  const { transactions, currentUserRole, filters, setFilter, resetFilters, addTransaction, updateTransaction, deleteTransaction } = useFinanceStore()
  const isAdmin = currentUserRole === 'Admin'

  const [modal, setModal] = useState<'add' | Transaction | null>(null)
  const [page, setPage] = useState(1)

  const filtered = selectFilteredTransactions(transactions, filters)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function sort(key: 'date' | 'amount') {
    const cur = filters.sortBy
    const asc = `${key}-asc` as const
    const desc = `${key}-desc` as const
    setFilter({ sortBy: cur === desc ? asc : desc })
    setPage(1)
  }

  function exportCSV() {
    const headers = ['Date', 'Description', 'Category', 'Account', 'Type', 'Amount']
    const rows = filtered.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      `"${t.account.replace(/"/g, '""')}"`,
      t.type,
      t.amount
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `luminous_ledger_transactions_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="space-y-8 max-w-[1600px] mx-auto pb-12 overflow-hidden px-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-manrope font-semibold text-3xl lg:text-4xl text-white">Transactions Directory</h1>
            <p className="font-inter text-base tracking-wide text-slate-400 mt-3">
              Reviewing {filtered.length} entries of {transactions.length} total across all connected accounts.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-inter text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
            >
              <Download size={18} /> Export CSV
            </button>
            {isAdmin && (
              <button
                onClick={() => setModal('add')}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl font-inter text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Plus size={20} /> Add Record
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-3xl p-6 glass-panel flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-[300px] flex items-center gap-4 bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-3.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all">
            <Search size={20} className="text-slate-500" />
            <input
              value={filters.search}
              onChange={e => { setFilter({ search: e.target.value }); setPage(1) }}
              placeholder="Search by description or merchant..."
              className="flex-1 bg-transparent text-white font-inter text-base outline-none placeholder:text-slate-500"
            />
            {filters.search && (
              <button onClick={() => setFilter({ search: '' })} className="text-slate-400 hover:text-white transition-colors p-1">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex p-1.5 rounded-2xl bg-slate-900/50 border border-white/10 shrink-0">
              {(['all', 'credit', 'debit'] as const).map(tp => (
                <button
                  key={tp}
                  onClick={() => { setFilter({ type: tp }); setPage(1) }}
                  className={`px-6 py-2.5 rounded-xl font-inter text-sm font-semibold capitalize transition-all ${
                    filters.type === tp ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tp === 'all' ? 'All Origins' : tp === 'credit' ? 'Income' : 'Expenses'}
                </button>
              ))}
            </div>

            <div className="relative shrink-0">
              <select
                value={filters.category}
                onChange={e => { setFilter({ category: e.target.value as Category | 'all' }); setPage(1) }}
                className="appearance-none rounded-2xl pl-5 pr-12 py-3.5 h-full font-inter text-sm font-medium outline-none bg-slate-900/50 border border-white/10 text-white cursor-pointer focus:border-blue-500/50"
              >
                <option value="all">All Categories</option>
                {ALL_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-slate-500">
                <SlidersHorizontal size={18} />
              </div>
            </div>

            {(filters.search || filters.type !== 'all' || filters.category !== 'all') && (
              <button
                onClick={() => { resetFilters(); setPage(1) }}
                className="px-6 py-3.5 rounded-2xl font-inter text-sm font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors shrink-0"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_2fr_1.5fr_1fr_1fr] lg:grid-cols-[1fr_3fr_1.5fr_1fr_1fr_100px] gap-4 px-8 py-5 border-b border-white/5 bg-white/5 font-inter text-[13px] font-semibold tracking-wider text-slate-400 uppercase">
            <button onClick={() => sort('date')} className="flex items-center gap-2 hover:text-white transition-colors text-left">
              Date & Time
            </button>
            <span>Transaction Details</span>
            <span>Category</span>
            <span>Flow Indicator</span>
            <button onClick={() => sort('amount')} className="flex items-center justify-end gap-2 hover:text-white transition-colors">
              Values
            </button>
            {isAdmin && <span className="hidden lg:block text-right">Edit Options</span>}
          </div>

          <div className="flex flex-col">
            {slice.length === 0 ? (
              <div className="py-32 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-900/50 flex items-center justify-center mb-6 border border-white/5">
                  <Search size={32} className="text-slate-500" />
                </div>
                <h3 className="font-manrope text-2xl font-semibold text-white mb-3">No matching records</h3>
                <p className="font-inter text-base text-slate-400 max-w-md">There are no transactions that match your current active filters. Try clearing them to see all records.</p>
                <button
                  onClick={resetFilters}
                  className="mt-8 px-8 py-3.5 rounded-2xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                >
                  Clear search parameters
                </button>
              </div>
            ) : (
              slice.map(t => {
                const Icon = ICON_MAP[t.icon] ?? Circle
                const credit = t.type === 'credit'
                const color = categoryColor(t.category)

                return (
                  <div
                    key={t.id}
                    className="group grid grid-cols-[1fr_2fr_1.5fr_1fr_1fr] lg:grid-cols-[1fr_3fr_1.5fr_1fr_1fr_100px] gap-4 px-8 py-6 items-center border-b border-white/5 hover:bg-white-[0.02] hover:bg-[#ffffff05] transition-colors min-w-0"
                  >
                    {/* Date */}
                    <div className="font-inter min-w-0 pr-2">
                      <p className="text-sm font-medium text-white whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 whitespace-nowrap">
                        {new Date(t.date).getFullYear()}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="flex items-center gap-5 min-w-0 pr-4">
                      <div className="hidden sm:flex w-12 h-12 rounded-2xl items-center justify-center flex-shrink-0" style={{ background: `${color}1A` }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-inter text-base font-semibold text-white truncate">{t.description}</p>
                        <p className="font-inter text-sm text-slate-400 mt-1 truncate">{t.account}</p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="min-w-0 flex items-center">
                      <CatBadge cat={t.category} />
                    </div>

                    {/* Flow */}
                    <div className="min-w-0 flex items-center">
                      <span className={`px-3 py-1.5 rounded-lg font-inter text-xs font-semibold capitalize ${credit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {t.type}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-end min-w-0 pr-2 lg:pr-0">
                      <span className={`font-manrope text-lg font-semibold truncate ${credit ? 'text-emerald-400' : 'text-white'}`}>
                        {credit ? '+' : '−'}{inr(t.amount)}
                      </span>
                    </div>

                    {/* Actions */}
                    {isAdmin && (
                      <div className="hidden lg:flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal(t)}
                          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-6 bg-black/10">
              <p className="font-inter text-sm font-medium text-slate-400">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-xl bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <TxModal
            initial={modal === 'add' ? undefined : modal}
            onSave={(t) => modal === 'add' ? addTransaction(t) : updateTransaction((modal as Transaction).id, t)}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
