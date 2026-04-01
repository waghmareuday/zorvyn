'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserRole = 'Admin' | 'Viewer'
export type TransactionType = 'credit' | 'debit'
export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Investment Returns'
  | 'Food & Dining'
  | 'Groceries'
  | 'Shopping'
  | 'Transport'
  | 'Housing'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Utilities'
  | 'Other'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: Category
  type: TransactionType
  description: string
  account: string
  icon: string
}

export function categoryIcon(cat: Category): string {
  const m: Record<Category, string> = {
    Salary: 'briefcase',
    Freelance: 'laptop',
    'Investment Returns': 'trending-up',
    'Food & Dining': 'utensils',
    Groceries: 'shopping-cart',
    Shopping: 'shopping-bag',
    Transport: 'car',
    Housing: 'home',
    Entertainment: 'monitor',
    Healthcare: 'heart-pulse',
    Education: 'book-open',
    Utilities: 'zap',
    Other: 'circle',
  }
  return m[cat] ?? 'circle'
}

export function categoryColor(cat: Category): string {
  const m: Record<Category, string> = {
    Salary: '#4edea3',
    Freelance: '#a78bfa',
    'Investment Returns': '#34d399',
    'Food & Dining': '#fb923c',
    Groceries: '#22c55e',
    Shopping: '#8b5cf6',
    Transport: '#60a5fa',
    Housing: '#4d8eff',
    Entertainment: '#ec4899',
    Healthcare: '#f43f5e',
    Education: '#06b6d4',
    Utilities: '#eab308',
    Other: '#94a3b8',
  }
  return m[cat] ?? '#94a3b8'
}

export const INCOME_CATEGORIES: Category[] = ['Salary', 'Freelance', 'Investment Returns']
export const EXPENSE_CATEGORIES: Category[] = [
  'Food & Dining', 'Groceries', 'Shopping', 'Transport', 'Housing',
  'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other',
]

