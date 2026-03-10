"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Dumbbell, User } from "lucide-react"

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
          <Link href="/settings" className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user.displayName || user.email}
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  )
}
