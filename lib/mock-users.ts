export interface ProgressDataPoint {
  week: string
  essays: number
  coding: number
  maths: number
}

export interface StatSummary {
  submissions: string
  avgScore: string
  improvement: string
  studyTime: string
}

export interface TopicData {
  name: string
  score: number
  change: number
  submissions: number
}

export interface AchievementData {
  id: string
  name: string
  description: string
  unlocked: boolean
  color: string
}

export interface SkillData {
  name: string
  level: number
  maxLevel: number
  color: string
}

export interface RecentActivityItem {
  id: string
  type: "essay" | "coding" | "maths"
  title: string
  score: number
  date: string
  status: "reviewed" | "pending"
}

export interface UserProfile {
  id: string
  name: string
  stats: StatSummary
  progressData: ProgressDataPoint[]
  topics: TopicData[]
  heatmapData: number[][]
  achievements: AchievementData[]
  skills: SkillData[]
  recentActivity: RecentActivityItem[]
}

const generateHeatmap = (activityPattern: number[]): number[][] =>
  Array.from({ length: 12 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) =>
      activityPattern[(weekIndex + dayIndex) % activityPattern.length]
    )
  )

export const users: UserProfile[] = [
  {
    id: "alice",
    name: "Alice",
    stats: {
      submissions: "24",
      avgScore: "84",
      improvement: "+12%",
      studyTime: "14h",
    },
    progressData: [
      { week: "Week 1", essays: 65, coding: 55, maths: 50 },
      { week: "Week 2", essays: 70, coding: 60, maths: 54 },
      { week: "Week 3", essays: 74, coding: 66, maths: 58 },
      { week: "Week 4", essays: 78, coding: 70, maths: 61 },
      { week: "Week 5", essays: 82, coding: 74, maths: 64 },
      { week: "Week 6", essays: 86, coding: 79, maths: 69 },
      { week: "Week 7", essays: 89, coding: 83, maths: 73 },
      { week: "Week 8", essays: 92, coding: 88, maths: 77 },
    ],
    topics: [
      { name: "Argumentative Writing", score: 88, change: 10, submissions: 7 },
      { name: "Binary Search & Sorting", score: 80, change: 9, submissions: 6 },
      { name: "Calculus Integration", score: 70, change: 3, submissions: 5 },
      { name: "Literary Analysis", score: 93, change: 6, submissions: 4 },
      { name: "Recursion & DP", score: 78, change: 12, submissions: 5 },
      { name: "Linear Algebra", score: 62, change: 4, submissions: 3 },
    ],
    heatmapData: generateHeatmap([3, 2, 2, 1, 3, 0, 1]),
    achievements: [
      { id: "1", name: "First Submit", description: "Submit your first assignment", unlocked: true, color: "text-chart-1" },
      { id: "2", name: "Hot Streak", description: "5 day submission streak", unlocked: true, color: "text-accent" },
      { id: "3", name: "A+ Student", description: "Score 95+ on any assignment", unlocked: false, color: "text-chart-4" },
      { id: "4", name: "Speed Demon", description: "Submit 3 assignments in one day", unlocked: true, color: "text-chart-5" },
      { id: "5", name: "Bookworm", description: "Complete 10 essay reviews", unlocked: false, color: "text-chart-3" },
      { id: "6", name: "Sharpshooter", description: "Score 90+ three times in a row", unlocked: false, color: "text-success" },
      { id: "7", name: "Champion", description: "Reach 80+ avg across all subjects", unlocked: true, color: "text-chart-4" },
      { id: "8", name: "Top Tier", description: "Achieve mastery in any skill", unlocked: false, color: "text-primary" },
    ],
    skills: [
      { name: "Essay Writing", level: 88, maxLevel: 100, color: "bg-chart-1" },
      { name: "Coding", level: 84, maxLevel: 100, color: "bg-chart-5" },
      { name: "Maths", level: 76, maxLevel: 100, color: "bg-chart-3" },
      { name: "Problem Solving", level: 64, maxLevel: 100, color: "bg-chart-4" },
    ],
    recentActivity: [
      { id: "1", type: "essay", title: "Climate Change Argumentative Essay", score: 88, date: "2 hours ago", status: "reviewed" },
      { id: "2", type: "coding", title: "Binary Search Tree Implementation", score: 79, date: "Yesterday", status: "reviewed" },
      { id: "3", type: "maths", title: "Calculus Integration Problem Set", score: 71, date: "2 days ago", status: "reviewed" },
      { id: "4", type: "essay", title: "Shakespeare Literary Analysis", score: 94, date: "3 days ago", status: "reviewed" },
    ],
  },
  {
    id: "mohit",
    name: "Mohit",
    stats: {
      submissions: "17",
      avgScore: "74",
      improvement: "+6%",
      studyTime: "10h",
    },
    progressData: [
      { week: "Week 1", essays: 58, coding: 45, maths: 48 },
      { week: "Week 2", essays: 61, coding: 52, maths: 50 },
      { week: "Week 3", essays: 65, coding: 56, maths: 53 },
      { week: "Week 4", essays: 68, coding: 60, maths: 56 },
      { week: "Week 5", essays: 71, coding: 65, maths: 60 },
      { week: "Week 6", essays: 74, coding: 68, maths: 63 },
      { week: "Week 7", essays: 76, coding: 72, maths: 66 },
      { week: "Week 8", essays: 79, coding: 75, maths: 69 },
    ],
    topics: [
      { name: "Argumentative Writing", score: 78, change: 5, submissions: 5 },
      { name: "Binary Search & Sorting", score: 72, change: 10, submissions: 4 },
      { name: "Calculus Integration", score: 62, change: -1, submissions: 6 },
      { name: "Literary Analysis", score: 82, change: 3, submissions: 3 },
      { name: "Recursion & DP", score: 70, change: 7, submissions: 4 },
      { name: "Linear Algebra", score: 55, change: 1, submissions: 2 },
    ],
    heatmapData: generateHeatmap([2, 1, 2, 1, 2, 0, 1]),
    achievements: [
      { id: "1", name: "First Submit", description: "Submit your first assignment", unlocked: true, color: "text-chart-1" },
      { id: "2", name: "Hot Streak", description: "5 day submission streak", unlocked: false, color: "text-accent" },
      { id: "3", name: "A+ Student", description: "Score 95+ on any assignment", unlocked: false, color: "text-chart-4" },
      { id: "4", name: "Speed Demon", description: "Submit 3 assignments in one day", unlocked: true, color: "text-chart-5" },
      { id: "5", name: "Bookworm", description: "Complete 10 essay reviews", unlocked: false, color: "text-chart-3" },
      { id: "6", name: "Sharpshooter", description: "Score 90+ three times in a row", unlocked: false, color: "text-success" },
      { id: "7", name: "Champion", description: "Reach 80+ avg across all subjects", unlocked: false, color: "text-chart-4" },
      { id: "8", name: "Top Tier", description: "Achieve mastery in any skill", unlocked: false, color: "text-primary" },
    ],
    skills: [
      { name: "Essay Writing", level: 74, maxLevel: 100, color: "bg-chart-1" },
      { name: "Coding", level: 78, maxLevel: 100, color: "bg-chart-5" },
      { name: "Maths", level: 69, maxLevel: 100, color: "bg-chart-3" },
      { name: "Problem Solving", level: 60, maxLevel: 100, color: "bg-chart-4" },
    ],
    recentActivity: [
      { id: "1", type: "essay", title: "Social Media Impact Essay", score: 76, date: "4 hours ago", status: "reviewed" },
      { id: "2", type: "coding", title: "Heap Sort Debugging", score: 68, date: "Yesterday", status: "reviewed" },
      { id: "3", type: "maths", title: "Limits and Series", score: 59, date: "2 days ago", status: "reviewed" },
      { id: "4", type: "essay", title: "Modern Poetry Analysis", score: 81, date: "3 days ago", status: "pending" },
    ],
  },
  {
    id: "guest",
    name: "Guest",
    stats: {
      submissions: "0",
      avgScore: "0",
      improvement: "0%",
      studyTime: "0h",
    },
    progressData: [
      { week: "Week 1", essays: 50, coding: 50, maths: 50 },
      { week: "Week 2", essays: 50, coding: 50, maths: 50 },
      { week: "Week 3", essays: 50, coding: 50, maths: 50 },
      { week: "Week 4", essays: 50, coding: 50, maths: 50 },
      { week: "Week 5", essays: 50, coding: 50, maths: 50 },
      { week: "Week 6", essays: 50, coding: 50, maths: 50 },
      { week: "Week 7", essays: 50, coding: 50, maths: 50 },
      { week: "Week 8", essays: 50, coding: 50, maths: 50 },
    ],
    topics: [
      { name: "Argumentative Writing", score: 50, change: 0, submissions: 0 },
      { name: "Binary Search & Sorting", score: 50, change: 0, submissions: 0 },
      { name: "Calculus Integration", score: 50, change: 0, submissions: 0 },
      { name: "Literary Analysis", score: 50, change: 0, submissions: 0 },
      { name: "Recursion & DP", score: 50, change: 0, submissions: 0 },
      { name: "Linear Algebra", score: 50, change: 0, submissions: 0 },
    ],
    heatmapData: generateHeatmap([0, 0, 0, 0, 0, 0, 0]),
    achievements: [
      { id: "1", name: "First Submit", description: "Submit your first assignment", unlocked: false, color: "text-chart-1" },
      { id: "2", name: "Hot Streak", description: "5 day submission streak", unlocked: false, color: "text-accent" },
      { id: "3", name: "A+ Student", description: "Score 95+ on any assignment", unlocked: false, color: "text-chart-4" },
      { id: "4", name: "Speed Demon", description: "Submit 3 assignments in one day", unlocked: false, color: "text-chart-5" },
      { id: "5", name: "Bookworm", description: "Complete 10 essay reviews", unlocked: false, color: "text-chart-3" },
      { id: "6", name: "Sharpshooter", description: "Score 90+ three times in a row", unlocked: false, color: "text-success" },
      { id: "7", name: "Champion", description: "Reach 80+ avg across all subjects", unlocked: false, color: "text-chart-4" },
      { id: "8", name: "Top Tier", description: "Achieve mastery in any skill", unlocked: false, color: "text-primary" },
    ],
    skills: [
      { name: "Essay Writing", level: 50, maxLevel: 100, color: "bg-chart-1" },
      { name: "Coding", level: 50, maxLevel: 100, color: "bg-chart-5" },
      { name: "Maths", level: 50, maxLevel: 100, color: "bg-chart-3" },
      { name: "Problem Solving", level: 50, maxLevel: 100, color: "bg-chart-4" },
    ],
    recentActivity: [],
  },
]

export const USER_STORAGE_KEY = "brain-drop-user"

export function getUserProfile(id: string) {
  return users.find((user) => user.id === id) ?? users[0]
}

export function getStoredUserId() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(USER_STORAGE_KEY)
}

export function getDefaultUser() {
  return users[0]
}
