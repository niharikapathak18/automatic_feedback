"use client"

import { cn } from "@/lib/utils"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function generateHeatmapData() {
  const data: number[][] = []
  for (let w = 0; w < 12; w++) {
    const week: number[] = []
    for (let d = 0; d < 7; d++) {
      const isWeekend = d >= 5
      const base = isWeekend ? 0.2 : 0.5
      const rand = Math.random()
      if (rand < base * 0.5) week.push(0)
      else if (rand < base) week.push(1)
      else if (rand < base + 0.25) week.push(2)
      else week.push(3)
    }
    data.push(week)
  }
  return data
}

const defaultHeatmapData = generateHeatmapData()

function getIntensityClass(level: number) {
  switch (level) {
    case 0:
      return "bg-secondary"
    case 1:
      return "bg-primary/20"
    case 2:
      return "bg-primary/50"
    case 3:
      return "bg-primary"
    default:
      return "bg-secondary"
  }
}

export function WeeklyHeatmap({ heatmapData = defaultHeatmapData }: { heatmapData?: number[][] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">
        Activity Heatmap
      </h3>
      <p className="text-sm text-muted-foreground mt-0.5 mb-5">
        Your study sessions over the last 12 weeks
      </p>

      <div className="flex gap-2">
        <div className="flex flex-col gap-1 pt-6">
          {days.map((day) => (
            <div
              key={day}
              className="h-4 flex items-center text-[10px] text-muted-foreground font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-1">
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                <span className="text-[9px] text-muted-foreground text-center h-5 flex items-end justify-center">
                  {wi % 3 === 0 ? `W${wi + 1}` : ""}
                </span>
                {week.map((level, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={cn(
                      "h-4 w-4 rounded-sm transition-colors",
                      getIntensityClass(level)
                    )}
                    title={`${days[di]}, Week ${wi + 1}: ${level} sessions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {[0, 1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn("h-3 w-3 rounded-sm", getIntensityClass(level))}
          />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>
    </div>
  )
}
