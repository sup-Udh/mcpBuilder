"use client"

import {
  AnimatePresence,
  motion,
} from "framer-motion"

import { Brain, Database, Globe, Scissors, Rocket } from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import { useRouter } from "next/navigation"

const url = "https://tailwindcss.com/docs"

export default function DemoPage() {

  const [stage, setStage] =
    useState(0)

  const [typedUrl, setTypedUrl] =
    useState("")

  const [chunkCount, setChunkCount] =
    useState(0)

  /* =========================
     STAGE LOOP
  ========================= */

  const router = useRouter()

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

    // run once
  }, [])

  /* URL TYPING */
  useEffect(() => {

    if (stage !== 0) return

    let i = 0

    const interval =
      setInterval(() => {

        setTypedUrl(
          url.slice(0, i + 1)
        )

        i++

        if (i >= url.length) {
          clearInterval(interval)
        }

      }, 55)

    return () =>
      clearInterval(interval)

  }, [stage])

  /* COUNTER */
  useEffect(() => {

    if (stage !== 2) return

    let current = 0

    const target = 1247

    const interval =
      setInterval(() => {

        current += 37

        if (current >= target) {

          current = target

          clearInterval(interval)

        }

        setChunkCount(current)

      }, 40)

    return () =>
      clearInterval(interval)

  }, [stage])

  /* CHAT removed: demo now redirects after chunks stored */

  /* PARTICLES */
  const particles = useMemo(() => {

    return Array.from({
      length: 28,
    }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay:
        Math.random() * 0.5,
      duration:
        1 +
        Math.random() * 1.5,
    }))

  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">

      {/* GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundSize:
            "40px 40px",

          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
        }}
      />

      {/* GLOWS */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/10 blur-[180px]" />

      {/* TOP */}
      <div className="absolute left-8 top-8 z-50 flex items-center gap-3">

        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-400" />

        <h1 className="text-xl font-bold tracking-tight text-violet-300">
          MCP Builder
        </h1>

      </div>

      {/* FOOTER */}
      <div className="absolute bottom-8 right-8 z-50 text-sm text-white/40 transition hover:text-white">
        See how it works →
      </div>

      {/* DOTS */}
      <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">

        {[0, 1, 2].map((dot) => (

          <motion.div
            key={dot}
            animate={{
              width: stage === dot ? 38 : 10,
              opacity: stage === dot ? 1 : 0.3,
            }}
            className="h-2 rounded-full bg-violet-300"
          />

        ))}

      </div>

      {/* MAIN */}
      <div className="flex h-full items-center justify-center px-6">

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="relative w-full max-w-7xl"
          style={{
            perspective: "1200px",
          }}
        >

          <motion.div
            animate={{
              rotateX: 5,
              rotateY: -4,
            }}
            transition={{
              duration: 2,
            }}
            className="relative rounded-[3rem] border border-white/10 bg-[#0B1120]/60 p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >

            <AnimatePresence mode="wait">

              {/* =========================
                 STAGE 1
              ========================= */}

              {stage === 0 && (
                <motion.div
                  key="stage1"
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                  }}
                  className="flex h-[650px] flex-col items-center justify-center"
                >

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(59,130,246,0.1)",
                        "0 0 40px rgba(59,130,246,0.25)",
                        "0 0 0px rgba(59,130,246,0.1)",
                      ],
                    }}
                    transition={{
                      repeat:
                        Infinity,
                      duration: 2,
                    }}
                    className="w-full max-w-3xl rounded-[2rem] border border-blue-300/20 bg-[#111827]/90 p-5"
                  >

                    <div className="flex items-center gap-4">

                      <Globe className="h-6 w-6 text-blue-300" />

                      <input
                        readOnly
                        value={typedUrl}
                        className="w-full bg-transparent text-lg text-white outline-none"
                      />

                    </div>

                  </motion.div>

                  <motion.button
                    animate={{
                      scale: [
                        1,
                        1.03,
                        1,
                      ],
                    }}
                    transition={{
                      repeat:
                        Infinity,
                      duration: 1.8,
                    }}
                    className="mt-10 rounded-2xl bg-violet-300 px-8 py-4 font-semibold text-[#020617] shadow-[0_0_40px_rgba(167,139,250,0.4)]"
                  >

                    Build MCP Server

                  </motion.button>

                </motion.div>
              )}

              {/* =========================
                 STAGE 2
              ========================= */}

              {stage === 1 && (
                <motion.div
                  key="stage2"
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                  }}
                  className="relative flex h-[650px] flex-col items-center justify-center"
                >

                  {/* PARTICLES */}
                  {particles.map((p) => (

                    <motion.div
                      key={p.id}
                      initial={{
                        opacity: 0,
                        y: -120,
                      }}
                      animate={{
                        opacity: [
                          0,
                          1,
                          0,
                        ],

                        y: 320,
                      }}
                      transition={{
                        duration:
                          p.duration,

                        delay:
                          p.delay,

                        repeat:
                          Infinity,
                      }}
                      className="absolute top-[10%] h-2 w-2 rounded-full bg-blue-300"
                      style={{
                        left: `${p.left}%`,
                      }}
                    />

                  ))}

                  {/* FLOW */}
                  <div className="flex flex-col items-center gap-12 lg:flex-row">

                    {[
                      {
                        title:
                          "Scraping",

                        icon: Globe,
                      },

                      {
                        title:
                          "Chunking",

                        icon: Scissors,
                      },

                      {
                        title:
                          "Embedding",

                        icon: Brain,
                      },
                    ].map(
                      (item, i) => {

                        const Icon =
                          item.icon

                        return (
                          <div
                            key={
                              item.title
                            }
                            className="relative flex items-center"
                          >

                            <motion.div
                              initial={{
                                opacity: 0,
                                scale: 0.8,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                delay:
                                  i * 0.5,
                              }}
                              className="w-[260px] rounded-[2rem] border border-white/10 bg-[#111827]/80 p-8"
                            >

                              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400/10">

                                <Icon className="h-8 w-8 text-blue-300" />

                              </div>

                              <h2 className="mb-4 text-2xl font-bold">
                                {
                                  item.title
                                }
                              </h2>

                              <div className="h-2 overflow-hidden rounded-full bg-white/10">

                                <motion.div
                                  initial={{
                                    width: 0,
                                  }}
                                  animate={{
                                    width:
                                      "100%",
                                  }}
                                  transition={{
                                    duration: 1.2,
                                    delay:
                                      i *
                                      0.5,
                                  }}
                                  className="h-full rounded-full bg-gradient-to-r from-blue-300 to-violet-300"
                                />

                              </div>

                            </motion.div>

                          </div>
                        )
                      }
                    )}

                  </div>

                </motion.div>
              )}

              {/* =========================
                 STAGE 3
              ========================= */}

              {stage === 2 && (
                <motion.div
                  key="stage3"
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                  }}
                  className="relative flex h-[650px] flex-col items-center justify-center"
                >

                  {[...Array(26)].map(
                    (_, i) => (

                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          y: -250,
                        }}
                        animate={{
                          opacity: [
                            0,
                            1,
                            0,
                          ],

                          y: 0,

                          x:
                            Math.random() *
                              120 -
                            60,
                        }}
                        transition={{
                          duration: 1.8,
                          delay:
                            i * 0.05,
                          repeat:
                            Infinity,
                        }}
                        className="absolute h-2 w-2 rounded-full bg-cyan-300"
                      />

                    )
                  )}

                  <motion.div
                    animate={{
                      scale: [
                        1,
                        1.05,
                        1,
                      ],
                    }}
                    transition={{
                      repeat:
                        Infinity,
                      duration: 2,
                    }}
                    className="flex h-56 w-56 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_60px_rgba(34,211,238,0.2)]"
                  >

                    <Database className="h-24 w-24 text-cyan-200" />

                  </motion.div>

                  <motion.h2 className="mt-10 text-5xl font-black">

                    {chunkCount.toLocaleString()}

                  </motion.h2>

                  <p className="mt-3 text-white/50">
                    chunks stored
                  </p>

                </motion.div>
              )}

              
              {/* =========================
                 STAGE 3 — DEPLOY
              ========================= */}

              {stage === 3 && (
                <motion.div
                  key="stage3-deploy"
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                  }}
                  className="relative flex h-[650px] flex-col items-center justify-center"
                >

                  <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-black/40 p-8 backdrop-blur-2xl">

                    <div className="mb-6 flex items-center justify-between">

                      <div>

                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-300/60">
                          MCP GENERATION
                        </p>

                        <h2 className="mt-2 text-4xl font-black">
                          Deploying Runtime
                        </h2>

                      </div>

                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 5,
                          ease: "linear",
                        }}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10"
                      >

                        <Rocket className="h-8 w-8 text-cyan-200" />

                      </motion.div>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#020617]/80 p-6 font-mono text-sm">

                      <p className="text-blue-300">SERVER_ID = "abc-123"</p>

                      <p className="mt-4 text-violet-300">TOOL = "Search Tailwind CSS docs"</p>

                      <p className="mt-4 text-cyan-300">VECTOR_DB = CONNECTED</p>

                      <p className="mt-4 text-green-300">DEPLOYMENT_STATUS = SUCCESS</p>

                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, y: 10 }}
                      animate={{ scale: [1, 1.03, 1], opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="mx-auto mt-8 w-fit rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-8 py-4 text-3xl font-black tracking-[0.2em] text-emerald-300 shadow-[0_0_30px_rgba(74,222,128,0.18)]"
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