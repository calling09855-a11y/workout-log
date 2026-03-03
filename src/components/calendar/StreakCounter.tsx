"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getAllWorkouts } from "@/lib/firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Trophy } from "lucide-react"
import { differenceInDays, parseISO } from "date-fns"

export function StreakCounter() {
  const { user } = useAuth()
  const [currentStreak, setCurrentStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  useEffect(() => {
    if (!user) return
    const calcStreak = async () => {
      const workouts = await getAllWorkouts(user.uid)
      const uniqueDates = Array.from(new Set(workouts.map((w) => w.date))).sort().reverse()

      if (uniqueDates.length === 0) {
        setCurrentStreak(0)
        setMaxStreak(0)
        return
      }

      // 現在のストリーク
      let streak = 1
      const today = new Date()
      const latestDate = parseISO(uniqueDates[0])
      const daysSinceLatest = differenceInDays(today, latestDate)

      if (daysSinceLatest > 1) {
        setCurrentStreak(0)
      } else {
        for (let i = 1; i < uniqueDates.length; i++) {
          const current = parseISO(uniqueDates[i - 1])
          const prev = parseISO(uniqueDates[i])
          const diff = differenceInDays(current, prev)
          if (diff <= 1) {
            streak++
          } else {
            break
          }
        }
        setCurrentStreak(streak)
      }

      // 最長ストリーク
      let maxS = 1
      let tempS = 1
      const sorted = [...uniqueDates].sort()
      for (let i = 1; i < sorted.length; i++) {
        const prev = parseISO(sorted[i - 1])
        const current = parseISO(sorted[i])
        const diff = differenceInDays(current, prev)
        if (diff <= 1) {
          tempS++
          maxS = Math.max(maxS, tempS)
        } else {
          tempS = 1
        }
      }
      setMaxStreak(maxS)
    }
    calcStreak()
  }, [user])

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <div className="rounded-full bg-orange-100 p-2">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">連続日数</p>
            <p className="text-xl font-bold">
              {currentStreak}
              <span className="text-sm font-normal text-muted-foreground"> 日</span>
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <div className="rounded-full bg-yellow-100 p-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">最長記録</p>
            <p className="text-xl font-bold">
              {maxStreak}
              <span className="text-sm font-normal text-muted-foreground"> 日</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
