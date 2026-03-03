"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Dumbbell } from "lucide-react"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Dumbbell className="h-5 w-5 text-primary" />
          WorkoutLog
        </Link>
        {user && (
          <span className="text-sm text-muted-foreground">
            {user.displayName || user.email}
          </span>
        )}
      </div>
    </header>
  )
}
