"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getExercises } from "@/lib/firebase/firestore"
import type { Exercise, BodyPart } from "@/lib/types"

export function useExercises(filterBodyPart?: BodyPart) {
  const { user } = useAuth()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchExercises = async () => {
      setLoading(true)
      try {
        const data = await getExercises(user.uid)
        setExercises(data)
      } catch (error) {
        console.error("種目の取得に失敗しました:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [user])

  const filtered = useMemo(() => {
    if (!filterBodyPart) return exercises
    return exercises.filter((e) => e.bodyPart === filterBodyPart)
  }, [exercises, filterBodyPart])

  const grouped = useMemo(() => {
    const groups: Record<string, Exercise[]> = {}
    exercises.forEach((e) => {
      if (!groups[e.bodyPart]) groups[e.bodyPart] = []
      groups[e.bodyPart].push(e)
    })
    return groups
  }, [exercises])

  const refresh = async () => {
    if (!user) return
    const data = await getExercises(user.uid)
    setExercises(data)
  }

  return { exercises: filtered, grouped, loading, refresh }
}
