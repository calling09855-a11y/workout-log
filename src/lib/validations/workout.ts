import { z } from "zod"

export const workoutSchema = z.object({
  exerciseId: z.string().min(1, "種目を選択してください"),
  date: z.string().min(1, "日付を入力してください"),
  weightKg: z
    .number({ invalid_type_error: "重量を入力してください" })
    .min(0, "重量は0以上で入力してください"),
  reps: z
    .number({ invalid_type_error: "回数を入力してください" })
    .int("回数は整数で入力してください")
    .min(1, "回数は1以上で入力してください"),
  sets: z
    .number({ invalid_type_error: "セット数を入力してください" })
    .int("セット数は整数で入力してください")
    .min(1, "セット数は1以上で入力してください"),
  condition: z.number().min(1).max(5).optional(),
  memo: z.string().optional(),
})

export type WorkoutSchemaType = z.infer<typeof workoutSchema>
