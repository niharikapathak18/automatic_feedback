"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressPoint {
  week: string
  essays: number
  coding: number
  maths: number
}

export interface ActivityItem {
  id: string
  type: "essay" | "coding" | "maths"
  title: string
  score: number
  date: string
  status: "reviewed" | "pending"
}

export interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  color: string
}

export interface Skill {
  name: string
  level: number
  maxLevel: number
  color: string
}

export interface UserProgress {
  progressData: ProgressPoint[]
  recentActivity: ActivityItem[]
  achievements: Achievement[]
  skills: Skill[]
  heatmapData: number[][]
  streakDays: boolean[]
  hasAnyData: boolean
}

// ─── Default empty state ──────────────────────────────────────────────────────

const EMPTY_PROGRESS: UserProgress = {
  progressData: [],
  recentActivity: [],
  achievements: [
    { id: "1", name: "First Submit",    description: "Submit your first assignment",        unlocked: false, color: "text-chart-1" },
    { id: "2", name: "Hot Streak",      description: "5 day submission streak",             unlocked: false, color: "text-accent"  },
    { id: "3", name: "A+ Student",      description: "Score 95+ on any assignment",         unlocked: false, color: "text-chart-4" },
    { id: "4", name: "Speed Demon",     description: "Submit 3 assignments in one day",     unlocked: false, color: "text-chart-5" },
    { id: "5", name: "Bookworm",        description: "Complete 10 essay reviews",           unlocked: false, color: "text-chart-3" },
    { id: "6", name: "Sharpshooter",    description: "Score 90+ three times in a row",      unlocked: false, color: "text-success" },
    { id: "7", name: "Champion",        description: "Reach 80+ avg across all subjects",   unlocked: false, color: "text-chart-4" },
    { id: "8", name: "Top Tier",        description: "Achieve mastery in any skill",        unlocked: false, color: "text-primary" },
  ],
  skills: [
    { name: "Essay Writing",   level: 0, maxLevel: 100, color: "bg-chart-1" },
    { name: "Coding",          level: 0, maxLevel: 100, color: "bg-chart-5" },
    { name: "Maths",           level: 0, maxLevel: 100, color: "bg-chart-3" },
    { name: "Problem Solving", level: 0, maxLevel: 100, color: "bg-chart-4" },
  ],
  heatmapData: Array.from({ length: 12 }, () => Array(7).fill(0)),
  streakDays: [false, false, false, false, false, false, false],
  hasAnyData: false,
}

// ─── DB row shape returned by the Supabase query ─────────────────────────────

type DbRow = {
  id: string
  type: "essay" | "coding" | "maths"
  title: string
  status: "reviewed" | "pending"
  created_at: string
  feedback: Array<{ overall_score: number; letter_grade: string }>
}

// ─── Derive full UserProgress from raw DB rows ────────────────────────────────

