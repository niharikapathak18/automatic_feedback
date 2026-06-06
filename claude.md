# CLAUDE.md — Project Context for Claude Code

## Project Overview
**Name:** Automatic Feedback System  
**Stack:** Next.js (App Router), Supabase (DB + Auth), Gemini API  
**Goal:** Provide automated AI-powered feedback on user writing submissions and give progress report for that account.  

## Project Structure (Expected)
- `/app` — Next.js App Router pages and layouts
- `/components` — Reusable UI components
- `/lib` — Supabase client, Gemini client, utility functions
- `/app/api` — API route handlers (or server actions)
- `/supabase` — Migrations, schema, RLS policies (if present)

## Key Integrations
- **Supabase:** Used for user auth, storing submissions, and feedback records
- **Gemini API:** Used to generate feedback on writing/practice responses
- **Next.js Server Actions or API Routes:** Bridge between frontend and both services

## Sections Built So Far
- Progress section 
- Submit section
- Authentication section (Supabase got it covered)

## Current Development Phase
Connecting existing UI sections to Supabase backend and Gemini API.  (For those which are not completed already)
No major UI work needed [Dont change UI] — focus is on backend wiring, API routes, and data flow.

## Preferences for Claude Code
- Protect my API keys (Keep it a secret)
- Always explain what you're about to do before doing it
- Prefer server actions over API routes where possible in App Router
- Use typed Supabase client (supabase-js v2 with TypeScript types if available)
- Keep Gemini prompts in a single `/lib/gemini.ts` file for maintainability
- Do not install new packages without flagging it first
- When suggesting DB changes, write migration files, don't mutate schema directly