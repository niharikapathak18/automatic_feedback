import React from "react"
import type { Metadata } from "next"
import { Inter, Space_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/context/auth-context"
import { AuthGuard } from "@/components/auth/auth-guard"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BrainDrop - AI Assignment Feedback",
  description:
    "Instant AI-powered feedback on essays, code, and math. Level up your learning game.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}