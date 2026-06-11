"use client"

import { Sparkles, Flame, TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-accent/10 p-8">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">
            AI Learning Companion
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, Abhinav 👋
        </h1>

        <p className="mt-2 text-muted-foreground max-w-2xl">
          Continue improving with AI-powered feedback and personalized practice.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <div className="rounded-2xl border bg-background/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm">7 Day Streak</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-background/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">+12% This Week</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-background/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Focus: Coding</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button size="lg">
            Submit Assignment
          </Button>

          <Button size="lg" variant="outline">
            Practice Mode
          </Button>
        </div>
      </div>
    </div>
  )
}