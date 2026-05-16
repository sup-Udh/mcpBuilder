"use client"

import { motion } from "framer-motion"
import GlassCard from "./ui/glass-card"

export default function Centerpiece() {
  return (
    <GlassCard>
    <section className="mx-auto mb-40 max-w-7xl px-6">

      <div className="relative flex h-[650px] items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* GLOW BLOBS */}
        <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        {/* SVG CONNECTIONS */}
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 1200 700"
        >
          <path
            d="M200 150 Q600 50 900 250"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M300 500 Q700 600 950 350"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
          />

          <defs>
            <linearGradient id="gradient">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>

        {/* CENTER CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl"
        >

          {/* TOP */}
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-2xl font-bold">
                MCP Generation Pipeline
              </h3>

              <p className="mt-2 text-white/60">
                Real-time deployment infrastructure
              </p>
            </div>

            <div className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
              LIVE
            </div>
          </div>

          {/* TERMINAL */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/50 p-6 font-mono text-sm">

            <div className="flex items-center gap-2 text-green-400">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Source detected: docs.anthropic.com
            </div>

            <div className="flex items-center gap-2 text-green-400">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Content indexed (142 nodes)
            </div>

            <div className="flex items-center gap-2 text-green-400">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Vector database provisioned
            </div>

            <div className="flex items-center gap-2 text-blue-400 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              Connecting to Claude Desktop...
            </div>

          </div>
        </motion.div>
      </div>
    </section>
    </GlassCard>
  )
}