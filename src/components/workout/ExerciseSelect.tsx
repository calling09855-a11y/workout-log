"use client"

import { useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BODY_PART_LABELS, type BodyPart, type Exercise } from "@/lib/types"

interface ExerciseSelectProps {
  exercises: Exercise[]
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export function ExerciseSelect({
  exercises,
  value,
  onValueChange,
  disabled,
}: ExerciseSelectProps) {
  const grouped = useMemo(() => {
    const groups: Partial<Record<BodyPart, Exercise[]>> = {}
    exercises.forEach((e) => {
      if (!groups[e.bodyPart]) groups[e.bodyPart] = []
      groups[e.bodyPart]!.push(e)
    })
    return groups
  }, [exercises])

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="種目を選択" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(grouped) as BodyPart[]).map((bodyPart) => (
          <SelectGroup key={bodyPart}>
            <SelectLabel>{BODY_PART_LABELS[bodyPart]}</SelectLabel>
            {grouped[bodyPart]!.map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.id}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
