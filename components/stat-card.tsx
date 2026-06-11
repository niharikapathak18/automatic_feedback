import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {trend && trendValue && (
              <span
                className={cn(
                  "text-xs font-semibold",
                  trend === "up" && "text-success",
                  trend === "down" && "text-destructive",
                  trend === "neutral" && "text-muted-foreground"
                )}
              >
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                {trendValue}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          </div>
        </div>
        <div className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        bg-gradient-to-br
        from-primary/20
        to-accent-20
        text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
