"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"

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

// ─── Default empty state for a brand-new user ────────────────────────────────

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
    { name: "Essay Writing",  level: 0, maxLevel: 100, color: "bg-chart-1" },
    { name: "Coding",         level: 0, maxLevel: 100, color: "bg-chart-5" },
    { name: "Maths",          level: 0, maxLevel: 100, color: "bg-chart-3" },
    { name: "Problem Solving",level: 0, maxLevel: 100, color: "bg-chart-4" },
  ],
  heatmapData: Array.from({ length: 12 }, () => Array(7).fill(0)),
  streakDays: [false, false, false, false, false, false, false],
  hasAnyData: false,
}

// ─── Storage key ─────────────────────────────────────────────────────────────

function progressKey(userId: string) {
  return `app:progress:${userId}`
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load progress whenever the user changes
  useEffect(() => {
    if (!user) {
      setProgress(EMPTY_PROGRESS)
      setIsLoaded(false)
      return
    }

    try {
      const raw = localStorage.getItem(progressKey(user.id))
      if (raw) {
        setProgress(JSON.parse(raw))
      } else {
        setProgress(EMPTY_PROGRESS)
      }
    } catch {
      setProgress(EMPTY_PROGRESS)
    } finally {
      setIsLoaded(true)
    }
  }, [user?.id])

  /** Persist any partial update */
  const saveProgress = useCallback(
    (update: Partial<UserProgress>) => {
      if (!user) return
      setProgress((prev) => {
        const next = { ...prev, ...update, hasAnyData: true }
        localStorage.setItem(progressKey(user.id), JSON.stringify(next))
        return next
      })
    },
    [user]
  )

  /**
   * Submit a new assignment result.
   * Updates: recentActivity, skills, progressData, achievements, heatmap, streak.
   */
  const submitAssignment = useCallback(
    (item: Omit<ActivityItem, "id" | "date" | "status">) => {
      if (!user) return

      const newItem: ActivityItem = {
        ...item,
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: "reviewed",
      }

      setProgress((prev) => {
        // ── Skills ────────────────────────────────────────────────────────────
        const skillMap: Record<ActivityItem["type"], string> = {
          essay: "Essay Writing",
          coding: "Coding",
          maths: "Maths",
        }
        const updatedSkills = prev.skills.map((s) =>
          s.name === skillMap[item.type]
            ? { ...s, level: Math.min(100, Math.round((s.level * 0.85) + (item.score * 0.15))) }
            : s
        )

        // ── Progress chart (weekly buckets) ───────────────────────────────────
        const weekLabel = `Week ${Math.floor(prev.recentActivity.length / 3) + 1}`
        const lastPoint = prev.progressData[prev.progressData.length - 1]
        const newPoint: ProgressPoint = lastPoint
  ? {
      week: weekLabel,
      essays: item.type === "essay" ? item.score : lastPoint.essays,
      coding: item.type === "coding" ? item.score : lastPoint.coding,
      maths: item.type === "maths" ? item.score : lastPoint.maths,
    }
  : {
      week: weekLabel,
      essays: item.type === "essay" ? item.score : 0,
      coding: item.type === "coding" ? item.score : 0,
      maths: item.type === "maths" ? item.score : 0,
    }
    const progressData =
  prev.progressData.length === 0 || lastPoint?.week === weekLabel
    ? [...prev.progressData.slice(0, -1), newPoint]
    : [...prev.progressData, newPoint]

        // ── Heatmap (mark today) ──────────────────────────────────────────────
        const todayDow = (new Date().getDay() + 6) % 7 // Mon=0
        const heatmapData = prev.heatmapData.map((w, wi) =>
          wi === prev.heatmapData.length - 1
            ? w.map((v, di) => (di === todayDow ? Math.min(3, v + 1) : v))
            : w
        )

        // ── Streak ────────────────────────────────────────────────────────────
        const streakDays = prev.streakDays.map((v, i) =>
          i === todayDow ? true : v
        )

        // ── Achievements ──────────────────────────────────────────────────────
        const allActivity = [newItem, ...prev.recentActivity]
        const achievements = prev.achievements.map((a) => {
          if (a.unlocked) return a
          if (a.id === "1") return { ...a, unlocked: true }
          if (a.id === "2" && streakDays.filter(Boolean).length >= 5)
            return { ...a, unlocked: true }
          if (a.id === "3" && item.score >= 95) return { ...a, unlocked: true }
          if (a.id === "4") {
            const today = new Date().toDateString()
            const todayCount = allActivity.filter(
              (x) => new Date(x.date).toDateString() === today
            ).length
            if (todayCount >= 3) return { ...a, unlocked: true }
          }
          if (a.id === "5" && allActivity.filter((x) => x.type === "essay").length >= 10)
            return { ...a, unlocked: true }
          return a
        })

        const next: UserProgress = {
          progressData,
          recentActivity: [newItem, ...prev.recentActivity].slice(0, 20),
          achievements,
          skills: updatedSkills,
          heatmapData,
          streakDays,
          hasAnyData: true,
        }
        localStorage.setItem(progressKey(user.id), JSON.stringify(next))
        return next
      })
    },
    [user]
  )

  return { progress, isLoaded, submitAssignment, saveProgress }
}
