"use client"

import { useState } from "react"

const sources = [
  {
    name: "Website",
    icon: "language",
  },
  {
    name: "Docs",
    icon: "description",
  },
  {
    name: "PDF",
    icon: "picture_as_pdf",
  },
  {
    name: "GitHub",
    icon: "terminal",
  },
  {
    name: "RSS",
    icon: "rss_feed",
  },
  {
    name: "Database",
    icon: "database",
  },
]

export default function CreatePage() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-[#e5e2e3]">

      {/* GOOGLE ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* BACKGROUND GRID */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* GLOW ORBS */}
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] z-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] z-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]" />

      {/* MAIN */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">

        {/* WIZARD CARD */}
        <div
          className="relative w-full max-w-[720px] overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(10,10,11,0.6)] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl md:p-12"
        >

          {/* TOP DOTS */}
          <div className="absolute right-6 top-6 opacity-20">

            <div className="grid grid-cols-4 gap-2">

              <div className="h-1 w-1 rounded-full bg-blue-200" />
              <div className="h-1 w-1 rounded-full bg-blue-200" />
              <div className="h-1 w-1 rounded-full bg-blue-200" />
              <div className="h-1 w-1 rounded-full bg-blue-200" />

            </div>

          </div>

          {/* STEP INDICATORS */}
          <div className="mb-12 flex justify-center gap-2">

            <div className="h-1 w-12 rounded-full bg-blue-200" />
            <div className="h-1 w-12 rounded-full bg-white/10" />
            <div className="h-1 w-12 rounded-full bg-white/10" />
            <div className="h-1 w-12 rounded-full bg-white/10" />
            <div className="h-1 w-12 rounded-full bg-white/10" />

          </div>

          {/* HEADER */}
          <div className="mb-12 text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">

              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2qpOVieWk54PoJ1wmrDzOJqXk6uiL6oFA6E_IDhj8UMBtcO6BMn8wHlS1IJHi0jdpY75VTZemzyXpUZ8takPy3iAMQNvnUagOldAXpIeo0t1igEu1FgawXBesIBxWxXrbXxh5vm2ktwqcbfQXyDskasaejJTDmLO-3fm-kR9w4X-zTyBcesyu8BroaeOuiNOQMD3hOtujX8OGGTgwATfXAiq8qRKUhjNwOz5VJbOhxshUvmubpa12Atz2vLHH3AKqcO1Z7YOc8GZR"
                alt="Infrastructure"
                className="h-12 w-12"
              />

            </div>

            <h2 className="mb-3 text-4xl font-bold tracking-tight">
              Choose MCP Source
            </h2>

            <p className="mx-auto max-w-xl text-white/50">
              Select the data origin to train your Model Context Protocol
              agent.
            </p>

          </div>

          {/* SOURCE GRID */}
          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3">

            {sources.map((source) => (
              <button
                key={source.name}
                onClick={() => setSelectedSource(source.name)}
                className={`group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(173,198,255,0.08)] ${
                  selectedSource === source.name
                    ? "border-blue-300/40 bg-blue-400/10 ring-1 ring-blue-300/20"
                    : "border-white/5 bg-[#161617] hover:border-blue-300/20"
                }`}
              >

                <div className="flex flex-col items-center gap-4">

                  <span className="material-symbols-outlined text-4xl text-blue-200">
                    {source.icon}
                  </span>

                  <span className="font-mono text-xs uppercase tracking-widest text-white">
                    {source.name}
                  </span>

                </div>

              </button>
            ))}

          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-white/5 pt-8">

            <button className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-white/60 transition hover:bg-white/5 hover:text-white active:scale-[0.98]">

              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>

              Back

            </button>

            <div className="flex items-center gap-4">

              <button className="px-6 py-3 text-white/50 transition hover:text-white">
                Skip
              </button>

              <button className="flex items-center gap-2 rounded-xl bg-blue-200 px-8 py-3 font-semibold text-black shadow-[0_0_25px_rgba(173,198,255,0.25)] transition hover:brightness-110 active:scale-[0.98]">

                Next

                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* LEFT DECOR */}
      <div className="pointer-events-none fixed left-10 top-1/2 hidden -translate-y-1/2 xl:block">

        <div className="flex flex-col gap-3">

          <span className="font-mono text-xs uppercase tracking-[0.3em] text-blue-200/50">
            Context
          </span>

          <div className="h-px w-12 bg-blue-200/20" />

          <p className="max-w-[220px] font-mono text-sm leading-relaxed text-white/40">
            Configuring environment variables for automated node deployment.
          </p>

        </div>

      </div>

      {/* RIGHT DECOR */}


    </main>
  )
}