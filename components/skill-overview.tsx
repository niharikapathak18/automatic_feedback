"use client"

import { cn } from "@/lib/utils"

interface Skill {
  name: string
  level: number
  maxLevel: number
  color: string
}

const defaultSkills: Skill[] = [
  { name: "Essay Writing", level: 78, maxLevel: 100, color: "bg-chart-1" },
  { name: "Coding", level: 82, maxLevel: 100, color: "bg-chart-5" },
  { name: "Maths", level: 71, maxLevel: 100, color: "bg-chart-3" },
  { name: "Problem Solving", level: 58, maxLevel: 100, color: "bg-chart-4" },
]

export function SkillOverview({ skills = defaultSkills }: { skills?: Skill[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Skill Levels</h3>
      <p className="text-sm text-muted-foreground mt-0.5 mb-6">
        Your strengths and areas to improve
      </p>
      <div className="flex flex-col gap-5">
        {skills.map((skill) => (
          <div key={skill.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {skill.name}
              </span>
              <span className="text-sm font-mono font-bold text-muted-foreground">
                {skill.level}%
              </span>
            </div>
            <div className="relative h-2.5 w-full rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-all duration-700", skill.color)}
                style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
