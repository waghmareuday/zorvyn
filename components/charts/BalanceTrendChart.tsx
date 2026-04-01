'use client'

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'

const TREND = [
  { month: 'Oct', balance: 240000 },
  { month: 'Nov', balance: 285000 },
  { month: 'Dec', balance: 310000 },
  { month: 'Jan', balance: 348000 },
  { month: 'Feb', balance: 372500 },
  { month: 'Mar', balance: 406000 },
]

function inr(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000)   return `₹${(v / 1000).toFixed(0)}k`
  return `₹${v}`
}

function Tip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0c1525',
      border: '1px solid rgba(78,222,163,0.25)',
      borderRadius: 10,
      padding: '9px 13px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#5a6478', fontSize: 10, fontFamily: 'Inter', marginBottom: 3 }}>
        {label} 2025–2026
      </p>
      <p style={{ color: '#4edea3', fontSize: 17, fontFamily: 'Manrope', fontWeight: 700 }}>
        {inr(payload[0].value)}
      </p>
    </div>
  )
}

export default function BalanceTrendChart({ height = 180 }: { height?: number }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={TREND} margin={{ top: 6, right: 16, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4edea3" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#4edea3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#3a4256', fontSize: 10, fontFamily: 'Inter' }}
            axisLine={false} tickLine={false} dy={6}
          />
          <YAxis
            tick={{ fill: '#3a4256', fontSize: 10, fontFamily: 'Inter' }}
            axisLine={false} tickLine={false}
            tickFormatter={inr}
          />
          <Tooltip content={<Tip />} cursor={{ stroke: 'rgba(78,222,163,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone" dataKey="balance"
            stroke="#4edea3" strokeWidth={2}
            fill="url(#balGrad)" dot={false}
            activeDot={{ r: 4, fill: '#4edea3', stroke: '#080e1c', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
