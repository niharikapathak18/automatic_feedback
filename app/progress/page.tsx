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

// ─── Demo seed data (loaded when user clicks "preview with demo data") ─────────
const DEMO_PROGRESS_DATA = [
  { week: "Week 1", essays: 62, coding: 55, maths: 48 },
  { week: "Week 2", essays: 68, coding: 60, maths: 52 },
  { week: "Week 3", essays: 71, coding: 65, maths: 58 },
  { week: "Week 4", essays: 74, coding: 72, maths: 61 },
  { week: "Week 5", essays: 78, coding: 74, maths: 64 },
  { week: "Week 6", essays: 82, coding: 78, maths: 71 },
  { week: "Week 7", essays: 85, coding: 82, maths: 75 },
  { week: "Week 8", essays: 88, coding: 85, maths: 78 },
]

const DEMO_ACTIVITY = [
  { id: "d1", type: "essay"  as const, title: "Climate Change Essay",     score: 88, date: "20 May 2026", status: "reviewed" as const },
  { id: "d2", type: "coding" as const, title: "Binary Search Tree",       score: 92, date: "18 May 2026", status: "reviewed" as const },
  { id: "d3", type: "maths"  as const, title: "Calculus Problem Set",     score: 76, date: "15 May 2026", status: "reviewed" as const },
  { id: "d4", type: "essay"  as const, title: "Shakespearean Analysis",   score: 95, date: "12 May 2026", status: "reviewed" as const },
  { id: "d5", type: "coding" as const, title: "React Component Design",   score: 80, date: "10 May 2026", status: "pending"  as const },
]

// ─── Inner dashboard (rendered only when authenticated) ───────────────────────

function ProgressDashboard() {
  const { user, logout } = useAuth()
  const { progress, isLoaded, saveProgress } = useProgress()
  const [modalOpen, setModalOpen] = useState(false)

  if (!isLoaded) return null

  function loadDemo() {
    saveProgress({
      progressData: DEMO_PROGRESS_DATA,
      recentActivity: DEMO_ACTIVITY,
      skills: [
        { name: "Essay Writing",   level: 78, maxLevel: 100, color: "bg-chart-1" },
        { name: "Coding",          level: 82, maxLevel: 100, color: "bg-chart-5" },
        { name: "Maths",           level: 71, maxLevel: 100, color: "bg-chart-3" },
        { name: "Problem Solving", level: 58, maxLevel: 100, color: "bg-chart-4" },
      ],
      achievements: progress.achievements.map((a, i) =>
        i < 4 ? { ...a, unlocked: true } : a
      ),
      streakDays: [true, true, true, true, true, false, false],
      hasAnyData: true,
    })
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              {user!.name}&apos;s Progress
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your growth over time and see where you shine
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              Submit
            </button>
            <button
              onClick={logout}
              title="Sign out"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Empty state for brand-new users */}
        {!progress.hasAnyData ? (
          <div className="rounded-2xl border border-border bg-card">
            <EmptyProgress onDemo={loadDemo} />
          </div>
        ) : (
          <>
            {/* Streak */}
            <StreakCard streakDays={progress.streakDays} />

            {/* Score trends chart */}
            <ProgressChart data={progress.progressData} />

            {/* Skill + Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkillOverview skills={progress.skills} />
              <WeeklyHeatmap heatmapData={progress.heatmapData} />
            </div>

            {/* Recent activity */}
            {progress.recentActivity.length > 0 && (
              <RecentActivity items={progress.recentActivity} />
            )}

            {/* Achievements */}
            <AchievementGrid achievements={progress.achievements} />
          </>
        )}
      </div>

      {/* Submit modal */}
      <SubmitAssignmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </AppShell>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ProgressPage() {
  return <ProgressDashboard />
}

