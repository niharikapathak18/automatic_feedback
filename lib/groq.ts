import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
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

  const { text } = await generateText({
  model: groq(MODEL),

  system: systemPrompt,

  prompt: `
Evaluate the following ${type} submission and provide detailed feedback.

Return ONLY valid JSON.
The response must be parseable by JSON.parse() in JavaScript.
Do NOT use markdown.
Do NOT wrap the response in \`\`\`json blocks.
Do NOT include any explanations outside the JSON.

The JSON MUST match this structure exactly:

{
  "overallScore": number,
  "summary": string,
  "strengths": [
    {
      "title": string,
      "description": string
    }
  ],
  "improvements": [
    {
      "title": string,
      "description": string,
      "severity": "high" | "medium" | "low"
    }
  ],
  "annotations": [
    {
      "text": string,
      "issue": string,
      "suggestion": string,
      "category": "grammar" | "logic" | "style" | "accuracy" | "syntax" | "optimization" | "clarity"
    }
  ],
  "weakTopics": string[],
  "practiceRecommendations": [
    {
      "topic": string,
      "description": string,
      "difficulty": "beginner" | "intermediate" | "advanced"
    }
  ],
  "letterGrade": string
}

Submission:

${content}
`,
})
try {
  const parsed = JSON.parse(text)

  return feedbackSchema.parse(parsed)
} catch (error) {
  console.error("Raw model output:", text)

  throw new Error("Failed to generate valid feedback")
}
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
  const { text } = await generateText({
  model: groq(MODEL),

  system: `You are an expert tutor who creates high-quality practice exercises.

Your goals are:
- Help students genuinely understand concepts.
- Encourage active thinking rather than memorization.
- Match the difficulty level accurately.
- Provide clear explanations.
- Make practice engaging and educational.

Avoid trick questions unless the difficulty is advanced.`,

  prompt: `
Generate ONE ${difficulty} level ${type} practice exercise about "${topic}".

Requirements:
- The question should test understanding, not rote memorization.
- The difficulty must truly match "${difficulty}".
- The question should be self-contained and unambiguous.
- Provide exactly 3 hints:
  - Hint 1 should be subtle.
  - Hint 2 should guide the student toward the correct approach.
  - Hint 3 may be more explicit, but should not fully reveal the answer.
- The sample answer should demonstrate high-quality reasoning.
- The explanation should teach the underlying concept and explain why the answer is correct.
- The key concepts should list 3 to 5 important ideas the student should review.

Return ONLY valid JSON.
The response must be parseable by JSON.parse() in JavaScript.
Do NOT use markdown.
Do NOT use code fences.
Do NOT include explanations outside the JSON.

Use this exact structure:

{
  "question": string,
  "hints": [string, string, string],
  "sampleAnswer": string,
  "explanation": string,
  "keyConceptsToReview": [string]
}
`,
})
try {
  const parsed = JSON.parse(text)

  return practiceSchema.parse(parsed)
} catch (error) {
  console.error("Raw practice output:", text)

  throw new Error("Failed to generate valid practice exercise")
}
}
