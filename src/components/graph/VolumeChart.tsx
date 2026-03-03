"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { WorkoutLog } from "@/lib/types"

interface VolumeChartProps {
  data: WorkoutLog[]
}

export function VolumeChart({ data }: VolumeChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        データがありません
      </div>
    )
  }

  // 日付ごとにボリュームを合計
  const dateMap = new Map<string, number>()
  data.forEach((d) => {
    const current = dateMap.get(d.date) || 0
    dateMap.set(d.date, current + (d.volume || 0))
  })

  const chartData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, volume]) => ({
      date: date.slice(5),
      volume: Math.round(volume),
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} unit="kg" />
        <Tooltip formatter={(value: number) => [`${value.toLocaleString()} kg`, "ボリューム"]} />
        <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
