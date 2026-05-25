import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function GET() {
  const r = await generateText({
    model: google("gemini-1.5-flash-8b"),
    prompt: "say hello",
  })

  return Response.json(r)
}