const seed: Transaction[] = [
  // ── April 2026 ────────────────────────────────────────────────────────────
  { id: 'txn-001', date: '2026-04-01', amount: 125000, category: 'Salary', type: 'credit', description: 'April Salary — Tata Consultancy Services', account: 'HDFC Savings', icon: 'briefcase' },
  { id: 'txn-002', date: '2026-04-01', amount: -38000, category: 'Housing', type: 'debit', description: 'Rent — Prestige Elysian, Whitefield', account: 'HDFC Savings', icon: 'home' },
  { id: 'txn-003', date: '2026-04-01', amount: -680, category: 'Food & Dining', type: 'debit', description: 'Zomato — Biryani Blues, Indiranagar', account: 'Axis Credit Card', icon: 'utensils' },
  { id: 'txn-004', date: '2026-04-02', amount: -2890, category: 'Groceries', type: 'debit', description: 'BigBasket — Monthly Grocery Order', account: 'HDFC Savings', icon: 'shopping-cart' },

  // ── March 2026 ────────────────────────────────────────────────────────────
  { id: 'txn-005', date: '2026-03-31', amount: 18500, category: 'Freelance', type: 'credit', description: 'UI/UX Project — Razorpay Design System', account: 'ICICI Savings', icon: 'laptop' },
  { id: 'txn-006', date: '2026-03-30', amount: -420, category: 'Food & Dining', type: 'debit', description: 'Swiggy — Pizza Hut, Koramangala', account: 'Axis Credit Card', icon: 'utensils' },
  { id: 'txn-007', date: '2026-03-29', amount: -780, category: 'Transport', type: 'debit', description: 'BPCL Petrol — Domlur Station', account: 'HDFC Savings', icon: 'car' },
  { id: 'txn-008', date: '2026-03-28', amount: -4599, category: 'Shopping', type: 'debit', description: 'Myntra — Ethnic Fashion Sale', account: 'Axis Credit Card', icon: 'shopping-bag' },
  { id: 'txn-009', date: '2026-03-27', amount: -1200, category: 'Groceries', type: 'debit', description: 'DMart — Weekly Essentials', account: 'HDFC Savings', icon: 'shopping-cart' },
  { id: 'txn-010', date: '2026-03-26', amount: 5200, category: 'Investment Returns', type: 'credit', description: 'Dividend — HDFC Bank Ltd', account: 'Zerodha Demat', icon: 'trending-up' },
  { id: 'txn-011', date: '2026-03-25', amount: -2200, category: 'Food & Dining', type: 'debit', description: 'The Fatty Bao — Team Dinner', account: 'Axis Credit Card', icon: 'utensils' },
  { id: 'txn-012', date: '2026-03-24', amount: -210, category: 'Transport', type: 'debit', description: 'Ola Cab — Airport Drop, T2', account: 'Axis Credit Card', icon: 'car' },
  { id: 'txn-013', date: '2026-03-22', amount: -1650, category: 'Utilities', type: 'debit', description: 'BESCOM — March Electricity Bill', account: 'HDFC Savings', icon: 'zap' },
  { id: 'txn-014', date: '2026-03-20', amount: -9499, category: 'Shopping', type: 'debit', description: 'Croma — boAt Airdopes 311', account: 'Axis Credit Card', icon: 'shopping-bag' },
  { id: 'txn-015', date: '2026-03-18', amount: -649, category: 'Entertainment', type: 'debit', description: 'Netflix India — Premium Plan', account: 'Axis Credit Card', icon: 'monitor' },
  { id: 'txn-016', date: '2026-03-18', amount: -299, category: 'Entertainment', type: 'debit', description: 'Spotify India — Individual Plan', account: 'Axis Credit Card', icon: 'monitor' },
  { id: 'txn-017', date: '2026-03-15', amount: 125000, category: 'Salary', type: 'credit', description: 'March Salary — Tata Consultancy Services', account: 'HDFC Savings', icon: 'briefcase' },
  { id: 'txn-018', date: '2026-03-14', amount: -5999, category: 'Education', type: 'debit', description: 'Udemy — Full-Stack Web Dev Course', account: 'Axis Credit Card', icon: 'book-open' },
  { id: 'txn-019', date: '2026-03-12', amount: -1100, category: 'Healthcare', type: 'debit', description: 'Apollo Pharmacy — Monthly Medicines', account: 'HDFC Savings', icon: 'heart-pulse' },
  { id: 'txn-020', date: '2026-03-10', amount: -1599, category: 'Shopping', type: 'debit', description: 'Amazon India — USB-C Hub & Accessories', account: 'Axis Credit Card', icon: 'shopping-bag' },
  { id: 'txn-021', date: '2026-03-08', amount: -199, category: 'Utilities', type: 'debit', description: 'Jio — Monthly Recharge (89GB)', account: 'HDFC Savings', icon: 'zap' },
  { id: 'txn-022', date: '2026-03-05', amount: -3200, category: 'Healthcare', type: 'debit', description: 'Manipal Hospital — Doctor Consultation', account: 'HDFC Savings', icon: 'heart-pulse' },
  { id: 'txn-023', date: '2026-03-04', amount: -480, category: 'Transport', type: 'debit', description: 'Indian Oil — Petrol Quarter Tank', account: 'HDFC Savings', icon: 'car' },
  { id: 'txn-024', date: '2026-03-02', amount: 8000, category: 'Freelance', type: 'credit', description: 'Logo Design — Gupta & Sons Pvt. Ltd', account: 'ICICI Savings', icon: 'laptop' },

  // ── February 2026 ─────────────────────────────────────────────────────────
  { id: 'txn-025', date: '2026-02-28', amount: -35000, category: 'Housing', type: 'debit', description: 'Rent — Prestige Elysian, Whitefield', account: 'HDFC Savings', icon: 'home' },
  { id: 'txn-026', date: '2026-02-25', amount: -2100, category: 'Groceries', type: 'debit', description: 'Reliance Fresh — Monthly Stock', account: 'HDFC Savings', icon: 'shopping-cart' },
  { id: 'txn-027', date: '2026-02-22', amount: -890, category: 'Food & Dining', type: 'debit', description: 'Swiggy Instamart — Weekend Order', account: 'Axis Credit Card', icon: 'utensils' },
  { id: 'txn-028', date: '2026-02-20', amount: -1200, category: 'Utilities', type: 'debit', description: 'BESCOM — February Electricity Bill', account: 'HDFC Savings', icon: 'zap' },
  { id: 'txn-029', date: '2026-02-18', amount: -3890, category: 'Shopping', type: 'debit', description: 'Flipkart Big Billion — Formal Shirts', account: 'Axis Credit Card', icon: 'shopping-bag' },
  { id: 'txn-030', date: '2026-02-15', amount: 125000, category: 'Salary', type: 'credit', description: 'February Salary — Tata Consultancy Services', account: 'HDFC Savings', icon: 'briefcase' },
  { id: 'txn-031', date: '2026-02-14', amount: -499, category: 'Entertainment', type: 'debit', description: 'Disney+ Hotstar — Annual Subscription', account: 'Axis Credit Card', icon: 'monitor' },
  { id: 'txn-032', date: '2026-02-10', amount: 3800, category: 'Investment Returns', type: 'credit', description: 'Mutual Fund Dividend — ICICI Pru Bluechip', account: 'Zerodha Demat', icon: 'trending-up' },
  { id: 'txn-033', date: '2026-02-08', amount: -620, category: 'Transport', type: 'debit', description: 'BPCL Petrol — Domlur Station', account: 'HDFC Savings', icon: 'car' },
  { id: 'txn-034', date: '2026-02-05', amount: -1800, category: 'Food & Dining', type: 'debit', description: 'Dialogue in the Dark — Valentine\'s Dinner', account: 'Axis Credit Card', icon: 'utensils' },
  { id: 'txn-035', date: '2026-02-01', amount: 12000, category: 'Freelance', type: 'credit', description: 'Brand Deck — Sharma Exports, Surat', account: 'ICICI Savings', icon: 'laptop' },
]

