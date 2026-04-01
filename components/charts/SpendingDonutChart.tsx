'use client'

import { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { useFinanceStore, categoryColor, Category } from '@/store/useFinanceStore'

function inr(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}k`
  return `₹${v.toLocaleString('en-IN')}`
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="glass-panel p-4 rounded-xl shadow-2xl backdrop-blur-3xl min-w-[150px] border border-white/10 relative z-50">
        <p className="font-inter text-sm font-semibold text-slate-300 mb-1">{data.name}</p>
        <p className="font-manrope text-lg font-bold" style={{ color: data.fill }}>{inr(data.value)}</p>
      </div>
    )
  }
  return null
}

export default function SpendingDonutChart() {
  const { transactions } = useFinanceStore()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const rawData = transactions
    .filter(t => t.type === 'debit')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      return acc
    }, {})

  const data = Object.entries(rawData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({
      name,
      value,
      fill: categoryColor(name as Category)
    }))

  const total = data.reduce((s, d) => s + d.value, 0)

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500 font-inter text-sm">No spending data</div>
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Chart */}
      <div className="relative flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={125}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                  style={{
                    transition: 'opacity 0.2s',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-inter text-sm font-medium text-slate-400">Total Spend</span>
          <span className="font-manrope text-2xl font-bold text-white mt-1">{inr(total)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-8 pb-2">
        {data.map((entry, index) => (
          <div 
            key={entry.name} 
            className="flex items-center gap-3 transition-opacity duration-200"
            style={{ opacity: activeIndex === null || activeIndex === index ? 1 : 0.4 }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.fill }} />
            <span className="font-inter text-sm text-slate-300 truncate w-full" title={entry.name}>
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
