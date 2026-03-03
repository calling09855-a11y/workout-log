"use client"

import { useEffect, useState } from "react"
import { DayPicker } from "react-day-picker"
import { useAuth } from "@/contexts/AuthContext"
import { getWorkoutDates, getAllWorkouts } from "@/lib/firebase/firestore"
import { RecordCard } from "@/components/workout/RecordCard"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { WorkoutLog } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { ja } from "date-fns/locale"
import "react-day-picker/dist/style.css"

export function TrainingCalendar() {
  const { user } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [trainingDates, setTrainingDates] = useState<Date[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [dayRecords, setDayRecords] = useState<WorkoutLog[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchDates = async () => {
      const month = format(currentMonth, "yyyy-MM")
      const dates = await getWorkoutDates(user.uid, month)
      setTrainingDates(dates.map((d) => parseISO(d)))
    }
    fetchDates()
  }, [user, currentMonth])

  const handleDayClick = async (day: Date) => {
    if (!user) return
    setSelectedDate(day)
    const dateStr = format(day, "yyyy-MM-dd")
    const workouts = await getAllWorkouts(user.uid, {
      dateFrom: dateStr,
      dateTo: dateStr,
    })
    setDayRecords(workouts)
    setIsSheetOpen(true)
  }

  const modifiers = {
    training: trainingDates,
  }

  const modifiersStyles = {
    training: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      borderRadius: "50%",
    },
  }

  return (
    <>
      <div className="flex justify-center">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onDayClick={handleDayClick}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          locale={ja}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="border rounded-lg p-3"
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-xl max-h-[70vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedDate
                ? format(selectedDate, "M月d日 (E)", { locale: ja })
                : ""}
              の記録
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-2 py-4">
            {dayRecords.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                この日の記録はありません
              </p>
            ) : (
              dayRecords.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
