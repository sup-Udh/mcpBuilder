"use client";

import Sidebar from "../../components/dashboard/sidebar";
import TopNavbar from "../../components/dashboard/top-navbar";
import FloatingButton from "../../components/dashboard/floating-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/vector/client";
import { useTheme } from "@/lib/theme-context";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const { isDark } = useTheme();

  // ==========================================
  // STATE
  // ==========================================
  const [mcps, setMcps] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMcps, setLoadingMcps] = useState(true);

  // ==========================================
  // AUTH CHECK
  // ==========================================
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // ==========================================
  // LOAD USER MCPS
  // ==========================================
  useEffect(() => {
    if (!user) return;

    async function loadMcps() {
      setLoadingMcps(true);
      const { data, error } = await supabase
        .from("mcp_servers")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (!error && data) {
        setMcps(data);
      }
      setLoadingMcps(false);
    }

    loadMcps();
  }, [user]);

  // ==========================================
  // PAGE TRANSITION
  // ==========================================
  const handleNavigate = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      router.push("/create");
    }, 1200);
  };

  // ==========================================
  // LOCK SCROLL
  // ==========================================
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  // ==========================================
  // USER DATA
  // ==========================================
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.user_name ||
    user?.email?.split("@")[0] ||
    "Builder";

  const avatar =
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar_url ||
    "https://i.pravatar.cc/150?img=12";

  // ==========================================
  // STATS
  // ==========================================
  const deployedCount = mcps.filter(
    (mcp) => mcp.deployment_status === "operational"
  ).length;

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  if (checkingAuth) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor: 'var(--accent-primary)',
              borderTopColor: 'transparent',
            }}
          />
          <span
            className="text-base font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            Initializing dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <Sidebar />
      <TopNavbar user={user} />

      {/* MAIN */}
      <div className="ml-64 mt-16 h-[calc(100vh-64px)] overflow-y-auto">
        <div className="relative flex min-h-full flex-col">
          {/* GRID */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundSize: "40px 40px",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
              maskImage:
                "radial-gradient(circle at center, black, transparent 80%)",
            }}
          />

          {/* GLOWS */}
          <div
            className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full blur-[140px]"
            style={{ background: 'var(--gradient-glow-1)' }}
          />
          <div
            className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[140px]"
            style={{ background: 'var(--gradient-glow-2)' }}
          />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-1 flex-col px-10 py-10">
            {/* HERO */}
            <div
              className="mb-8 overflow-hidden rounded-2xl backdrop-blur-md"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div className="relative p-8">
                {/* HERO GLOW */}
                <div
                  className="absolute right-[-10%] top-[-20%] h-[300px] w-[300px] rounded-full blur-[120px]"
                  style={{ background: 'var(--gradient-glow-3)' }}
                />

                <div className="relative z-10 flex items-center gap-6">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-md"
                      style={{ background: 'rgba(var(--accent-rgb), 0.2)' }}
                    />
                    <img
                      src={avatar}
                      alt="profile"
                      referrerPolicy="no-referrer"
                      className="relative h-20 w-20 rounded-full object-cover"
                      style={{
                        border: '1px solid var(--border-hover)',
                      }}
                    />
                  </div>

                  <div>
                    <p
                      className="mb-1 font-mono text-[9px] uppercase tracking-[0.25em]"
                      style={{ color: 'var(--accent-primary)', opacity: 0.8 }}
                    >
                      MCP CONTROL PLANE
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight">
                      Welcome back,
                      <span className="gradient-text">
                        {" "}
                        {displayName}
                      </span>
                    </h1>
                    <p
                      className="mt-2 max-w-xl text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Build, deploy, and manage AI-native MCP infrastructure
                      with semantic retrieval, vector search, and runtime orchestration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* CARD */}
              <div
                className="rounded-2xl p-6 backdrop-blur-md"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]"
                >
                  Total MCP Servers
                </p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight">
                  {mcps.length}
                </h2>
              </div>

              {/* CARD */}
              <div
                className="rounded-2xl p-6 backdrop-blur-md"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]"
                >
                  Deployed Servers
                </p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight">
                  {deployedCount}
                </h2>
              </div>

              {/* CARD */}
              <div
                className="rounded-2xl p-6 backdrop-blur-md"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]"
                >
                  Runtime Status
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 animate-pulse rounded-full"
                    style={{ background: 'var(--status-success)' }}
                  />
                  <span
                    className="text-base font-semibold"
                    style={{ color: 'var(--status-success)' }}
                  >
                    Operational
                  </span>
                </div>
              </div>
            </div>

            {/* MCP SECTION */}
            {loadingMcps ? (
              <div
                className="flex flex-1 items-center justify-center rounded-2xl py-32"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                    style={{
                      borderColor: 'var(--accent-primary)',
                      borderTopColor: 'transparent',
                    }}
                  />
                  <span
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Loading MCP infrastructure...
                  </span>
                </div>
              </div>
            ) : mcps.length === 0 ? (
              <div
                className="flex flex-1 flex-col items-center justify-center rounded-2xl px-10 py-20 text-center"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px dashed var(--border-primary)',
                }}
              >
                {/* ICON */}
                <div
                  className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl backdrop-blur-md"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <span
                    className="material-symbols-outlined text-4xl text-[var(--accent-primary)]"
                  >
                    dns
                  </span>
                </div>

                <h1 className="mb-3 text-3xl font-bold tracking-tight">
                  No MCP Servers Yet
                </h1>
                <p
                  className="mb-8 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]"
                >
                  Create your first MCP server and deploy AI-searchable
                  infrastructure in minutes.
                </p>

                {/* BUTTON */}
                <button
                  onClick={handleNavigate}
                  disabled={loading}
                  className="flex items-center gap-3 rounded-xl px-6 py-3 text-xs font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                  style={{
                    background: 'var(--gradient-primary)',
                  }}
                >
                  {loading ? "Loading..." : "Create MCP Server"}
                </button>
              </div>
            ) : (
              <div>
                {/* HEADER */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Your MCP Servers
                    </h2>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Manage and monitor your AI infrastructure.
                    </p>
                  </div>

                  <button
                    onClick={handleNavigate}
                    className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: 'var(--gradient-primary)',
                    }}
                  >
                    Create MCP
                  </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {mcps.map((mcp) => (
                    <Link
                      href={`/dashboard/mcp-servers/${mcp.id}`}
                      key={mcp.id}
                      className="group block"
                    >
                      <div
                        className="relative h-full overflow-hidden rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-hover)] hover:shadow-lg"
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-primary)',
                        }}
                      >
                        {/* GLOW */}
                        <div
                          className="absolute right-[-20%] top-[-20%] h-[150px] w-[150px] rounded-full blur-[80px] transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background: 'var(--gradient-glow-1)',
                            opacity: 0.3,
                          }}
                        />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div>
                            {/* TOP */}
                            <div className="mb-4 flex items-center justify-between">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{
                                  background: 'rgba(var(--accent-rgb), 0.1)',
                                }}
                              >
                                <span
                                  className="material-symbols-outlined text-xl text-[var(--accent-primary)]"
                                >
                                  hub
                                </span>
                              </div>

                              <span
                                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                                style={{
                                  border: mcp.deployment_status === 'operational' ? '1px solid rgba(76,175,80,0.2)' : '1px solid rgba(176,141,87,0.2)',
                                  background: mcp.deployment_status === 'operational' ? 'rgba(76,175,80,0.1)' : 'rgba(176,141,87,0.1)',
                                  color: mcp.deployment_status === 'operational' ? 'var(--status-success)' : 'var(--status-warning)',
                                }}
                              >
                                {mcp.deployment_status}
                              </span>
                            </div>

                            {/* NAME */}
                            <h3 className="mb-2 text-lg font-bold tracking-tight text-[var(--text-primary)]">
                              {mcp.name}
                            </h3>

                            {/* DESCRIPTION */}
                            <p
                              className="mb-4 line-clamp-3 text-xs leading-relaxed text-[var(--text-secondary)]"
                            >
                              {mcp.description ||
                                "AI-native MCP runtime with semantic retrieval and vector-powered infrastructure."}
                            </p>
                          </div>

                          {/* META */}
                          <div
                            className="space-y-2 font-mono text-[10px] border-t border-[var(--border-primary)] pt-4"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">
                                language
                              </span>
                              <span>{mcp.source_type}</span>
                            </div>

                            <div className="flex items-center gap-2 truncate">
                              <span className="material-symbols-outlined text-sm">
                                link
                              </span>
                              <span className="truncate">{mcp.source_url}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingButton />
    </main>
  );
}