"use client"
type Activity = {
  id: string
  title: string
  score: number
  type: "essay" | "coding" | "maths"
  date: string
  status: "reviewed" | "pending"
}
import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { RecentActivity } from "@/components/recent-activity"
import { SkillOverview } from "@/components/skill-overview"
import { StreakCard } from "@/components/streak-card"
import { FileCheck, TrendingUp, Target, Clock } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { useProgress } from "@/hooks/use-progress"

export default function DashboardPage() {
  const { user, isReady } = useAuth()
  const { progress, isLoaded } = useProgress()

  if (!isReady || !isLoaded) return null
  if (!user) return null

  // ✅ REAL DATA
  const recentActivity = progress.recentActivity as Activity[]
  const skills = progress.skills

  // ✅ COMPUTED STATS (not stored)
  const totalSubmissions = recentActivity.length

  const avgScore =
    totalSubmissions === 0
      ? 0
      : Math.round(
          recentActivity.reduce((acc, item) => acc + item.score, 0) /
            totalSubmissions
        )

  const getAvg = (p: any) => (p.essays + p.coding + p.maths) / 3

const improvement =
  progress.progressData.length >= 2
    ? Math.round(
        getAvg(progress.progressData.at(-1)) -
        getAvg(progress.progressData.at(-2))
      )
    : 0

  const studyTime = totalSubmissions * 1 // simple logic for now

  return (
    <AppShell>
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Hey {user.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your personalized progress summary.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Submissions"
            value={String(totalSubmissions)}
            subtitle="total"
            icon={FileCheck}
            trend="neutral"
            trendValue="—"
          />
          <StatCard
            title="Avg Score"
            value={String(avgScore)}
            subtitle="out of 100"
            icon={Target}
            trend="neutral"
            trendValue="—"
          />
          <StatCard
            title="Improvement"
            value={String(improvement)}
            subtitle="recent change"
            icon={TrendingUp}
            trend="neutral"
            trendValue="—"
          />
          <StatCard
            title="Study Time"
            value={String(studyTime)}
            subtitle="hrs (est.)"
            icon={Clock}
            trend="neutral"
            trendValue="—"
          />
        </div>

        {/* Activity + Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <RecentActivity items={recentActivity} />
          </div>
          <div className="flex flex-col gap-6">
            <StreakCard streakDays={progress.streakDays} />
            <SkillOverview skills={skills} />
          </div>
        </div>

      </div>
    </AppShell>
  )
}