function computeProgress(rows: DbRow[]): UserProgress {
  if (rows.length === 0) return EMPTY_PROGRESS

  // Map to ActivityItem (newest first — same order the query returns)
  const activities: ActivityItem[] = rows.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    score: row.feedback[0]?.overall_score ?? 0,
    date: row.created_at,
    status: row.status,
  }))

  // Chronological (oldest first) for EMA and streak computation
  const sorted = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // ── Skills (exponential moving average, same formula as before) ───────────
  const skillNameMap: Record<ActivityItem["type"], string> = {
    essay: "Essay Writing",
    coding: "Coding",
    maths: "Maths",
  }
  const skills = EMPTY_PROGRESS.skills.map((s) => ({ ...s }))
  for (const item of sorted) {
    const skill = skills.find((s) => s.name === skillNameMap[item.type])
    if (skill) {
      skill.level = Math.min(
        100,
        Math.round(skill.level * 0.85 + item.score * 0.15)
      )
    }
  }

  // ── Progress chart (bucket every 3 submissions into a "week") ─────────────
  const progressData: ProgressPoint[] = []
  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i]
    const bucketIdx = Math.floor(i / 3)
    const weekLabel = `Week ${bucketIdx + 1}`
    if (!progressData[bucketIdx]) {
      progressData[bucketIdx] = { week: weekLabel, essays: 0, coding: 0, maths: 0 }
    }
    if (item.type === "essay")  progressData[bucketIdx].essays = item.score
    if (item.type === "coding") progressData[bucketIdx].coding = item.score
    if (item.type === "maths")  progressData[bucketIdx].maths  = item.score
  }

  // ── Heatmap (last 12 weeks × 7 days, Mon = index 0) ──────────────────────
  const now = new Date()
  const heatmapData = Array.from({ length: 12 }, () => Array(7).fill(0))
  for (const item of activities) {
    const itemDate = new Date(item.date)
    const daysDiff = Math.floor(
      (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const weekIdx = 11 - Math.floor(daysDiff / 7)
    const dayIdx = (itemDate.getDay() + 6) % 7
    if (weekIdx >= 0 && weekIdx < 12) {
      heatmapData[weekIdx][dayIdx] = Math.min(3, heatmapData[weekIdx][dayIdx] + 1)
    }
  }

  // ── Streak (which days of the current Mon–Sun week had a submission) ───────
  const streakDays: boolean[] = [false, false, false, false, false, false, false]
  const mondayThisWeek = new Date(now)
  mondayThisWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  mondayThisWeek.setHours(0, 0, 0, 0)
  for (const item of activities) {
    const itemDate = new Date(item.date)
    if (itemDate >= mondayThisWeek) {
      const dayIdx = (itemDate.getDay() + 6) % 7
      streakDays[dayIdx] = true
    }
  }

  // ── Achievements ──────────────────────────────────────────────────────────
  const achievements = EMPTY_PROGRESS.achievements.map((a) => {
    if (a.id === "1" && activities.length >= 1)
      return { ...a, unlocked: true }

    if (a.id === "2" && streakDays.filter(Boolean).length >= 5)
      return { ...a, unlocked: true }

    if (a.id === "3" && activities.some((x) => x.score >= 95))
      return { ...a, unlocked: true }

    if (a.id === "4") {
      const countByDay = new Map<string, number>()
      for (const x of activities) {
        const d = new Date(x.date).toDateString()
        countByDay.set(d, (countByDay.get(d) ?? 0) + 1)
      }
      if (Array.from(countByDay.values()).some((c) => c >= 3))
        return { ...a, unlocked: true }
    }

    if (a.id === "5" && activities.filter((x) => x.type === "essay").length >= 10)
      return { ...a, unlocked: true }

    if (a.id === "6") {
      let run = 0
      for (const x of sorted) {
        run = x.score >= 90 ? run + 1 : 0
        if (run >= 3) return { ...a, unlocked: true }
      }
    }

    if (a.id === "7") {
      const byType: Record<string, number[]> = { essay: [], coding: [], maths: [] }
      for (const x of activities) byType[x.type]?.push(x.score)
      const avgs = Object.values(byType)
        .filter((arr) => arr.length > 0)
        .map((arr) => arr.reduce((s, v) => s + v, 0) / arr.length)
      if (avgs.length >= 3 && avgs.every((avg) => avg >= 80))
        return { ...a, unlocked: true }
    }

    if (a.id === "8" && skills.some((s) => s.level >= 95))
      return { ...a, unlocked: true }

    return a
  })

  return {
    progressData,
    recentActivity: activities.slice(0, 20),
    achievements,
    skills,
    heatmapData,
    streakDays,
    hasAnyData: true,
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch the latest submissions + feedback from Supabase and recompute state.
  // The browser supabase client automatically uses the active session for RLS.
  const refreshProgress = useCallback(async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("submissions")
      .select("id, type, title, status, created_at, feedback(overall_score, letter_grade)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[useProgress] fetch error:", error)
      return
    }

    setProgress(computeProgress((data ?? []) as DbRow[]))
    setIsLoaded(true)
  }, [user])

  useEffect(() => {
    if (!user) {
      setProgress(EMPTY_PROGRESS)
      setIsLoaded(false)
      return
    }
    refreshProgress()
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return { progress, isLoaded, refreshProgress }
}
