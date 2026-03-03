"use client"

import { AuthGuard } from "./AuthGuard"
import { Header } from "./Header"
import { BottomNav } from "./BottomNav"
import { Sidebar } from "./Sidebar"
import { Toaster } from "@/components/ui/toaster"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 container max-w-2xl mx-auto p-4">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
      <Toaster />
    </AuthGuard>
  )
}
