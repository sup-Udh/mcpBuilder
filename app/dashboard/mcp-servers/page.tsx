"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter }
from "next/navigation";

import Sidebar
from "@/components/dashboard/sidebar";

import TopNavbar
from "@/components/dashboard/top-navbar";

import {
  createClient,
} from "@/lib/vector/client";

import { useTheme } from "@/lib/theme-context";

export default function MCPServersPage() {

  const supabase =
    createClient();

  const router =
    useRouter();

  const { isDark } = useTheme();

  // ==========================================
  // STATE
  // ==========================================

  const [user, setUser] =
    useState<any>(null);

  const [mcps, setMcps] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // AUTH + FETCH
  // ==========================================

  useEffect(() => {

    async function loadData() {

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {

        router.push("/login");

        return;
      }

      setUser(user);

      const {
        data,
        error,
      } = await supabase
        .from("mcp_servers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (!error && data) {

        setMcps(data);
      }

      setLoading(false);
    }

    loadData();

  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >

        <div className="flex items-center gap-4">

          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
          />

          <span style={{ color: 'var(--text-muted)' }}>
            Loading MCP Servers...
          </span>

        </div>

      </div>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >

      <Sidebar />

      <TopNavbar user={user} />

      {/* MAIN */}
      <div className="ml-64 mt-16 min-h-[calc(100vh-64px)] overflow-y-auto">

        <div className="relative min-h-full overflow-hidden px-10 py-10">

          {/* GRID */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundSize:
                "40px 40px",

              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",

              maskImage:
                "radial-gradient(circle at center, black, transparent 80%)",
            }}
          />

          {/* GLOWS */}
          <div
            className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full blur-[140px]"
            style={{ background: 'var(--gradient-glow-1)', opacity: 0.15 }}
          />

          <div
            className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[140px]"
            style={{ background: 'var(--gradient-glow-2)', opacity: 0.15 }}
          />

          {/* CONTENT */}
          <div className="relative z-10">

            {/* HEADER */}
            <div className="mb-14 flex items-center justify-between">

              <div>

                <p
                  className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  MCP INFRASTRUCTURE
                </p>

                <h1
                  className="text-6xl font-bold tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  MCP Servers
                </h1>

                <p
                  className="mt-4 max-w-3xl text-xl leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Manage deployed runtimes, ingestion sources,
                  embeddings, vector indexing, and live MCP infrastructure.
                </p>

              </div>

              <button
                onClick={() =>
                  router.push("/create")
                }
                className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'var(--gradient-primary)' }}
              >

                Create MCP Server

              </button>

            </div>

            {/* EMPTY */}
            {mcps.length === 0 && (

              <div
                className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-dashed text-center"
                style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-card)' }}
              >

                <div
                  className="mb-8 flex h-24 w-24 items-center justify-center rounded-xl"
                  style={{ border: '1px solid var(--border-primary)', background: 'var(--bg-elevated)' }}
                >

                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    dns
                  </span>

                </div>

                <h2
                  className="mb-4 text-3xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  No MCP Servers Found
                </h2>

                <p
                  className="max-w-xl text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >

                  You haven&apos;t deployed any MCP infrastructure yet.

                </p>

              </div>
            )}

            {/* MCP GRID */}
            {mcps.length > 0 && (

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                {mcps.map((server) => (

                  <button
                    key={server.id}
                    onClick={() =>
                      router.push(
                        `/dashboard/mcp-servers/${server.id}`
                      )
                    }
                    className="group relative overflow-hidden rounded-2xl p-6 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--border-hover)] hover:shadow-lg"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >

                    <div
                      className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                      style={{ background: 'var(--gradient-glow-1)' }}
                    />

                    <div className="relative z-10">

                      {/* TOP */}
                      <div className="mb-6 flex items-start justify-between">

                        <div className="flex items-center gap-4">

                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl"
                            style={{
                              border: '1px solid var(--border-primary)',
                              background: 'var(--bg-elevated)',
                            }}
                          >

                            <span
                              className="material-symbols-outlined text-2xl"
                              style={{ color: 'var(--accent-primary)' }}
                            >

                              {
                                server.source_type === "Website"
                                  ? "language"
                                  : server.source_type === "PDF"
                                  ? "picture_as_pdf"
                                  : "description"
                              }

                            </span>

                          </div>

                          <div>

                            <h2
                              className="text-xl font-bold tracking-tight"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {server.name}
                            </h2>

                            <div className="mt-2 flex items-center gap-3">

                              <span
                                className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                                style={{
                                  border: '1px solid var(--border-primary)',
                                  background: 'var(--bg-elevated)',
                                  color: 'var(--text-muted)',
                                }}
                              >
                                {server.source_type}
                              </span>

                              <div className="flex items-center gap-1.5">

                                <div
                                  className="h-1.5 w-1.5 animate-pulse rounded-full"
                                  style={{ background: 'var(--status-success)' }}
                                />

                                <span
                                  className="font-mono text-[9px] uppercase tracking-wider"
                                  style={{ color: 'var(--status-success)' }}
                                >
                                  Running
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                        <span
                          className="material-symbols-outlined"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          more_vert
                        </span>

                      </div>

                      {/* URL */}
                      <div
                        className="mb-6 rounded-xl p-4"
                        style={{
                          border: '1px solid var(--border-primary)',
                          background: 'var(--bg-elevated)',
                        }}
                      >

                        <p
                          className="mb-1.5 font-mono text-[9px] uppercase tracking-wider"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          Source URL
                        </p>

                        <p
                          className="line-clamp-1 text-xs"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {server.source_url}
                        </p>

                      </div>

                      {/* FOOTER */}
                      <div className="flex items-center justify-between border-t border-[var(--border-primary)] pt-4">

                        <div>

                          <p
                            className="mb-1 font-mono text-[9px] uppercase tracking-wider"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Endpoint
                          </p>

                          <code className="text-xs" style={{ color: 'var(--accent-secondary)' }}>
                            {server.endpoint}
                          </code>

                        </div>

                        <div
                          className="rounded-xl px-4 py-2 text-xs transition group-hover:brightness-110"
                          style={{
                            border: '1px solid var(--border-primary)',
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                          }}
                        >

                          Open Runtime →

                        </div>

                      </div>

                    </div>

                  </button>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}