interface Filters {
  search: string
  type: 'all' | 'credit' | 'debit'
  category: Category | 'all'
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
}

interface FinanceStore {
  transactions: Transaction[]
  currentUserRole: UserRole
  filters: Filters
  theme: 'dark' | 'light'
  // Actions
  toggleTheme: () => void
  toggleUserRole: () => void
  addTransaction: (t: Omit<Transaction, 'id' | 'icon'>) => void
  updateTransaction: (id: string, t: Partial<Omit<Transaction, 'id' | 'icon'>>) => void
  deleteTransaction: (id: string) => void
  setFilter: (f: Partial<Filters>) => void
  resetFilters: () => void
}

const defaultFilters: Filters = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date-desc',
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: seed,
      currentUserRole: 'Admin',
      filters: defaultFilters,
      theme: 'dark',

      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      toggleUserRole: () =>
        set((s) => ({ currentUserRole: s.currentUserRole === 'Admin' ? 'Viewer' : 'Admin' })),

      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            {
              ...t,
              id: `txn-${Date.now()}`,
              icon: categoryIcon(t.category),
            },
            ...s.transactions,
          ],
        })),

      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id
              ? { ...t, ...patch, icon: categoryIcon(patch.category ?? t.category) }
              : t
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      setFilter: (f) =>
        set((s) => ({ filters: { ...s.filters, ...f } })),

      resetFilters: () => set(() => ({ filters: defaultFilters })),
    }),
    {
      name: 'luminous-ledger-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        transactions: s.transactions,
        currentUserRole: s.currentUserRole,
        theme: s.theme,
      }),
    }
  )
)

// ── Selectors ─────────────────────────────────────────────────────────────────

export function selectFilteredTransactions(
  transactions: Transaction[],
  filters: Filters
): Transaction[] {
  let out = transactions.filter((t) => {
    if (filters.type !== 'all' && t.type !== filters.type) return false
    if (filters.category !== 'all' && t.category !== filters.category) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false
    }
    return true
  })
  switch (filters.sortBy) {
    case 'date-asc':  out = out.sort((a, b) => a.date.localeCompare(b.date)); break
    case 'amount-desc': out = out.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)); break
    case 'amount-asc':  out = out.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount)); break
    default: out = out.sort((a, b) => b.date.localeCompare(a.date))
  }
  return out
}
