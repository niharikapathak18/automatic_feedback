"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, Calculator } from "lucide-react"

interface ActivityItem {
  id: string
  type: "essay" | "coding" | "maths"
  title: string
  score: number
  date: string
  status: "reviewed" | "pending"
}

const iconMap = {
  essay: FileText,
  coding: Code,
  maths: Calculator,
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Submissions</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Your latest assignment feedback</p>
      </div>
      <div className="px-6 pb-6 flex flex-col gap-3">
        {items.map((item) => {
          const Icon = iconMap[item.type]
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:bg-secondary/50"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  item.type === "essay" && "bg-chart-1/10 text-chart-1",
                  item.type === "coding" && "bg-chart-5/10 text-chart-5",
                  item.type === "maths" && "bg-chart-3/10 text-chart-3"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={item.status === "reviewed" ? "default" : "secondary"}
                  className={cn(
                    "rounded-lg text-xs",
                    item.status === "reviewed" && "bg-success text-success-foreground"
                  )}
                >
                  {item.status === "reviewed" ? "Reviewed" : "Pending"}
                </Badge>
                <div className="flex flex-col items-end">
                  <span
                    className={cn(
                      "text-lg font-bold",
                      item.score >= 80 && "text-success",
                      item.score >= 60 && item.score < 80 && "text-warning",
                      item.score < 60 && "text-destructive"
                    )}
                  >
                    {item.score}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    score
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
