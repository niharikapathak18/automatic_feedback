"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Topic {
  name: string
  score: number
  change: number
  submissions: number
}

const defaultTopics: Topic[] = [
  { name: "Argumentative Writing", score: 85, change: 8, submissions: 6 },
  { name: "Binary Search & Sorting", score: 78, change: 12, submissions: 4 },
  { name: "Calculus Integration", score: 64, change: -3, submissions: 5 },
  { name: "Literary Analysis", score: 91, change: 5, submissions: 3 },
  { name: "Recursion & DP", score: 72, change: 15, submissions: 4 },
  { name: "Linear Algebra", score: 58, change: 2, submissions: 2 },
]

export function TopicBreakdown({ topics = defaultTopics }: { topics?: Topic[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">
        Topic Performance
      </h3>
      <p className="text-sm text-muted-foreground mt-0.5 mb-5">
        How you stack up across subjects
      </p>
      <div className="flex flex-col gap-3">
        {topics.map((topic) => (
          <div
            key={topic.name}
            className="flex items-center gap-4 rounded-xl border border-border p-3 hover:border-primary/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {topic.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {topic.submissions} submissions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold",
                  topic.change > 0 && "text-success",
                  topic.change < 0 && "text-destructive",
                  topic.change === 0 && "text-muted-foreground"
                )}
              >
                {topic.change > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : topic.change < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {topic.change > 0 ? "+" : ""}
                {topic.change}%
              </div>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold",
                  topic.score >= 80 && "bg-success/10 text-success",
                  topic.score >= 60 &&
                    topic.score < 80 &&
                    "bg-warning/10 text-warning",
                  topic.score < 60 && "bg-destructive/10 text-destructive"
                )}
              >
                {topic.score}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
