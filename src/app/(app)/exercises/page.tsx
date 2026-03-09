"use client"

import { useState, useMemo } from "react"
import { EXERCISE_GROUPS } from "@/lib/constants/exercises"
import { cn } from "@/lib/utils"

const FILTER_OPTIONS = [
  { id: "all", label: "すべて" },
  { id: "chest", label: "胸" },
  { id: "back", label: "背中" },
  { id: "shoulder", label: "肩" },
  { id: "bicep", label: "二頭筋" },
  { id: "tricep", label: "三頭筋" },
  { id: "forearm", label: "前腕" },
  { id: "leg", label: "脚" },
]

export default function ExercisesPage() {
  const [filter, setFilter] = useState("all")

  const filteredGroups = useMemo(() => {
    if (filter === "all") return EXERCISE_GROUPS
    return EXERCISE_GROUPS.filter((g) => g.id === filter)
  }, [filter])

  const stats = useMemo(() => {
    const exercises = filteredGroups.flatMap((g) => g.exercises)
    return {
      total: exercises.length,
      basic: exercises.filter((e) => e.level === "basic").length,
      advanced: exercises.filter((e) => e.level === "advanced").length,
    }
  }, [filteredGroups])

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="mb-6 border-b border-border pb-6">
        <p className="text-[11px] tracking-[0.3em] text-primary font-medium uppercase mb-2">
          STRENGTH TRAINING REFERENCE
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none mb-4">
          筋トレ<span className="text-primary">種目</span>
          <br />チャート
        </h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-sm bg-sky-400" />
            基本種目
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-sm bg-orange-500" />
            応用種目
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-6 p-4 bg-card border border-border rounded-lg flex-wrap">
        <div>
          <div className="text-3xl font-extrabold text-primary leading-none">{stats.total}</div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Total</div>
        </div>
        <div className="w-px bg-border self-stretch" />
        <div>
          <div className="text-3xl font-extrabold text-sky-400 leading-none">{stats.basic}</div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase">基本種目</div>
        </div>
        <div className="w-px bg-border self-stretch" />
        <div>
          <div className="text-3xl font-extrabold text-orange-500 leading-none">{stats.advanced}</div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase">応用種目</div>
        </div>
        <div className="w-px bg-border self-stretch" />
        <div>
          <div className="text-3xl font-extrabold text-primary leading-none">7</div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase">部位</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={cn(
              "px-4 py-2 rounded text-sm font-medium border transition-all",
              filter === opt.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Exercise Groups */}
      <div className="space-y-8">
        {filteredGroups.map((group) => (
          <div key={group.id}>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl w-9 text-center">{group.icon}</span>
              <span className="text-lg font-bold tracking-wider">{group.title}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              <span className="text-[11px] text-muted-foreground tracking-widest">
                {group.exercises.length} EXERCISES
              </span>
            </div>

            {/* Exercise Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {group.exercises.map((ex) => (
                <div
                  key={ex.name}
                  className={cn(
                    "relative bg-card border border-border rounded-md p-3 pl-5 transition-all hover:-translate-y-0.5 hover:shadow-lg",
                    ex.level === "basic"
                      ? "hover:border-sky-400/30"
                      : "hover:border-orange-500/30"
                  )}
                >
                  {/* Left accent bar */}
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-md",
                      ex.level === "basic" ? "bg-sky-400" : "bg-orange-500"
                    )}
                  />
                  <div className="text-sm font-medium leading-snug mb-1">{ex.name}</div>
                  <div className="text-[10px] text-muted-foreground tracking-wide mb-2">
                    {ex.nameEn}
                  </div>
                  <span
                    className={cn(
                      "inline-block text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded border uppercase",
                      ex.level === "basic"
                        ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                        : "text-orange-500 bg-orange-500/10 border-orange-500/25"
                    )}
                  >
                    {ex.level === "basic" ? "基本" : "応用"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
