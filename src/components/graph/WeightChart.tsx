"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { WorkoutLog } from "@/lib/types"

interface WeightChartProps {
  data: WorkoutLog[]
  exerciseNames?: Map<string, string>
}

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"]

export function WeightChart({ data, exerciseNames }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        データがありません
      </div>
    )
  }

  // 種目ごとにグループ化
  const exerciseIds = Array.from(new Set(data.map((d) => d.exerciseId)))

  // 日付ごとに整理
  const dateMap = new Map<string, Record<string, number>>()
  data.forEach((d) => {
    if (!dateMap.has(d.date)) dateMap.set(d.date, {})
    const entry = dateMap.get(d.date)!
    const current = entry[d.exerciseId]
    if (!current || d.weightKg > current) {
      entry[d.exerciseId] = d.weightKg
    }
  })

  const chartData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date: date.slice(5), // MM-DD
      ...values,
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} unit="kg" />
        <Tooltip
          formatter={(value: number, name: string) => {
            const label = exerciseNames?.get(name) || name
            return [`${value} kg`, label]
          }}
        />
        {exerciseIds.length > 1 && (
          <Legend
            formatter={(value: string) => exerciseNames?.get(value) || value}
          />
        )}
        {exerciseIds.map((id, i) => (
          <Line
            key={id}
            type="monotone"
            dataKey={id}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
            name={id}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
