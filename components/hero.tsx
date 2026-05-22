"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Hero() {
  const [activeStep, setActiveStep] = useState(0)

  // Rotate active pipeline step indicator to simulate live background processing
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-28 md:pt-24 lg:pt-32">
      {/* Background radial ambient lights specific to the Hero section */}
      <div className="pointer-events-none absolute top-[-100px] left-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.08)_0,transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute top-[-50px] right-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,64,129,0.06)_0,transparent_60%)] blur-3xl" />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Premium Typography and CTAs */}
        <div className="flex flex-col items-start text-left lg:col-span-7">
          {/* Animated Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-[#100B24] px-4 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4081] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4081]"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C1B9CA]">
              Next-Gen MCP Orchestration
            </span>
          </motion.div>

          {/* Staggered Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bold tracking-tighter text-white text-5xl sm:text-6xl xl:text-7xl leading-[1.05]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Build intelligent <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF4081] to-[#7C4DFF] pb-1">
              MCP Infrastructure
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF6B35] via-[#FF4081] to-[#7C4DFF] opacity-30 blur-[1px]"></span>
            </span>
            <br />
            without writing code.
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg text-[#A69EAF] leading-relaxed"
          >
            Turn developer portals, API documentation, PDFs, and data streams into dynamic, deployment-ready Model Context Protocol servers. Instantly expand the capability index of Claude, Cursor, and custom agent teams.
          </motion.p>

          {/* Buttons with rich hover styles */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <button 
                className="w-full sm:w-auto relative cursor-pointer overflow-hidden rounded-xl px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF4081 100%)',
                  boxShadow: '0 6px 20px rgba(255, 64, 129, 0.3)',
                }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10 flex items-center gap-2">
                  Generate MCP Server
                  <span className="material-symbols-outlined text-sm font-semibold">arrow_forward</span>
                </span>
              </button>
            </Link>

            <Link href="/demo" className="w-full sm:w-auto">
              <button 
                className="w-full sm:w-auto cursor-pointer rounded-xl px-8 py-4 font-semibold transition-all duration-300 hover:bg-white/[0.03] active:scale-[0.98] border border-white/10 text-white flex items-center justify-center gap-2 hover:border-white/20"
              >
                View Live Demo
                <span className="material-symbols-outlined text-sm">play_circle</span>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Cinematic Animated Infrastructure Visual */}
        <div className="lg:col-span-5 relative flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md rounded-[2.5rem] border border-white/5 bg-[#0A0714]/40 p-6 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden"
          >
            {/* Ambient decorative glowing grid inside the card */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute -top-[50px] -right-[50px] w-[150px] h-[150px] rounded-full bg-[#FF4081]/10 blur-2xl" />
            <div className="absolute -bottom-[50px] -left-[50px] w-[150px] h-[150px] rounded-full bg-[#7C4DFF]/15 blur-2xl" />

            {/* Pipeline Visual Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF4081] animate-pulse">schema</span>
                <span className="font-mono text-xs uppercase tracking-wider text-[#C1B9CA]">Live Pipeline</span>
              </div>
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 font-mono text-[10px] text-green-400 border border-green-500/20">
                ACTIVE
              </span>
            </div>

            {/* Animated SVG Connections */}
            <div className="relative h-64 flex flex-col justify-between z-10">
              
              {/* Connector lines (rendered underneath nodes) */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 350 256">
                {/* Connection line 1 */}
                <path
                  d="M45 40 L45 100 L305 100 L305 150"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1.5"
                />
                {/* Active animated pulses */}
                <path
                  d="M45 40 L45 100 L305 100 L305 150"
                  fill="none"
                  stroke="url(#pulseGrad)"
                  strokeWidth="1.5"
                  className="animate-flow"
                />

                {/* Connection line 2 */}
                <path
                  d="M305 40 L305 100 L45 100 L45 150"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1.5"
                />
                
                {/* Connection line 3 */}
                <path
                  d="M45 190 L45 220"
                  fill="none"
                  stroke="rgba(255, 64, 129, 0.2)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M305 190 L305 220"
                  fill="none"
                  stroke="rgba(124, 77, 255, 0.2)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                <defs>
                  <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FF4081" stopOpacity="1" />
                    <stop offset="100%" stopColor="#7C4DFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* NODE ROW 1: INPUT SOURCES */}
              <div className="flex justify-between items-center relative">
                {/* Doc Crawler Node */}
                <div 
                  className={`w-[110px] rounded-xl border p-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    activeStep === 0 
                      ? "border-[#FF6B35] bg-[#FF6B35]/5 shadow-[0_0_15px_rgba(255,107,53,0.15)]"
                      : "border-white/5 bg-[#0D081D]/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-[#FF6B35] mb-1">
                    captive_portal
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">crawler</span>
                </div>

                {/* PDF Reader Node */}
                <div 
                  className={`w-[110px] rounded-xl border p-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    activeStep === 1 
                      ? "border-[#FF4081] bg-[#FF4081]/5 shadow-[0_0_15px_rgba(255,64,129,0.15)]"
                      : "border-white/5 bg-[#0D081D]/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-[#FF4081] mb-1">
                    picture_as_pdf
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">pdf ingest</span>
                </div>
              </div>

              {/* NODE ROW 2: PROCESSING LAYER */}
              <div className="flex justify-center items-center relative my-4">
                <div 
                  className={`w-[140px] rounded-xl border p-3 flex flex-col items-center justify-center transition-all duration-500 bg-[#0F0A24] ${
                    activeStep === 2 
                      ? "border-[#7C4DFF] bg-[#7C4DFF]/10 shadow-[0_0_20px_rgba(124,77,255,0.25)]"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Vector Index</span>
                  </div>
                  <div className="w-full bg-white/5 h-[3px] rounded-full overflow-hidden mt-1">
                    <div 
                      className="bg-gradient-to-r from-[#FF6B35] to-[#FF4081] h-full rounded-full transition-all duration-1000"
                      style={{ width: activeStep === 2 ? '100%' : '15%' }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-white/40 mt-1">Ingesting data...</span>
                </div>
              </div>

              {/* NODE ROW 3: MCP ENDPOINTS */}
              <div className="flex justify-between items-center relative">
                {/* SSE Endpoint Node 1 */}
                <div 
                  className={`w-[110px] rounded-xl border p-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    activeStep === 3 
                      ? "border-[#FF4081] bg-[#FF4081]/5 shadow-[0_0_15px_rgba(255,64,129,0.15)]"
                      : "border-white/5 bg-[#0D081D]/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-[#FF4081] mb-1">
                    terminal
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">Cursor IDE</span>
                </div>

                {/* SSE Endpoint Node 2 */}
                <div 
                  className={`w-[110px] rounded-xl border p-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    activeStep === 3 
                      ? "border-[#7C4DFF] bg-[#7C4DFF]/5 shadow-[0_0_15px_rgba(124,77,255,0.15)]"
                      : "border-white/5 bg-[#0D081D]/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-[#7C4DFF] mb-1">
                    smart_toy
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">Claude App</span>
                </div>
              </div>

            </div>

            {/* Simulated Live Deployment Status Card */}
            <div className="mt-8 rounded-2xl border border-white/5 bg-[#050308]/60 p-4 font-mono text-[11px] text-[#C1B9CA] space-y-2.5 relative">
              <div className="flex items-center justify-between text-white/40 border-b border-white/5 pb-2 mb-2">
                <span>DEPLOYMENT STATUS</span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block animate-ping" />
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Runtime:</span>
                <span className="text-white font-semibold">Cloudflare Worker</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Index Latency:</span>
                <span className="text-white font-semibold">142ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Ingest SSE Endpoint:</span>
                <span className="text-[#FF4081] font-semibold truncate max-w-[150px]">
                  /api/mcp/cf-9a...
                </span>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  )
}