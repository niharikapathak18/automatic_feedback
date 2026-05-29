"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface ProgressPoint {
  week: string
  essays: number
  coding: number
  maths: number
}

const defaultData: ProgressPoint[] = [
  { week: "Week 1", essays: 62, coding: 55, maths: 48 },
  { week: "Week 2", essays: 68, coding: 60, maths: 52 },
  { week: "Week 3", essays: 71, coding: 65, maths: 58 },
  { week: "Week 4", essays: 74, coding: 72, maths: 61 },
  { week: "Week 5", essays: 78, coding: 74, maths: 64 },
  { week: "Week 6", essays: 82, coding: 78, maths: 71 },
  { week: "Week 7", essays: 85, coding: 82, maths: 75 },
  { week: "Week 8", essays: 88, coding: 85, maths: 78 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function ProgressChart({ data }: { data?: ProgressPoint[] }) {
  const chartData = data ?? defaultData

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Score Trends
          </h3>
          <p className="text-sm text-muted-foreground">
            Your average scores over the past 8 weeks
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-chart-1" />
            <span className="text-xs text-muted-foreground">Essays</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-chart-5" />
            <span className="text-xs text-muted-foreground">Coding</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-chart-3" />
            <span className="text-xs text-muted-foreground">Maths</span>
          </div>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="essayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 80%, 55%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(262, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="codingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 70%, 55%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(200, 70%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mathsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(170, 60%, 45%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(170, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              domain={[40, 100]}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="essays"
              stroke="hsl(262, 80%, 55%)"
              fill="url(#essayGrad)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="coding"
              stroke="hsl(200, 70%, 55%)"
              fill="url(#codingGrad)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="maths"
              stroke="hsl(170, 60%, 45%)"
              fill="url(#mathsGrad)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
