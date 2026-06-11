"use client"

import { motion } from "framer-motion"

export function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          x: [0, 150, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -200, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
      />
    </div>
  )
}