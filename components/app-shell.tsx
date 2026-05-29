"use client"

import React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import {
  LayoutDashboard,
  Upload,
  TrendingUp,
  Dumbbell,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/submit", label: "Submit", icon: Upload },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/practice", label: "Practice", icon: Dumbbell },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.replace("/")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-6">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            BrainDrop
          </span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {user && (
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs uppercase tracking-[.18em] text-muted-foreground">
              Signed in as
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="mt-6 self-start rounded-xl"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-card/90 backdrop-blur-xl px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">BrainDrop</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <nav
            className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      <main className="flex-1 md:pt-0 pt-16 overflow-auto">
        <div className="mx-auto max-w-6xl p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
