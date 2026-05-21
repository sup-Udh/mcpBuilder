"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/vector/client"

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
  const router = useRouter()

  const supabase = createClient()

  /*
    =========================================
    STATES
    =========================================
  */

  const [step, setStep] = useState(1)

  const [selectedSource, setSelectedSource] =
    useState<string | null>(null)

  const [sourceUrl, setSourceUrl] =
    useState("")

  const [serverName, setServerName] =
    useState("")

  const [deploying, setDeploying] =
    useState(false)

  const [error, setError] =
    useState("")

  const [deployStatus, setDeployStatus] =
    useState("")

  const [deployServerId, setDeployServerId] =
    useState<string | null>(null)

  const [deployStats, setDeployStats] =
    useState<{
      totalDocuments?: number
      totalChunks?: number
      totalEmbeddings?: number
      endpoint?: string
    }>({})

  const pollRef =
    useRef<NodeJS.Timeout | null>(null)

  // =========================================
  // CLEANUP POLLING ON UNMOUNT
  // =========================================

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
    }
  }, [])

  /*
    =========================================
    NEXT BUTTON
    =========================================
  */

  const handleNext = () => {
    setError("")

    // STEP 1 -> STEP 2
    if (step === 1) {
      if (!selectedSource) return

      setStep(2)
      return
    }

    // STEP 2 -> STEP 3
    if (step === 2) {
      if (
        !sourceUrl.trim() ||
        !serverName.trim()
      ) {
        setError(
          "Please fill all fields."
        )

        return
      }

      setStep(3)
      return
    }
  }

  /*
    =========================================
    BACK BUTTON
    =========================================
  */

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  /*
    =========================================
    DEPLOY HANDLER
    =========================================
  */

  const handleDeploy = async () => {
    try {
      setDeploying(true)

      setError("")

      setDeployStatus("pending")

      // =====================================
      // GET AUTH SESSION TOKEN
      // =====================================

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError(
          "You must be logged in."
        )

        setDeploying(false)

        return
      }

      // =====================================
      // CALL DEPLOY API
      // =====================================

      const response = await fetch(
        "/api/deploy",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            name: serverName,
            sourceUrl,
            sourceType:
              selectedSource,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Deployment failed"
        )

        setDeploying(false)

        return
      }

      const serverId = data.serverId

      setDeployServerId(serverId)

      // =====================================
      // POLL STATUS
      // =====================================

      pollRef.current = setInterval(
        async () => {
          try {
            const statusRes =
              await fetch(
                `/api/deploy/status?serverId=${serverId}`
              )

            const statusData =
              await statusRes.json()

            if (
              statusData.success &&
              statusData.server
            ) {
              const server =
                statusData.server

              setDeployStatus(
                server.deploymentStatus
              )

              setDeployStats({
                totalDocuments:
                  server.totalDocuments,
                totalChunks:
                  server.totalChunks,
                totalEmbeddings:
                  server.totalEmbeddings,
                endpoint:
                  server.endpoint,
              })

              // Terminal states
              if (
                server.deploymentStatus ===
                  "operational" ||
                server.deploymentStatus ===
                  "failed"
              ) {
                if (pollRef.current) {
                  clearInterval(
                    pollRef.current
                  )
                }

                if (
                  server.deploymentStatus ===
                  "operational"
                ) {
                  setTimeout(() => {
                    router.push(
                      "/dashboard/mcp-servers"
                    )
                  }, 2500)
                } else {
                  setError(
                    server.errorMessage ||
                      "Deployment failed"
                  )

                  setDeploying(false)
                }
              }
            }
          } catch {
            // Continue polling
          }
        },
        2000
      )
    } catch (err) {
      console.error(err)

      setError(
        "Something went wrong."
      )

      setDeploying(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-[#020617] text-[#e5e2e3]">

      {/* MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* GRID */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          backgroundSize:
            "40px 40px",

          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",

          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* GLOWS */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] z-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] z-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]" />

      {/* MAIN */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">

        {/* CARD */}
        <div className="relative w-full max-w-[760px] rounded-[2rem] border border-white/10 bg-[rgba(10,10,11,0.6)] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl md:p-12">

          {/* STEP INDICATORS */}
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

          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-in fade-in duration-500">

              <div className="mb-12 text-center">

                <h2 className="mb-3 text-4xl font-bold tracking-tight">
                  Choose MCP Source
                </h2>

                <p className="mx-auto max-w-xl text-white/50">
                  Select the data origin for
                  your MCP infrastructure.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                {sources.map((source) => (
                  <button
                    key={source.name}
                    disabled={!source.enabled}
                    onClick={() =>
                      source.enabled &&
                      setSelectedSource(
                        source.name
                      )
                    }
                    className={`rounded-2xl border p-6 transition-all duration-300 ${
                      source.enabled
                        ? selectedSource ===
                          source.name
                          ? "border-blue-300/40 bg-blue-400/10 ring-1 ring-blue-300/20"
                          : "border-white/5 bg-[#161617] hover:border-blue-300/20"
                        : "cursor-not-allowed border-white/5 bg-[#111214] opacity-40 grayscale"
                    }`}
                  >

                    <div className="flex flex-col items-center gap-4">

                      <span className="material-symbols-outlined text-4xl text-blue-200">
                        {source.icon}
                      </span>

                      <div className="text-center">

                        <span className="block font-mono text-xs uppercase tracking-widest">
                          {source.name}
                        </span>

                        <span className="mt-2 block text-xs text-white/40">
                          {
                            source.description
                          }
                        </span>

                      </div>

                    </div>

                  </button>
                ))}

              </div>

            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-5 duration-500">

              <div className="mb-12 text-center">

                <h2 className="mb-3 text-4xl font-bold tracking-tight">
                  Configure MCP
                </h2>

                <p className="mx-auto max-w-xl text-white/50">
                  Set up your MCP runtime
                  information.
                </p>

              </div>

              <div className="space-y-8">

                {/* SERVER NAME */}
                <div>

                  <label className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-blue-200/70">
                    MCP Server Name
                  </label>

                  <div className="rounded-2xl border border-white/10 bg-[#111214] p-2">

                    <input
                      type="text"
                      value={serverName}
                      onChange={(e) =>
                        setServerName(
                          e.target.value
                        )
                      }
                      placeholder="Docs Context Engine"
                      className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-white/30"
                    />

                  </div>

                </div>

                {/* URL */}
                <div>

                  <label className="mb-3 block font-mono text-xs uppercase tracking-[0.2em] text-blue-200/70">

                    {selectedSource} URL

                  </label>

                  <div className="rounded-2xl border border-white/10 bg-[#111214] p-2">

                    <input
                      type="text"
                      value={sourceUrl}
                      onChange={(e) =>
                        setSourceUrl(
                          e.target.value
                        )
                      }
                      placeholder="https://example.com/docs"
                      className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-white/30"
                    />

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-5 duration-500">

              <div className="mb-12 text-center">

                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10">

                  <span className="material-symbols-outlined text-6xl text-green-300">
                    {deploying ? "sync" : "verified"}
                  </span>

                </div>

                <h2 className="mb-3 text-4xl font-bold tracking-tight">
                  {deploying
                    ? deployStatus === "operational"
                      ? "Deployment Complete!"
                      : "Deploying MCP..."
                    : "Ready to Deploy"}
                </h2>

              </div>

              <div className="space-y-6 rounded-3xl border border-white/10 bg-[#111214] p-8">

                <div>

                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    MCP Name
                  </p>

                  <p className="text-xl font-semibold">
                    {serverName}
                  </p>

                </div>

                <div>

                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Source Type
                  </p>

                  <p className="text-white/70">
                    {selectedSource}
                  </p>

                </div>

                <div>

                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Source URL
                  </p>

                  <p className="break-all text-white/70">
                    {sourceUrl}
                  </p>

                </div>

                {/* DEPLOYMENT STATUS */}
                {deploying && (
                  <div className="mt-6 space-y-3 border-t border-white/5 pt-6">

                    <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-blue-200/70">
                      Pipeline Status
                    </p>

                    {[
                      { key: "pending", label: "Initializing pipeline" },
                      { key: "scraping", label: "Scraping website content" },
                      { key: "chunking", label: "Chunking documents" },
                      { key: "embedding", label: "Generating embeddings" },
                      { key: "storing", label: "Storing vectors" },
                      { key: "deploying", label: "Deploying to Cloudflare" },
                      { key: "operational", label: "MCP Server Live" },
                    ].map((statusStep) => {
                      const statusOrder = [
                        "pending",
                        "scraping",
                        "chunking",
                        "embedding",
                        "storing",
                        "deploying",
                        "operational",
                      ]

                      const currentIdx =
                        statusOrder.indexOf(
                          deployStatus
                        )

                      const stepIdx =
                        statusOrder.indexOf(
                          statusStep.key
                        )

                      const isComplete =
                        stepIdx < currentIdx

                      const isCurrent =
                        stepIdx === currentIdx

                      const isPending =
                        stepIdx > currentIdx

                      return (
                        <div
                          key={statusStep.key}
                          className={`flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-300 ${
                            isCurrent
                              ? "bg-blue-400/10 text-blue-200"
                              : isComplete
                              ? "text-green-300"
                              : "text-white/20"
                          }`}
                        >

                          {isComplete ? (
                            <span className="material-symbols-outlined text-base text-green-400">
                              check_circle
                            </span>
                          ) : isCurrent ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
                          ) : (
                            <span className="material-symbols-outlined text-base text-white/20">
                              radio_button_unchecked
                            </span>
                          )}

                          <span className="text-sm">
                            {statusStep.label}
                          </span>

                        </div>
                      )
                    })}

                    {/* STATS */}
                    {(deployStats.totalDocuments || deployStats.totalChunks || deployStats.totalEmbeddings) && (
                      <div className="mt-4 flex gap-6 border-t border-white/5 pt-4">

                        {deployStats.totalDocuments ? (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Docs</p>
                            <p className="text-lg font-semibold text-white/80">{deployStats.totalDocuments}</p>
                          </div>
                        ) : null}

                        {deployStats.totalChunks ? (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Chunks</p>
                            <p className="text-lg font-semibold text-white/80">{deployStats.totalChunks}</p>
                          </div>
                        ) : null}

                        {deployStats.totalEmbeddings ? (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Embeddings</p>
                            <p className="text-lg font-semibold text-white/80">{deployStats.totalEmbeddings}</p>
                          </div>
                        ) : null}

                      </div>
                    )}

                    {/* ENDPOINT */}
                    {deployStats.endpoint &&
                      deployStatus === "operational" && (
                      <div className="mt-4 rounded-2xl border border-green-400/20 bg-green-400/5 p-4">
                        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-green-300/60">
                          Endpoint
                        </p>
                        <p className="break-all font-mono text-sm text-green-200">
                          {deployStats.endpoint}
                        </p>
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">

              {error}

            </div>
          )}

          {/* FOOTER */}
          <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">

            {/* BACK */}
            <button
              onClick={handleBack}
              disabled={
                step === 1 ||
                deploying
              }
              className={`flex items-center gap-2 rounded-xl border px-6 py-3 transition ${
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

            {/* NEXT */}
            {step !== 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-blue-200 px-8 py-3 font-semibold text-black shadow-[0_0_25px_rgba(173,198,255,0.25)] transition hover:brightness-110"
              >

                Next

                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>

              </button>
            ) : (
              <button
                onClick={handleDeploy}
                disabled={deploying}
                className={`flex items-center gap-3 rounded-xl px-8 py-3 font-semibold transition ${
                  deploying
                    ? "bg-blue-200/70 text-black"
                    : "bg-blue-200 text-black shadow-[0_0_25px_rgba(173,198,255,0.25)] hover:brightness-110"
                }`}
              >

                {deploying ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />

                    Deploying...
                  </>
                ) : (
                  <>
                    Deploy MCP

                    <span className="material-symbols-outlined text-sm">
                      rocket_launch
                    </span>
                  </>
                )}

              </button>
            )}

          </div>

        </div>

      </section>

    </main>
  )
}