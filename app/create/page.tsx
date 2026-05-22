"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/vector/client"
import { useTheme } from "@/lib/theme-context"
import ConnectionGuide from "@/components/connection-guide"

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
  const { isDark } = useTheme()

  const [step, setStep] = useState(1)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [sourceUrl, setSourceUrl] = useState("")
  const [serverName, setServerName] = useState("")
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState("")
  const [deployStatus, setDeployStatus] = useState("")
  const [deployServerId, setDeployServerId] = useState<string | null>(null)
  const [deployStats, setDeployStats] = useState<{
    totalDocuments?: number
    totalChunks?: number
    totalEmbeddings?: number
    endpoint?: string
  }>({})

  // Connection Guide state
  const [showConnect, setShowConnect] = useState(false)

  const pollRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
    }
  }, [])

  const handleNext = () => {
    setError("")
    if (step === 1) {
      if (!selectedSource) return
      setStep(2)
      return
    }
    if (step === 2) {
      if (!sourceUrl.trim() || !serverName.trim()) {
        setError("Please fill all fields.")
        return
      }
      setStep(3)
      return
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleDeploy = async () => {
    try {
      setDeploying(true)
      setError("")
      setDeployStatus("pending")

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError("You must be logged in.")
        setDeploying(false)
        return
      }

      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: serverName,
          sourceUrl,
          sourceType: selectedSource,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || "Deployment failed")
        setDeploying(false)
        return
      }

      const serverId = data.serverId
      setDeployServerId(serverId)

      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(
            `/api/deploy/status?serverId=${serverId}`
          )
          const statusData = await statusRes.json()

          if (statusData.success && statusData.server) {
            const server = statusData.server
            setDeployStatus(server.deploymentStatus)
            setDeployStats({
              totalDocuments: server.totalDocuments,
              totalChunks: server.totalChunks,
              totalEmbeddings: server.totalEmbeddings,
              endpoint: server.endpoint,
            })

            if (
              server.deploymentStatus === "operational" ||
              server.deploymentStatus === "failed"
            ) {
              if (pollRef.current) clearInterval(pollRef.current)

              if (server.deploymentStatus === "failed") {
                setError(server.errorMessage || "Deployment failed")
                setDeploying(false)
              }
              // Don't auto-redirect — let user see Connect button
            }
          }
        } catch {
          // Continue polling
        }
      }, 2000)
    } catch (err) {
      console.error(err)
      setError("Something went wrong.")
      setDeploying(false)
    }
  }

  return (
    <main className="relative min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* GRID */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* GLOWS */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] z-0 h-[500px] w-[500px] rounded-full blur-[140px]" style={{ background: 'var(--gradient-glow-1)' }} />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] z-0 h-[400px] w-[400px] rounded-full blur-[120px]" style={{ background: 'var(--gradient-glow-2)' }} />

      {/* MAIN */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">

        {/* CARD */}
        <div
          className="relative w-full max-w-[760px] rounded-[2rem] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-12"
          style={{
            background: isDark ? 'rgba(22,22,29,0.8)' : 'rgba(255,255,255,0.9)',
            border: '1px solid var(--border-primary)',
          }}
        >

          {/* STEP INDICATORS */}
          <div className="mb-12 flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1 w-12 rounded-full transition-all duration-300"
                style={{
                  background: step >= s ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                }}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-12 text-center">
                <h2 className="mb-3 text-4xl font-bold tracking-tight">
                  Choose MCP Source
                </h2>
                <p style={{ color: 'var(--text-secondary)' }} className="mx-auto max-w-xl">
                  Select the data origin for your MCP infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {sources.map((source) => (
                  <button
                    key={source.name}
                    disabled={!source.enabled}
                    onClick={() => source.enabled && setSelectedSource(source.name)}
                    className="rounded-2xl p-6 transition-all duration-300"
                    style={{
                      border: selectedSource === source.name
                        ? '1px solid var(--accent-primary)'
                        : '1px solid var(--border-primary)',
                      background: selectedSource === source.name
                        ? 'rgba(var(--accent-rgb), 0.1)'
                        : 'var(--bg-card)',
                      opacity: source.enabled ? 1 : 0.4,
                      cursor: source.enabled ? 'pointer' : 'not-allowed',
                      filter: source.enabled ? 'none' : 'grayscale(1)',
                    }}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <span className="material-symbols-outlined text-4xl" style={{ color: 'var(--accent-primary)' }}>
                        {source.icon}
                      </span>
                      <div className="text-center">
                        <span className="block font-mono text-xs uppercase tracking-widest">{source.name}</span>
                        <span className="mt-2 block text-xs" style={{ color: 'var(--text-muted)' }}>{source.description}</span>
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
                <h2 className="mb-3 text-4xl font-bold tracking-tight">Configure MCP</h2>
                <p style={{ color: 'var(--text-secondary)' }} className="mx-auto max-w-xl">
                  Set up your MCP runtime information.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="mb-3 block font-mono text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent-primary)' }}>
                    MCP Server Name
                  </label>
                  <div className="rounded-xl p-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                    <input
                      type="text"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      placeholder="Docs Context Engine"
                      className="w-full bg-transparent px-4 py-4 outline-none"
                      style={{ color: 'var(--text-primary)', }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block font-mono text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent-primary)' }}>
                    {selectedSource} URL
                  </label>
                  <div className="rounded-xl p-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                    <input
                      type="text"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://example.com/docs"
                      className="w-full bg-transparent px-4 py-4 outline-none"
                      style={{ color: 'var(--text-primary)' }}
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
                <div
                  className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
                  style={{
                    border: `1px solid ${deployStatus === 'operational' ? 'var(--status-success)' : 'var(--accent-primary)'}`,
                    background: deployStatus === 'operational' ? 'rgba(76,175,80,0.1)' : 'rgba(var(--accent-rgb), 0.1)',
                  }}
                >
                  <span className="material-symbols-outlined text-6xl" style={{ color: deployStatus === 'operational' ? 'var(--status-success)' : 'var(--accent-primary)' }}>
                    {deploying ? (deployStatus === "operational" ? "check_circle" : "sync") : "verified"}
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

              <div className="space-y-6 rounded-3xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>MCP Name</p>
                  <p className="text-xl font-semibold">{serverName}</p>
                </div>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Source Type</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{selectedSource}</p>
                </div>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Source URL</p>
                  <p className="break-all" style={{ color: 'var(--text-secondary)' }}>{sourceUrl}</p>
                </div>

                {/* DEPLOYMENT STATUS */}
                {deploying && (
                  <div className="mt-6 space-y-3 border-t pt-6" style={{ borderColor: 'var(--border-primary)' }}>
                    <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent-primary)' }}>
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
                      const statusOrder = ["pending", "scraping", "chunking", "embedding", "storing", "deploying", "operational"]
                      const currentIdx = statusOrder.indexOf(deployStatus)
                      const stepIdx = statusOrder.indexOf(statusStep.key)
                      const isComplete = stepIdx < currentIdx
                      const isCurrent = stepIdx === currentIdx

                      return (
                        <div
                          key={statusStep.key}
                          className="flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-300"
                          style={{
                            background: isCurrent ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                            color: isCurrent ? 'var(--accent-primary)' : isComplete ? 'var(--status-success)' : 'var(--text-muted)',
                          }}
                        >
                          {isComplete ? (
                            <span className="material-symbols-outlined text-base" style={{ color: 'var(--status-success)' }}>check_circle</span>
                          ) : isCurrent ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
                          ) : (
                            <span className="material-symbols-outlined text-base" style={{ color: 'var(--text-muted)' }}>radio_button_unchecked</span>
                          )}
                          <span className="text-sm">{statusStep.label}</span>
                        </div>
                      )
                    })}

                    {/* STATS */}
                    {(deployStats.totalDocuments || deployStats.totalChunks || deployStats.totalEmbeddings) && (
                      <div className="mt-4 flex gap-6 border-t pt-4" style={{ borderColor: 'var(--border-primary)' }}>
                        {deployStats.totalDocuments ? (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Docs</p>
                            <p className="text-lg font-semibold">{deployStats.totalDocuments}</p>
                          </div>
                        ) : null}
                        {deployStats.totalChunks ? (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Chunks</p>
                            <p className="text-lg font-semibold">{deployStats.totalChunks}</p>
                          </div>
                        ) : null}
                        {deployStats.totalEmbeddings ? (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Embeddings</p>
                            <p className="text-lg font-semibold">{deployStats.totalEmbeddings}</p>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* ENDPOINT + CONNECT */}
                    {deployStats.endpoint && deployStatus === "operational" && (
                      <div className="mt-4 space-y-4">
                        <div className="rounded-2xl p-4" style={{ background: 'rgba(76,175,80,0.05)', border: '1px solid rgba(76,175,80,0.2)' }}>
                          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--status-success)' }}>Endpoint</p>
                          <p className="break-all font-mono text-sm" style={{ color: 'var(--status-success)' }}>{deployStats.endpoint}</p>
                        </div>

                        {/* CONNECT + VIEW BUTTONS */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowConnect(true)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                            style={{ background: 'var(--gradient-primary)', boxShadow: '0 0 25px rgba(var(--accent-rgb), 0.15)' }}
                          >
                            <span className="material-symbols-outlined text-base">cable</span>
                            Connect Your MCP
                          </button>

                          <button
                            onClick={() => router.push(`/dashboard/mcp-servers/${deployServerId}`)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition hover:opacity-80"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
                          >
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                            View Server
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-8 rounded-2xl p-4 text-sm" style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.2)', color: '#EF9A9A' }}>
              {error}
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-10 flex items-center justify-between border-t pt-8" style={{ borderColor: 'var(--border-primary)' }}>
            <button
              onClick={handleBack}
              disabled={step === 1 || deploying}
              className="flex items-center gap-2 rounded-xl border px-6 py-3 transition"
              style={{
                borderColor: step === 1 ? 'var(--border-primary)' : 'var(--border-primary)',
                color: step === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                cursor: step === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back
            </button>

            {step !== 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl px-8 py-3 font-semibold text-white transition hover:scale-[1.02]"
                style={{ background: 'var(--gradient-primary)', boxShadow: '0 0 25px rgba(var(--accent-rgb), 0.15)' }}
              >
                Next
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : deployStatus !== "operational" ? (
              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="flex items-center gap-3 rounded-xl px-8 py-3 font-semibold text-white transition hover:scale-[1.02]"
                style={{
                  background: deploying ? 'rgba(var(--accent-rgb), 0.7)' : 'var(--gradient-primary)',
                  boxShadow: deploying ? 'none' : '0 0 25px rgba(var(--accent-rgb), 0.15)',
                }}
              >
                {deploying ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deploying...
                  </>
                ) : (
                  <>
                    Deploy MCP
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard/mcp-servers")}
                className="flex items-center gap-2 rounded-xl px-8 py-3 font-semibold transition"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
              >
                Go to Dashboard
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )}
          </div>

        </div>

      </section>

      {/* CONNECTION GUIDE MODAL */}
      {deployStats.endpoint && (
        <ConnectionGuide
          endpoint={deployStats.endpoint}
          serverName={serverName}
          isOpen={showConnect}
          onClose={() => setShowConnect(false)}
        />
      )}

    </main>
  )
}