"use client"

import {
  AnimatePresence,
  motion,
} from "framer-motion"
import { Brain, Database, Globe, Scissors, Rocket } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import Logo from "@/components/logo"

const url = "https://tailwindcss.com/docs"

export default function DemoPage() {
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()
  const [stage, setStage] = useState(0)
  const [typedUrl, setTypedUrl] = useState("")
  const [chunkCount, setChunkCount] = useState(0)

  /* =========================
     STAGE LOOP
  ========================= */
  useEffect(() => {
    const timers: number[] = []

    // Stage progression scheduled once on mount
    timers.push(
      // show scraping input
      window.setTimeout(() => setStage(1), 2500)
    )

    timers.push(
      // show chunking counter
      window.setTimeout(() => setStage(2), 6500)
    )

    timers.push(
      // show deploy slide after chunks
      window.setTimeout(() => setStage(3), 10000)
    )

    timers.push(
      // after deploy slide, redirect home
      window.setTimeout(() => {
        router.push("/")
      }, 13500)
    )

    return () => timers.forEach(clearTimeout)
  }, [router])

  /* URL TYPING */
  useEffect(() => {
    if (stage !== 0) return

    let i = 0
    const interval = setInterval(() => {
      setTypedUrl(url.slice(0, i + 1))
      i++
      if (i >= url.length) {
        clearInterval(interval)
      }
    }, 55)

    return () => clearInterval(interval)
  }, [stage])

  /* COUNTER */
  useEffect(() => {
    if (stage !== 2) return

    let current = 0
    const target = 1247
    const interval = setInterval(() => {
      current += 37
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setChunkCount(current)
    }, 40)

    return () => clearInterval(interval)
  }, [stage])

  /* PARTICLES */
  const particles = useMemo(() => {
    return Array.from({
      length: 28,
    }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1.5,
    }))
  }, [])

  return (
    <main 
      className="landing-theme relative min-h-screen overflow-x-hidden flex flex-col justify-center items-center py-20 px-6 transition-colors duration-300 selection:bg-[#FF4081]/30 selection:text-[var(--text-primary)]"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* MESH GRID */}
      <div 
        className="absolute inset-0 bg-[size:48px_48px] opacity-70 pointer-events-none z-0" 
        style={{
          backgroundImage: 'linear-gradient(var(--l-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--l-grid-line) 1px, transparent 1px)'
        }}
      />
      
      {/* Vignette for depth */}
      <div 
        className="absolute inset-0 opacity-95 transition-all duration-500 pointer-events-none z-0" 
        style={{
          backgroundImage: 'radial-gradient(circle at center, transparent 30%, var(--bg-primary) 100%)'
        }}
      />

      {/* GLOWS */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full blur-[160px] opacity-70 transition-all duration-300 z-0" style={{ background: 'var(--gradient-glow-1)' }} />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full blur-[180px] opacity-70 transition-all duration-300 z-0" style={{ background: 'var(--gradient-glow-2)' }} />

      {/* HEADER NAVBAR MOCK FOR DEMO PAGE */}
      <div className="absolute left-0 right-0 top-6 z-50 flex items-center justify-between px-8">
        <Link href="/" className="group flex items-center gap-3 cursor-pointer">
          <Logo size={32} className="transition-all duration-300 group-hover:scale-105" />
          <span 
            className="text-lg font-bold tracking-tight transition-all duration-300"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            MCP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4081] to-[#FF6B35]">Builder</span>
          </span>
        </Link>

        {/* THEME TOGGLE FOR DEMO PAGE */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[var(--bg-card-hover)] cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
          }}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </div>

      {/* FOOTER SEE HOW IT WORKS */}
      <div 
        className="absolute bottom-8 right-8 z-50 text-sm font-semibold tracking-tight transition-all duration-300 cursor-pointer"
        style={{ color: 'var(--text-muted)' }}
      >
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
          See how it works →
        </Link>
      </div>

      {/* DOTS INDICATOR */}
      <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        {[0, 1, 2, 3].map((dot) => (
          <motion.div
            key={dot}
            animate={{
              width: stage === dot ? 32 : 8,
              opacity: stage === dot ? 1 : 0.3,
            }}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              background: stage === dot ? 'var(--gradient-primary)' : 'var(--text-muted)',
            }}
          />
        ))}
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative w-full max-w-5xl z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            animate={{ rotateX: 2, rotateY: -2 }}
            transition={{ duration: 2 }}
            className="relative rounded-[2.5rem] border p-10 backdrop-blur-3xl transition-colors duration-500 flex flex-col justify-center items-center min-h-[550px]"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              boxShadow: isDark 
                ? '0 25px 70px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                : '0 25px 70px rgba(21, 14, 34, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.85)',
            }}
          >
            <AnimatePresence mode="wait">
              {/* STAGE 0: TYPING URL */}
              {stage === 0 && (
                <motion.div
                  key="stage0"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center w-full max-w-2xl text-center"
                >
                  <motion.div
                    animate={{
                      boxShadow: isDark ? [
                        "0 0 0px rgba(255, 64, 129, 0.05)",
                        "0 0 30px rgba(255, 64, 129, 0.15)",
                        "0 0 0px rgba(255, 64, 129, 0.05)",
                      ] : [
                        "0 0 0px rgba(255, 64, 129, 0.02)",
                        "0 0 20px rgba(255, 64, 129, 0.06)",
                        "0 0 0px rgba(255, 64, 129, 0.02)",
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-full rounded-2xl border p-4 flex items-center gap-4 transition-colors duration-300"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border-primary)'
                    }}
                  >
                    <Globe className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                    <input
                      readOnly
                      value={typedUrl}
                      className="w-full bg-transparent text-base outline-none font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </motion.div>

                  <motion.button
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="mt-10 rounded-xl px-8 py-4 font-semibold text-white transition-all duration-300 shadow-md"
                    style={{
                      background: 'var(--gradient-primary)',
                      boxShadow: '0 6px 20px rgba(255, 64, 129, 0.25)',
                    }}
                  >
                    Build MCP Server
                  </motion.button>
                </motion.div>
              )}

              {/* STAGE 1: CRAWLER / FLOW */}
              {stage === 1 && (
                <motion.div
                  key="stage1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative flex flex-col items-center justify-center w-full"
                >
                  {/* PARTICLES */}
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: -100 }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: 200,
                      }}
                      transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                      }}
                      className="absolute top-[10%] h-1.5 w-1.5 rounded-full"
                      style={{
                        left: `${p.left}%`,
                        background: 'var(--accent-primary)',
                      }}
                    />
                  ))}

                  <div className="flex flex-col items-center gap-8 lg:flex-row">
                    {[
                      { title: "Scraping", icon: Globe },
                      { title: "Chunking", icon: Scissors },
                      { title: "Embedding", icon: Brain },
                    ].map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div key={item.title} className="relative flex items-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.4 }}
                            className="w-[240px] rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300"
                            style={{
                              background: 'var(--bg-elevated)',
                              borderColor: 'var(--border-primary)',
                            }}
                          >
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
                              <Icon className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <h2 
                              className="mb-4 text-xl font-bold tracking-tight"
                              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                            >
                              {item.title}
                            </h2>
                            <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--border-primary)' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.2, delay: i * 0.4 }}
                                className="h-full rounded-full"
                                style={{ background: 'var(--gradient-primary)' }}
                              />
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: CHUNKS STORED */}
              {stage === 2 && (
                <motion.div
                  key="stage2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative flex flex-col items-center justify-center w-full"
                >
                  {/* CHUNKING PARTICLES */}
                  {[...Array(26)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: -180 }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: 0,
                        x: Math.random() * 120 - 60,
                      }}
                      transition={{
                        duration: 1.8,
                        delay: i * 0.05,
                        repeat: Infinity,
                      }}
                      className="absolute h-1.5 w-1.5 rounded-full"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                  ))}

                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex h-44 w-44 items-center justify-center rounded-full border shadow-xl"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border-accent)',
                      boxShadow: '0 0 50px rgba(var(--accent-rgb), 0.12)',
                    }}
                  >
                    <Database className="h-16 w-16" style={{ color: 'var(--accent-primary)' }} />
                  </motion.div>

                  <motion.h2 
                    className="mt-10 text-5xl font-extrabold tracking-tight"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    {chunkCount.toLocaleString()}
                  </motion.h2>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    chunks stored
                  </p>
                </motion.div>
              )}

              {/* STAGE 3: DEPLOYMENT STATUS */}
              {stage === 3 && (
                <motion.div
                  key="stage3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative flex flex-col items-center justify-center w-full"
                >
                  <div 
                    className="relative z-10 w-full max-w-2xl rounded-2xl border p-8 backdrop-blur-2xl transition-all duration-300"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border-primary)',
                    }}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: 'var(--accent-primary)' }}>
                          MCP GENERATION
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                          Deploying Runtime
                        </h2>
                      </div>

                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300"
                        style={{
                          background: 'var(--bg-secondary)',
                          borderColor: 'var(--border-primary)',
                        }}
                      >
                        <Rocket className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                      </motion.div>
                    </div>

                    <div 
                      className="rounded-xl border p-5 font-mono text-xs space-y-3 transition-all duration-300"
                      style={{
                        background: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <p><span style={{ color: 'var(--accent-highlight)' }}>SERVER_ID</span> = "abc-123"</p>
                      <p><span style={{ color: 'var(--accent-secondary)' }}>TOOL</span> = "Search Tailwind CSS docs"</p>
                      <p><span style={{ color: 'var(--accent-primary)' }}>VECTOR_DB</span> = CONNECTED</p>
                      <p className="text-green-500 font-bold">DEPLOYMENT_STATUS = SUCCESS</p>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, y: 10 }}
                      animate={{ scale: [1, 1.02, 1], opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="mx-auto mt-8 w-fit rounded-xl border px-8 py-3 text-base font-bold tracking-[0.25em] text-green-500 shadow-sm"
                      style={{
                        background: 'rgba(16, 185, 129, 0.05)',
                        borderColor: 'rgba(16, 185, 129, 0.15)',
                      }}
                    >
                      DEPLOYED
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}