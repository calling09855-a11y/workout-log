"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/AuthContext"
import { useExercises } from "@/lib/hooks/useExercises"
import { addWorkout, getLatestWorkout } from "@/lib/firebase/firestore"
import { workoutSchema, type WorkoutSchemaType } from "@/lib/validations/workout"
import { ExerciseSelect } from "./ExerciseSelect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CONDITION_LABELS, CONDITION_EMOJI, type Condition } from "@/lib/types"
import { format } from "date-fns"

interface RecordFormProps {
  onSaved?: () => void
  defaultExerciseId?: string
  defaultValues?: Partial<WorkoutSchemaType>
}

function toHalfWidth(str: string): string {
  return str.replace(/[０-９．]/g, (s) => {
    if (s === "．") return "."
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  })
}

export function RecordForm({ onSaved, defaultExerciseId, defaultValues }: RecordFormProps) {
  const { user } = useAuth()
  const { exercises, loading: exercisesLoading } = useExercises()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastRecord, setLastRecord] = useState<{
    weightKg: number
    reps: number
    sets: number
  } | null>(null)

  const today = format(new Date(), "yyyy-MM-dd")

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WorkoutSchemaType>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      exerciseId: defaultExerciseId || "",
      date: today,
      weightKg: undefined,
      reps: undefined,
      sets: 3,
      condition: undefined,
      memo: "",
      ...defaultValues,
    },
  })

  const watchExerciseId = watch("exerciseId")
  const watchWeight = watch("weightKg")
  const watchReps = watch("reps")
  const watchSets = watch("sets")

  const volume =
    watchWeight && watchReps && watchSets
      ? Math.round(watchWeight * watchReps * watchSets * 10) / 10
      : 0

  useEffect(() => {
    if (!user || !watchExerciseId) return
    const fetchLast = async () => {
      const last = await getLatestWorkout(user.uid, watchExerciseId)
      if (last) {
        setLastRecord({
          weightKg: last.weightKg,
          reps: last.reps,
          sets: last.sets,
        })
      } else {
        setLastRecord(null)
      }
    }
    fetchLast()
  }, [user, watchExerciseId])

  const onSubmit = async (data: WorkoutSchemaType) => {
    if (!user) return
    setIsSubmitting(true)
    try {
      const exercise = exercises.find((e) => e.id === data.exerciseId)
      await addWorkout(user.uid, {
        ...data,
        condition: data.condition as 1 | 2 | 3 | 4 | 5 | undefined,
        exerciseName: exercise?.name || "",
      })
      toast({
        title: "記録を保存しました",
        description: `${exercise?.name}: ${data.weightKg}kg × ${data.reps}回 × ${data.sets}セット`,
      })
      reset({
        exerciseId: "",
        date: today,
        weightKg: undefined,
        reps: undefined,
        sets: 3,
        condition: undefined,
        memo: "",
      })
      setLastRecord(null)
      onSaved?.()
    } catch {
      toast({
        title: "保存に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>日付</Label>
        <Input type="date" {...register("date")} />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>種目</Label>
        <Controller
          control={control}
          name="exerciseId"
          render={({ field }) => (
            <ExerciseSelect
              exercises={exercises}
              value={field.value}
              onValueChange={field.onChange}
              disabled={exercisesLoading}
            />
          )}
        />
        {errors.exerciseId && (
          <p className="text-sm text-destructive">{errors.exerciseId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>重量 (kg)</Label>
          <Input
            type="text"
            inputMode="decimal"
            placeholder={lastRecord ? `${lastRecord.weightKg}` : "0"}
            {...register("weightKg", {
              setValueAs: (v: string) => {
                if (!v) return undefined
                const num = parseFloat(toHalfWidth(String(v)))
                return isNaN(num) ? undefined : Math.round(num * 10) / 10
              },
            })}
          />
          {errors.weightKg && (
            <p className="text-sm text-destructive">{errors.weightKg.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>回数</Label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder={lastRecord ? `${lastRecord.reps}` : "0"}
            {...register("reps", {
              setValueAs: (v: string) => {
                if (!v) return undefined
                const num = parseInt(toHalfWidth(String(v)), 10)
                return isNaN(num) ? undefined : num
              },
            })}
          />
          {errors.reps && (
            <p className="text-sm text-destructive">{errors.reps.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>セット数</Label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="3"
            {...register("sets", {
              setValueAs: (v: string) => {
                if (!v) return undefined
                const num = parseInt(toHalfWidth(String(v)), 10)
                return isNaN(num) ? undefined : num
              },
            })}
          />
          {errors.sets && (
            <p className="text-sm text-destructive">{errors.sets.message}</p>
          )}
        </div>
      </div>

      {volume > 0 && (
        <Card className="bg-primary/5">
          <CardContent className="py-3 text-center">
            <span className="text-sm text-muted-foreground">ボリューム: </span>
            <span className="text-lg font-bold text-primary">{volume.toLocaleString()} kg</span>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label>コンディション（任意）</Label>
        <Controller
          control={control}
          name="condition"
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {([5, 4, 3, 2, 1] as Condition[]).map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {CONDITION_EMOJI[c]} {CONDITION_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>メモ（任意）</Label>
        <Input
          type="text"
          placeholder="フォーム意識、体調など"
          {...register("memo")}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? "保存中..." : "記録を保存"}
      </Button>
    </form>
  )
}
