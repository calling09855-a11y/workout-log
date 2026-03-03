"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useExercises } from "@/lib/hooks/useExercises"
import { getWorkouts, deleteWorkout, getAllWorkouts } from "@/lib/firebase/firestore"
import { RecordCard } from "@/components/workout/RecordCard"
import { ExerciseSelect } from "@/components/workout/ExerciseSelect"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import type { WorkoutLog, WorkoutFilter } from "@/lib/types"
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { Search } from "lucide-react"

export default function HistoryPage() {
  const { user } = useAuth()
  const { exercises } = useExercises()
  const { toast } = useToast()
  const [records, setRecords] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [personalBests, setPersonalBests] = useState<Set<string>>(new Set())

  const [filterExerciseId, setFilterExerciseId] = useState("")
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [keyword, setKeyword] = useState("")

  const observerRef = useRef<HTMLDivElement>(null)

  const buildFilter = useCallback((): WorkoutFilter => {
    const f: WorkoutFilter = {}
    if (filterExerciseId) f.exerciseId = filterExerciseId
    if (filterDateFrom) f.dateFrom = filterDateFrom
    if (filterDateTo) f.dateTo = filterDateTo
    if (keyword) f.keyword = keyword
    return f
  }, [filterExerciseId, filterDateFrom, filterDateTo, keyword])

  const fetchRecords = useCallback(async (reset = false) => {
    if (!user) return
    setLoading(true)
    try {
      const filter = buildFilter()
      const result = await getWorkouts(
        user.uid,
        filter,
        20,
        reset ? undefined : lastDoc || undefined
      )
      let filteredWorkouts = result.workouts
      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredWorkouts = filteredWorkouts.filter(
          (w) =>
            w.exerciseName?.toLowerCase().includes(kw) ||
            w.memo?.toLowerCase().includes(kw)
        )
      }
      setRecords((prev) => (reset ? filteredWorkouts : [...prev, ...filteredWorkouts]))
      setLastDoc(result.lastDoc)
      setHasMore(result.workouts.length === 20)
    } catch {
      toast({ title: "読み込みに失敗しました", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [user, buildFilter, lastDoc, keyword, toast])

  // 自己ベスト計算
  useEffect(() => {
    if (!user) return
    const calcPB = async () => {
      const all = await getAllWorkouts(user.uid)
      const maxByExercise = new Map<string, { id: string; weight: number; volume: number }>()
      all.forEach((w) => {
        const current = maxByExercise.get(w.exerciseId)
        if (!current || w.weightKg > current.weight || w.volume > current.volume) {
          maxByExercise.set(w.exerciseId, { id: w.id, weight: w.weightKg, volume: w.volume })
        }
      })
      setPersonalBests(new Set(Array.from(maxByExercise.values()).map((v) => v.id)))
    }
    calcPB()
  }, [user, records])

  // 初回読み込み＋フィルタ変更時
  useEffect(() => {
    setLastDoc(null)
    fetchRecords(true)
  }, [filterExerciseId, filterDateFrom, filterDateTo]) // eslint-disable-line react-hooks/exhaustive-deps

  // 無限スクロール
  useEffect(() => {
    if (!observerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchRecords(false)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchRecords])

  const handleDelete = async (recordId: string) => {
    if (!user) return
    try {
      await deleteWorkout(user.uid, recordId)
      setRecords((prev) => prev.filter((r) => r.id !== recordId))
      toast({ title: "記録を削除しました" })
    } catch {
      toast({ title: "削除に失敗しました", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4 pb-20">
      <h1 className="text-xl font-bold">トレーニング履歴</h1>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="キーワード検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">種目でフィルタ</Label>
          <ExerciseSelect
            exercises={exercises}
            value={filterExerciseId}
            onValueChange={setFilterExerciseId}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">開始日</Label>
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">終了日</Label>
            <Input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {records.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            isPersonalBest={personalBests.has(record.id)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {!loading && records.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>記録がありません</p>
          <p className="text-sm mt-1">トレーニングを記録してみましょう</p>
        </div>
      )}

      <div ref={observerRef} className="h-4" />
    </div>
  )
}
