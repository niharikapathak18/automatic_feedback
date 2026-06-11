"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Flame } from "lucide-react"

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"]

const DEFAULT_STREAK_DAYS = [false, false, false, false, false, false, false]

interface StreakCardProps {
  streakDays?: boolean[]
}

export function StreakCard({ streakDays = DEFAULT_STREAK_DAYS }: StreakCardProps) {
  const currentStreak = streakDays.filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
          >
            <Flame className="h-5 w-5 text-accent" />
          </motion.div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {currentStreak} Day Streak
          </h3>
          <p className="text-xs text-muted-foreground">Keep the momentum going</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        {DAY_LABELS.map((day, i) => (
          <div key={`${day}-${i}`} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all",
                streakDays[i]
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {streakDays[i] ? (
                <Flame className="h-4 w-4" />
              ) : (
                <span className="text-xs">{day}</span>
              )}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
