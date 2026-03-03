"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User } from "firebase/auth"
import { signUp as fbSignUp, signIn as fbSignIn, signOut as fbSignOut, onAuthChange } from "@/lib/firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<User>
  signIn: (email: string, password: string) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, displayName: string) => {
    const user = await fbSignUp(email, password, displayName)
    return user
  }

  const signIn = async (email: string, password: string) => {
    const user = await fbSignIn(email, password)
    return user
  }

  const signOut = async () => {
    await fbSignOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
