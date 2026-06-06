import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"

const MODEL = "llama-3.3-70b-versatile"

// ─── Feedback ─────────────────────────────────────────────────────────────────

const feedbackSchema = z.object({
  overallScore: z.number().describe("Overall score from 0-100"),
  summary: z.string().describe("2-3 sentence summary of the overall quality"),
  strengths: z.array(
    z.object({ title: z.string(), description: z.string() })
  ),
  improvements: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum(["high", "medium", "low"]),
    })
  ),
  annotations: z.array(
    z.object({
      text: z.string(),
      issue: z.string(),
      suggestion: z.string(),
      category: z.enum([
        "grammar",
        "logic",
        "style",
        "accuracy",
        "syntax",
        "optimization",
        "clarity",
      ]),
    })
  ),
  weakTopics: z.array(z.string()),
  practiceRecommendations: z.array(
    z.object({
      topic: z.string(),
      description: z.string(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    })
  ),
  letterGrade: z.string(),
})

export type FeedbackResult = z.infer<typeof feedbackSchema>

const feedbackSystemPrompts: Record<string, string> = {
  essay: `You are an expert writing tutor and essay grader...`,
  coding: `You are an expert programming tutor and code reviewer...`,
  maths: `You are an expert math tutor and problem grader...`,
}

export async function generateFeedback(
  content: string,
  type: string
): Promise<FeedbackResult> {
  const systemPrompt =
    feedbackSystemPrompts[type] ?? feedbackSystemPrompts.essay

  const { object } = await generateObject({
    model: groq(MODEL),
    output: "object",
    schema: feedbackSchema,
    system: systemPrompt,
    prompt: `Please evaluate the following ${type} submission and provide detailed feedback:\n\n${content}`,
  })

  return object
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const practiceSchema = z.object({
  question: z.string().describe("The practice question or prompt"),
  hints: z.array(z.string()).describe("2-3 progressive hints"),
  sampleAnswer: z.string().describe("A model answer or solution"),
  explanation: z.string().describe("Detailed explanation of the answer"),
  keyConceptsToReview: z
    .array(z.string())
    .describe("Key concepts this question tests"),
})

export type PracticeResult = z.infer<typeof practiceSchema>

export async function generatePractice(
  topic: string,
  difficulty: string,
  type: string
): Promise<PracticeResult> {
  const { object } = await generateObject({
    model: groq(MODEL),
    system: `You are a creative and encouraging tutor who generates practice problems.
Your tone is friendly and Gen Z-accessible. Make problems interesting and relevant to real life when possible.
Generate a ${difficulty} level ${type} practice problem about: ${topic}.`,
    prompt: `Create a ${difficulty} difficulty ${type} practice exercise about "${topic}".
Make it engaging and educational. Include progressive hints that guide without giving away the answer.`,
    schema: practiceSchema,
  })

  return object
}
