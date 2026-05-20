"use client"

import { motion } from "framer-motion"
import GlassCard from "./ui/glass-card"

export default function Centerpiece() {
  return (
    <section className="mx-auto mb-40 max-w-7xl px-6">

      <GlassCard className="relative border border-white/10 bg-[#050816]/80">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* GLOW ORBS */}
        <div className="absolute left-[-10%] top-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-[-10%] bottom-[0%] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />

        {/* SVG CONNECTIONS */}
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 1400 900"
        >
          <path
            d="M250 150 Q700 50 1050 300"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M350 700 Q850 850 1150 500"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
          />

          <defs>
            <linearGradient id="gradient">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>

        {/* MAIN CONTENT */}
        <div className="relative z-10 flex min-h-[750px] items-center justify-center px-8 py-24">

          {/* LEFT FLOATING PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute left-10 top-24 hidden w-[320px] rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl xl:block"
          >

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">
                  MCP Runtime
                </h4>

                <p className="mt-1 text-sm text-white/50">
                  Live infrastructure
                </p>
              </div>

              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
            </div>

            <div className="space-y-3 font-mono text-sm">

              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-blue-300">
                Deploying Cloudflare Worker...
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-green-400">
                MCP endpoint generated
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-white/60">
                Vector search online
              </div>

            </div>
          </motion.div>

          {/* RIGHT FLOATING PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute right-10 bottom-24 hidden w-[340px] rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl xl:block"
          >

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">
                  Claude Connection
                </h4>

                <p className="mt-1 text-sm text-white/50">
                  Active AI tools
                </p>
              </div>

              <div className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                CONNECTED
              </div>
            </div>

            <div className="space-y-4">

              <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
                <p className="mb-2 text-sm text-white/40">
                  USER QUERY
                </p>

                <p className="text-sm text-white/80">
                  “How do I configure MCP tools for Claude Desktop?”
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="mb-2 text-sm text-blue-300">
                  MCP RESPONSE
                </p>

                <p className="text-sm text-white/70">
                  Retrieved 5 semantic matches from indexed documentation.
                </p>
              </div>

            </div>
          </motion.div>

          {/* CENTER PANEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 w-full max-w-4xl rounded-[32px] border border-white/10 bg-black/50 p-8 backdrop-blur-2xl"
          >

            {/* HEADER */}
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">

              <div>
                <h3 className="text-4xl font-bold tracking-tight">
                  MCP Generation Pipeline
                </h3>

                <p className="mt-3 text-lg text-white/50">
                  Real-time deployment infrastructure
                </p>
              </div>

              <div className="rounded-full bg-green-500/10 px-5 py-2 text-sm font-medium text-green-400">
                LIVE
              </div>

            </div>

            {/* INPUT */}
            <div className="mb-8">

              <label className="mb-3 block text-sm uppercase tracking-wider text-white/40">
                Knowledge Source
              </label>

              <div className="flex flex-col gap-4 md:flex-row">

                <input
                  type="text"
                  placeholder="Paste documentation URL or upload PDF..."
                  className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white outline-none transition focus:border-blue-500/50"
                />

                <button className="rounded-2xl bg-[#3B82F6] px-8 font-semibold text-white transition hover:scale-105">
                  Generate
                </button>

              </div>
            </div>

            {/* TERMINAL */}
            <div className="rounded-3xl border border-white/10 bg-black/70 p-6 font-mono">

              <div className="mb-6 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />

                <span className="ml-4 text-sm text-white/30">
                  deployment.log
                </span>
              </div>

              <div className="space-y-5 text-sm">

                <div className="flex items-center gap-3 text-white/40">
                  <div className="h-2 w-2 rounded-full bg-white/30" />

                  Deploying infrastructure...
                </div>

                <div className="flex items-center gap-3 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-400" />

                  Content indexed (142 nodes)
                </div>

                <div className="flex items-center gap-3 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-400" />

                  Vector database provisioned
                </div>

                <div className="flex items-center gap-3 text-blue-400 animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />

                  Connecting to Claude Desktop...
                </div>

              </div>
            </div>

          </motion.div>

        </div>

      </GlassCard>
    </section>
  )
}