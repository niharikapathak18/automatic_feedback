"use client"

import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { RecentActivity } from "@/components/recent-activity"
import { SkillOverview } from "@/components/skill-overview"
import { StreakCard } from "@/components/streak-card"
import { FileCheck, TrendingUp, Target, Clock } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { LoginPanel } from "@/components/login-panel"

export default function DashboardPage() {
  const { user, isReady, login } = useUser()

  if (!isReady) return null

  if (!user) {
    return <LoginPanel onLogin={login} />
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Hey {user.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your personalized progress summary for this week.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Submissions"
            value={user.stats.submissions}
            subtitle="this month"
            icon={FileCheck}
            trend="up"
            trendValue={user.stats.improvement}
          />
          <StatCard
            title="Avg Score"
            value={user.stats.avgScore}
            subtitle="out of 100"
            icon={Target}
            trend="up"
            trendValue="vs last month"
          />
          <StatCard
            title="Improvement"
            value={user.stats.improvement}
            subtitle="since last period"
            icon={TrendingUp}
            trend="up"
            trendValue="steady"
          />
          <StatCard
            title="Study Time"
            value={user.stats.studyTime}
            subtitle="this week"
            icon={Clock}
            trend="neutral"
            trendValue="same"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <RecentActivity items={user.recentActivity} />
          </div>
          <div className="flex flex-col gap-6">
            <StreakCard />
            <SkillOverview skills={user.skills} />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
