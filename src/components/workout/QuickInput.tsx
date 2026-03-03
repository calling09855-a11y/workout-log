"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useExercises } from "@/lib/hooks/useExercises"
import { getLatestWorkout, addWorkout } from "@/lib/firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import type { Exercise, WorkoutLog } from "@/lib/types"
import { format } from "date-fns"

function toHalfWidth(str: string): string {
  return str.replace(/[０-９．]/g, (s) => {
    if (s === "．") return "."
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  })
}

interface QuickInputProps {
  onSaved?: () => void
}

export function QuickInput({ onSaved }: QuickInputProps) {
  const { user } = useAuth()
  const { exercises } = useExercises()
  const { toast } = useToast()
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [lastRecord, setLastRecord] = useState<WorkoutLog | null>(null)
  const [weightKg, setWeightKg] = useState("")
  const [reps, setReps] = useState("")
  const [sets, setSets] = useState("3")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const frequentExercises = exercises.slice(0, 6)

  const handleSelect = async (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setIsOpen(true)
    if (user) {
      const last = await getLatestWorkout(user.uid, exercise.id)
      setLastRecord(last)
      if (last) {
        setWeightKg(String(last.weightKg))
        setReps(String(last.reps))
        setSets(String(last.sets))
      } else {
        setWeightKg("")
        setReps("")
        setSets("3")
      }
    }
  }

  const handleSave = async () => {
    if (!user || !selectedExercise) return

    const w = parseFloat(toHalfWidth(weightKg))
    const r = parseInt(toHalfWidth(reps), 10)
    const s = parseInt(toHalfWidth(sets), 10)

    if (isNaN(w) || isNaN(r) || isNaN(s) || w < 0 || r < 1 || s < 1) {
      toast({
        title: "入力エラー",
        description: "正しい値を入力してください",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await addWorkout(user.uid, {
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        date: format(new Date(), "yyyy-MM-dd"),
        weightKg: w,
        reps: r,
        sets: s,
      })
      toast({
        title: "記録を保存しました",
        description: `${selectedExercise.name}: ${w}kg × ${r}回 × ${s}セット`,
      })
      setIsOpen(false)
      onSaved?.()
    } catch {
      toast({
        title: "保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {frequentExercises.map((exercise) => (
          <Button
            key={exercise.id}
            variant="outline"
            className="h-auto py-3 text-xs"
            onClick={() => handleSelect(exercise)}
          >
            {exercise.name}
          </Button>
        ))}
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>{selectedExercise?.name}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            {lastRecord && (
              <p className="text-sm text-muted-foreground">
                前回: {lastRecord.weightKg}kg × {lastRecord.reps}回 × {lastRecord.sets}セット
              </p>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">重量 (kg)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">回数</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">セット</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="w-full h-12 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "保存中..." : "記録を保存"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
