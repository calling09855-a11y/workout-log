"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useExercises } from "@/lib/hooks/useExercises"
import { getAllWorkouts, getBodyPartStats } from "@/lib/firebase/firestore"
import { WeightChart } from "@/components/graph/WeightChart"
import { VolumeChart } from "@/components/graph/VolumeChart"
import { BodyPartPie } from "@/components/graph/BodyPartPie"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import type { WorkoutLog, DateRange, BodyPart } from "@/lib/types"
import { DATE_RANGE_LABELS, BODY_PART_LABELS } from "@/lib/types"
import { subDays, subMonths, subYears, format } from "date-fns"

function getDateFrom(range: DateRange): string | undefined {
  const now = new Date()
  switch (range) {
    case "1w": return format(subDays(now, 7), "yyyy-MM-dd")
    case "1m": return format(subMonths(now, 1), "yyyy-MM-dd")
    case "3m": return format(subMonths(now, 3), "yyyy-MM-dd")
    case "6m": return format(subMonths(now, 6), "yyyy-MM-dd")
    case "1y": return format(subYears(now, 1), "yyyy-MM-dd")
    case "all": return undefined
  }
}

export default function GraphPage() {
  const { user } = useAuth()
  const { exercises } = useExercises()
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange>("3m")

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      setLoading(true)
      const dateFrom = getDateFrom(dateRange)
      const data = await getAllWorkouts(user.uid, {
        dateFrom,
        exerciseId: selectedExerciseId === "all" ? undefined : selectedExerciseId,
      })
      setWorkouts(data)
      setLoading(false)
    }
    fetchData()
  }, [user, dateRange, selectedExerciseId])

  const exerciseNames = useMemo(() => {
    const map = new Map<string, string>()
    exercises.forEach((e) => map.set(e.id, e.name))
    return map
  }, [exercises])

  const bodyPartData = useMemo(() => {
    const countMap = new Map<BodyPart, number>()
    workouts.forEach((w) => {
      const exercise = exercises.find((e) => e.id === w.exerciseId)
      if (exercise) {
        const current = countMap.get(exercise.bodyPart) || 0
        countMap.set(exercise.bodyPart, current + 1)
      }
    })
    return Array.from(countMap.entries()).map(([bodyPart, count]) => ({ bodyPart, count }))
  }, [workouts, exercises])

  return (
    <div className="space-y-4 pb-20">
      <h1 className="text-xl font-bold">グラフ</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">種目</Label>
          <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {exercises.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">期間</Label>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map((range) => (
                <SelectItem key={range} value={range}>
                  {DATE_RANGE_LABELS[range]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <Tabs defaultValue="weight">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="weight">重量推移</TabsTrigger>
            <TabsTrigger value="volume">ボリューム</TabsTrigger>
            <TabsTrigger value="balance">部位バランス</TabsTrigger>
          </TabsList>
          <TabsContent value="weight">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">重量推移</CardTitle>
              </CardHeader>
              <CardContent>
                <WeightChart data={workouts} exerciseNames={exerciseNames} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="volume">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">ボリューム推移</CardTitle>
              </CardHeader>
              <CardContent>
                <VolumeChart data={workouts} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="balance">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">部位バランス</CardTitle>
              </CardHeader>
              <CardContent>
                <BodyPartPie data={bodyPartData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
