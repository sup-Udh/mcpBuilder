"use client"

import { useState } from "react"

const sources = [
  {
    name: "Website",
    icon: "language",
    enabled: true,
    description: "Ingest websites and webpages",
  },
  {
    name: "Docs",
    icon: "description",
    enabled: true,
    description: "Import documentation sources",
  },
  {
    name: "PDF",
    icon: "picture_as_pdf",
    enabled: true,
    description: "Upload and process PDF files",
  },
  {
    name: "GitHub",
    icon: "terminal",
    enabled: false,
    description: "Coming soon",
  },
  {
    name: "RSS",
    icon: "rss_feed",
    enabled: false,
    description: "Coming soon",
  },
  {
    name: "Database",
    icon: "database",
    enabled: false,
    description: "Coming soon",
  },
]

export default function CreatePage() {

  /*
    -----------------------------------
    STATES
    -----------------------------------
  */

  // current carousel step
  const [step, setStep] = useState(1)

  // selected MCP source
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  // URL input for ingestion
  const [sourceUrl, setSourceUrl] = useState("")

  /*
    -----------------------------------
    NEXT STEP HANDLER
    -----------------------------------
  */

  const handleNext = () => {

    // STEP 1 -> STEP 2
    if (step === 1) {

      // prevent moving without source selection
      if (!selectedSource) return

      setStep(2)
      return
    }

    // STEP 2 -> STEP 3
    if (step === 2) {

      // prevent empty url
      if (!sourceUrl.trim()) return

      setStep(3)
      return
    }
  }

  /*
    -----------------------------------
    BACK STEP HANDLER
    -----------------------------------
  */

  const handleBack = () => {

    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-[#e5e2e3]">

      {/* GOOGLE MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* ========================================= */}
      {/* BACKGROUND GRID */}
      {/* ========================================= */}

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

      {/* ========================================= */}
      {/* MAIN SECTION */}
      {/* ========================================= */}

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">

        {/* MAIN CARD */}
        <div
          className="relative w-full max-w-[760px] overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(10,10,11,0.6)] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl md:p-12"
        >

          {/* ========================================= */}
          {/* TOP DOTS */}
          {/* ========================================= */}

          <div className="absolute right-6 top-6 opacity-20">

            <div className="grid grid-cols-4 gap-2">

              <div className="h-1 w-1 rounded-full bg-blue-200" />
              <div className="h-1 w-1 rounded-full bg-blue-200" />
              <div className="h-1 w-1 rounded-full bg-blue-200" />
              <div className="h-1 w-1 rounded-full bg-blue-200" />

            </div>

          </div>

          {/* ========================================= */}
          {/* STEP INDICATORS */}
          {/* ========================================= */}

          <div className="mb-12 flex justify-center gap-2">

            <div
              className={`h-1 w-12 rounded-full transition-all duration-300 ${
                step >= 1
                  ? "bg-blue-200"
                  : "bg-white/10"
              }`}
            />

            <div
              className={`h-1 w-12 rounded-full transition-all duration-300 ${
                step >= 2
                  ? "bg-blue-200"
                  : "bg-white/10"
              }`}
            />

            <div
              className={`h-1 w-12 rounded-full transition-all duration-300 ${
                step >= 3
                  ? "bg-blue-200"
                  : "bg-white/10"
              }`}
            />

            <div className="h-1 w-12 rounded-full bg-white/10" />
            <div className="h-1 w-12 rounded-full bg-white/10" />

          </div>

          {/* ========================================= */}
          {/* STEP 1 */}
          {/* SOURCE SELECT */}
          {/* ========================================= */}

          {step === 1 && (
            <div className="animate-in fade-in duration-500">

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
                  <div
                    key={source.name}
                    className="group relative"
                  >

                    {/* ========================================= */}
                    {/* TOOLTIP FOR DISABLED SOURCES */}
                    {/* ========================================= */}

                    {!source.enabled && (
                      <div className="pointer-events-none absolute -top-16 left-1/2 z-30 w-[220px] -translate-x-1/2 rounded-2xl border border-blue-300/10 bg-[#0B1120]/95 p-4 opacity-0 shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-xl transition-all duration-300 group-hover:-top-20 group-hover:opacity-100">

                        <div className="mb-2 flex items-center gap-2">

                          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-300" />

                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-200">
                            In Development
                          </span>

                        </div>

                        <p className="text-sm leading-relaxed text-white/60">
                          We’re still implementing this MCP source. Support
                          will arrive in a future update.
                        </p>

                      </div>
                    )}

                    {/* SOURCE CARD */}
                    <button
                      disabled={!source.enabled}
                      onClick={() =>
                        source.enabled && setSelectedSource(source.name)
                      }
                      className={`w-full rounded-2xl border p-6 transition-all duration-300 ${
                        source.enabled
                          ? selectedSource === source.name
                            ? "border-blue-300/40 bg-blue-400/10 ring-1 ring-blue-300/20 hover:-translate-y-1"
                            : "border-white/5 bg-[#161617] hover:-translate-y-1 hover:border-blue-300/20 hover:shadow-[0_0_25px_rgba(173,198,255,0.08)]"
                          : "cursor-not-allowed border-white/5 bg-[#111214] opacity-40 grayscale"
                      }`}
                    >

                      <div className="flex flex-col items-center gap-4">

                        <span
                          className={`material-symbols-outlined text-4xl ${
                            source.enabled
                              ? "text-blue-200"
                              : "text-white/40"
                          }`}
                        >
                          {source.icon}
                        </span>

                        <div className="text-center">

                          <span
                            className={`block font-mono text-xs uppercase tracking-widest ${
                              source.enabled
                                ? "text-white"
                                : "text-white/40"
                            }`}
                          >
                            {source.name}
                          </span>

                          <span className="mt-2 block text-xs text-white/40">
                            {source.description}
                          </span>

                        </div>

                      </div>

                    </button>

                  </div>
                ))}

              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* STEP 2 */}
          {/* URL INPUT */}
          {/* ========================================= */}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-5 duration-500">

              {/* HEADER */}
              <div className="mb-12 text-center">

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-300/10 bg-blue-300/5">

                  <span className="material-symbols-outlined text-5xl text-blue-200">
                    link
                  </span>

                </div>

                <h2 className="mb-3 text-4xl font-bold tracking-tight">
                  Enter Source URL
                </h2>

                <p className="mx-auto max-w-xl text-white/50">
                  Paste the URL you want MCP Builder to ingest and process.
                </p>

              </div>

              {/* URL INPUT BOX */}
              <div className="mb-12">

                <label className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-blue-200/70">

                  {selectedSource} Source URL

                </label>

                <div className="rounded-2xl border border-white/10 bg-[#111214] p-2 transition focus-within:border-blue-300/30 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.08)]">

                  <input
                    type="text"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://example.com/docs"
                    className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-white/30"
                  />

                </div>

                {/* HELPER TEXT */}
                <div className="mt-4 flex items-center gap-2 text-sm text-white/40">

                  <span className="material-symbols-outlined text-base">
                    info
                  </span>

                  <span>
                    Supported formats: websites, docs pages, and PDFs.
                  </span>

                </div>

              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* STEP 3 */}
          {/* CONFIRM */}
          {/* ========================================= */}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-5 duration-500">

              <div className="py-10 text-center">

                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10">

                  <span className="material-symbols-outlined text-6xl text-green-300">
                    check
                  </span>

                </div>

                <h2 className="mb-4 text-4xl font-bold">
                  Ready to Deploy
                </h2>

                <p className="mx-auto mb-10 max-w-xl text-white/50">
                  Your MCP server configuration is ready. Continue to start
                  ingestion and deployment.
                </p>

                {/* SUMMARY CARD */}
                <div className="mx-auto max-w-[500px] rounded-3xl border border-white/10 bg-[#111214] p-6 text-left">

                  <div className="mb-6 flex items-center justify-between">

                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-200/60">
                      Configuration
                    </span>

                    <div className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-300">
                      Ready
                    </div>

                  </div>

                  <div className="space-y-5">

                    <div>

                      <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/40">
                        Source Type
                      </p>

                      <p className="text-lg text-white">
                        {selectedSource}
                      </p>

                    </div>

                    <div>

                      <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/40">
                        URL
                      </p>

                      <p className="break-all text-white/70">
                        {sourceUrl}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================= */}
          {/* FOOTER ACTIONS */}
          {/* ========================================= */}

          <div className="flex items-center justify-between border-t border-white/5 pt-8">

            {/* BACK BUTTON */}
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 rounded-xl border px-6 py-3 transition active:scale-[0.98] ${
                step === 1
                  ? "cursor-not-allowed border-white/5 text-white/20"
                  : "border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >

              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>

              Back

            </button>

            {/* NEXT BUTTON */}
            <div className="flex items-center gap-4">

              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedSource) ||
                  (step === 2 && !sourceUrl.trim())
                }
                className={`flex items-center gap-2 rounded-xl px-8 py-3 font-semibold transition active:scale-[0.98] ${
                  (step === 1 && !selectedSource) ||
                  (step === 2 && !sourceUrl.trim())
                    ? "cursor-not-allowed bg-white/10 text-white/30"
                    : "bg-blue-200 text-black shadow-[0_0_25px_rgba(173,198,255,0.25)] hover:brightness-110"
                }`}
              >

                {step === 3 ? "Deploy MCP" : "Next"}

                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================= */}
      {/* LEFT DECOR */}
      {/* ========================================= */}

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

    </main>
  )
}