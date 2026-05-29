"use client"

import { cn } from "@/lib/utils"
import {
  Flame,
  Star,
  Zap,
  Trophy,
  BookOpen,
  Target,
  Rocket,
  Crown,
} from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  color: string
}

const iconMap: Record<string, typeof Flame> = {
  "1": Rocket,
  "2": Flame,
  "3": Star,
  "4": Zap,
  "5": BookOpen,
  "6": Target,
  "7": Trophy,
  "8": Crown,
}

const defaultAchievements: Achievement[] = [
  {
    id: "1",
    name: "First Submit",
    description: "Submit your first assignment",
    unlocked: true,
    color: "text-chart-1",
  },
  {
    id: "2",
    name: "Hot Streak",
    description: "5 day submission streak",
    unlocked: true,
    color: "text-accent",
  },
  {
    id: "3",
    name: "A+ Student",
    description: "Score 95+ on any assignment",
    unlocked: true,
    color: "text-chart-4",
  },
  {
    id: "4",
    name: "Speed Demon",
    description: "Submit 3 assignments in one day",
    unlocked: true,
    color: "text-chart-5",
  },
  {
    id: "5",
    name: "Bookworm",
    description: "Complete 10 essay reviews",
    unlocked: false,
    color: "text-chart-3",
  },
  {
    id: "6",
    name: "Sharpshooter",
    description: "Score 90+ three times in a row",
    unlocked: false,
    color: "text-success",
  },
  {
    id: "7",
    name: "Champion",
    description: "Reach 80+ avg across all subjects",
    unlocked: false,
    color: "text-chart-4",
  },
  {
    id: "8",
    name: "Top Tier",
    description: "Achieve mastery in any skill",
    unlocked: false,
    color: "text-primary",
  },
]

export function AchievementGrid({ achievements = defaultAchievements }: { achievements?: Achievement[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
      <p className="text-sm text-muted-foreground mt-0.5 mb-5">
        Collect them all as you level up
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {achievements.map((ach) => {
          const Icon = iconMap[ach.id]
          return (
            <div
              key={ach.id}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                ach.unlocked
                  ? "border-primary/20 bg-primary/5 hover:border-primary/40 hover:glow-primary"
                  : "border-border bg-secondary/30 opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  ach.unlocked ? "bg-card" : "bg-secondary"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    ach.unlocked ? ach.color : "text-muted-foreground"
                  )}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {ach.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                  {ach.description}
                </p>
              </div>
              {ach.unlocked && (
                <span className="text-[10px] font-semibold text-success uppercase tracking-wider">
                  Unlocked
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
