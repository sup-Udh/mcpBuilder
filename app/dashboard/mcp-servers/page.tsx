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

export default function MCPServersPage() {

  const supabase =
    createClient();

  const router =
    useRouter();

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
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">

        <div className="flex items-center gap-4">

          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />

          <span className="text-white/60">
            Loading MCP Servers...
          </span>

        </div>

      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">

      {/* MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      <Sidebar />

      <TopNavbar user={user} />

      {/* MAIN */}
      <div className="ml-64 mt-16 min-h-[calc(100vh-64px)] overflow-y-auto">

        <div className="relative min-h-full overflow-hidden px-10 py-10">

          {/* GRID */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
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
          <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

          <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

          {/* CONTENT */}
          <div className="relative z-10">

            {/* HEADER */}
            <div className="mb-14 flex items-center justify-between">

              <div>

                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-blue-200/50">
                  MCP INFRASTRUCTURE
                </p>

                <h1 className="text-6xl font-bold tracking-tight">
                  MCP Servers
                </h1>

                <p className="mt-4 max-w-3xl text-xl leading-relaxed text-white/50">
                  Manage deployed runtimes, ingestion sources,
                  embeddings, vector indexing, and live MCP infrastructure.
                </p>

              </div>

              <button
                onClick={() =>
                  router.push("/create")
                }
                className="rounded-2xl bg-blue-200 px-8 py-5 font-semibold text-[#020617] shadow-[0_0_35px_rgba(173,198,255,0.25)] transition hover:scale-[1.02] hover:brightness-110"
              >

                + Create MCP Server

              </button>

            </div>

            {/* EMPTY */}
            {mcps.length === 0 && (

              <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] text-center">

                <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03]">

                  <span className="material-symbols-outlined text-6xl text-blue-200">
                    dns
                  </span>

                </div>

                <h2 className="mb-4 text-5xl font-bold">
                  No MCP Servers Found
                </h2>

                <p className="max-w-2xl text-lg leading-relaxed text-white/50">

                  You haven't deployed any MCP infrastructure yet.

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
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-8 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-300/20"
                  >

                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/10 opacity-0 transition group-hover:opacity-100" />

                    <div className="relative z-10">

                      {/* TOP */}
                      <div className="mb-8 flex items-start justify-between">

                        <div className="flex items-center gap-5">

                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-400/10">

                            <span className="material-symbols-outlined text-3xl text-blue-200">

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

                            <h2 className="text-3xl font-bold">
                              {server.name}
                            </h2>

                            <div className="mt-3 flex items-center gap-3">

                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
                                {server.source_type}
                              </span>

                              <div className="flex items-center gap-2">

                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                                <span className="font-mono text-[10px] uppercase tracking-widest text-green-300">
                                  Running
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                        <span className="material-symbols-outlined text-white/30">
                          more_vert
                        </span>

                      </div>

                      {/* URL */}
                      <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4">

                        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                          Source URL
                        </p>

                        <p className="line-clamp-2 text-sm text-white/70">
                          {server.source_url}
                        </p>

                      </div>

                      {/* FOOTER */}
                      <div className="flex items-center justify-between">

                        <div>

                          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                            Endpoint
                          </p>

                          <code className="text-sm text-blue-200">
                            {server.endpoint}
                          </code>

                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition group-hover:border-blue-300/20 group-hover:text-white">

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