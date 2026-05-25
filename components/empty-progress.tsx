"use client"

import { BookOpen, TrendingUp, Zap } from "lucide-react"

interface EmptyProgressProps {
  onDemo?: () => void
}

export function EmptyProgress({ onDemo }: EmptyProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16 px-4 text-center">
      {/* Illustration */}
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <TrendingUp className="h-12 w-12 text-primary/60" />
        </div>
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-chart-3/20">
          <Zap className="h-4 w-4 text-chart-3" />
        </div>
        <div className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-chart-1/20">
          <BookOpen className="h-4 w-4 text-chart-1" />
        </div>
      </div>

      {/* Copy */}
      <div className="max-w-sm">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Start your progress journey
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Submit your first assignment to unlock your personalized dashboard — charts, streaks, achievements, and skill breakdown all update automatically as you learn.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          "📈 Score Trends",
          "🔥 Streak Tracking",
          "🏆 Achievements",
          "🗓️ Activity Heatmap",
          "💡 Skill Levels",
        ].map((label) => (
          <span
            key={label}
            className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>

      {onDemo && (
        <button
          onClick={onDemo}
          className="rounded-xl border border-primary/30 bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/15 transition-all"
        >
          Load demo data to preview
        </button>
      )}
    </div>
  )
}
