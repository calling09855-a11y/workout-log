"use client"

import { MonthlySummary } from "@/components/workout/MonthlySummary"
import { QuickInput } from "@/components/workout/QuickInput"
import { TrainingCalendar } from "@/components/calendar/TrainingCalendar"
import { StreakCounter } from "@/components/calendar/StreakCounter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="space-y-6 pb-20">
      <MonthlySummary />

      <StreakCounter />

      <TrainingCalendar />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">クイック入力</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickInput />
        </CardContent>
      </Card>
    </div>
  )
}
