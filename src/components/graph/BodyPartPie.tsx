"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { BodyPart } from "@/lib/types"
import { BODY_PART_LABELS } from "@/lib/types"

interface BodyPartPieProps {
  data: { bodyPart: BodyPart; count: number }[]
}

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"]

export function BodyPartPie({ data }: BodyPartPieProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        データがありません
      </div>
    )
  }

  const chartData = data.map((d) => ({
    name: BODY_PART_LABELS[d.bodyPart],
    value: d.count,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value}回`, "トレーニング数"]} />
      </PieChart>
    </ResponsiveContainer>
  )
}
