"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Dumbbell, History, BarChart3, Camera, Bot, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/record", label: "記録", icon: Dumbbell },
  { href: "/history", label: "履歴", icon: History },
  { href: "/graph", label: "グラフ", icon: BarChart3 },
  { href: "/body", label: "写真", icon: Camera },
  { href: "/ai", label: "AI", icon: Bot },
  { href: "/settings", label: "設定", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:bg-muted/30">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
