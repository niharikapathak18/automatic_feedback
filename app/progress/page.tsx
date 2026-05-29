"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useProgress } from "@/hooks/use-progress"

import { AppShell } from "@/components/app-shell"
import { ProgressChart } from "@/components/progress-chart"
import { SkillOverview } from "@/components/skill-overview"
import { AchievementGrid } from "@/components/achievement-grid"
import { WeeklyHeatmap } from "@/components/weekly-heatmap"
import { RecentActivity } from "@/components/recent-activity"
import { StreakCard } from "@/components/streak-card"
import { EmptyProgress } from "@/components/empty-progress"
import { SubmitAssignmentModal } from "@/components/submit-assignment-modal"

import { LogOut, Plus } from "lucide-react"

function ProgressDashboard() {
  const { user, logout } = useAuth()
  const { progress, isLoaded } = useProgress()
  const [modalOpen, setModalOpen] = useState(false)

  if (!isLoaded) return null

  return (
    <AppShell>
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {user?.name}&apos;s Progress
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your growth over time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Submit
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {!progress.hasAnyData ? (
          <EmptyProgress />
        ) : (
          <>
            {/* 🔥 Streak */}
            <StreakCard streakDays={progress.streakDays} />

            {/* 📈 Chart */}
            <ProgressChart data={progress.progressData} />

            {/* 🧠 Skills + Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkillOverview skills={progress.skills} />
              <WeeklyHeatmap heatmapData={progress.heatmapData} />
            </div>

            {/* 📊 Activity */}
            {progress.recentActivity.length > 0 && (
              <RecentActivity items={progress.recentActivity} />
            )}

            {/* 🏆 Achievements */}
            <AchievementGrid achievements={progress.achievements} />
          </>
        )}
      </div>

      {/* Submit Modal */}
      <SubmitAssignmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </AppShell>
  )
}

export default function ProgressPage() {
  return <ProgressDashboard />
}