"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getAllWorkouts } from "@/lib/firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { ja } from "date-fns/locale"
import { Dumbbell, Flame } from "lucide-react"

export function MonthlySummary() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const [totalVolume, setTotalVolume] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchStats = async () => {
      const now = new Date()
      const from = format(startOfMonth(now), "yyyy-MM-dd")
      const to = format(endOfMonth(now), "yyyy-MM-dd")
      const workouts = await getAllWorkouts(user.uid, { dateFrom: from, dateTo: to })
      const dates = new Set(workouts.map((w) => w.date))
      setCount(dates.size)
      setTotalVolume(workouts.reduce((sum, w) => sum + (w.volume || 0), 0))
      setLoading(false)
    }
    fetchStats()
  }, [user])

  const monthLabel = format(new Date(), "M月", { locale: ja })

  if (loading) return null

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{monthLabel}のトレーニング</p>
            <p className="text-xl font-bold">{count}<span className="text-sm font-normal text-muted-foreground"> 回</span></p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <div className="rounded-full bg-orange-100 p-2">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{monthLabel}の総ボリューム</p>
            <p className="text-xl font-bold">{totalVolume.toLocaleString()}<span className="text-sm font-normal text-muted-foreground"> kg</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
