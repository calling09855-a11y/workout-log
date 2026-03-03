"use client"

import { useRouter } from "next/navigation"
import { RecordForm } from "@/components/workout/RecordForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecordPage() {
  const router = useRouter()

  return (
    <div className="pb-20">
      <Card>
        <CardHeader>
          <CardTitle>トレーニング記録</CardTitle>
        </CardHeader>
        <CardContent>
          <RecordForm />
        </CardContent>
      </Card>
    </div>
  )
}
