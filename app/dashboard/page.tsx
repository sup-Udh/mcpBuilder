"use client";

import Sidebar from "../../components/dashboard/sidebar";
import TopNavbar from "../../components/dashboard/top-navbar";
import FloatingButton from "../../components/dashboard/floating-button";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import { createClient }
from "@/lib/vector/client";

export default function DashboardPage() {

  const supabase =
    createClient();

  const router = useRouter();

  // ==========================================
  // STATE
  // ==========================================

  const [mcps, setMcps] =
    useState<any[]>([]);

  const [user, setUser] =
    useState<any>(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [loadingMcps, setLoadingMcps] =
    useState(true);

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

      const { data, error } =
        await supabase
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
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "auto";
    }

    return () => {
      document.body.style.overflow =
        "auto";
    };

  }, [loading]);

  // ==========================================
  // USER DATA
  // ==========================================

  const displayName =

    user?.user_metadata
      ?.full_name ||

    user?.user_metadata
      ?.name ||

    user?.user_metadata
      ?.user_name ||

    user?.email?.split("@")[0] ||

    "Builder";

  const avatar =

    user?.user_metadata?.picture ||

    user?.user_metadata?.avatar_url ||

    "https://i.pravatar.cc/150?img=12";

  // ==========================================
  // STATS
  // ==========================================

  const deployedCount =
    mcps.filter(
      (mcp) =>
        mcp.deployment_status ===
        "deployed"
    ).length;

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">

        <div className="flex items-center gap-4">

          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />

          <span className="text-lg text-white/70">
            Initializing dashboard...
          </span>

        </div>

      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">

      <Sidebar />

      <TopNavbar
        user={user}
      />

      {/* MAIN */}
      <div className="ml-64 mt-16 h-[calc(100vh-64px)] overflow-y-auto">

        <div className="relative flex min-h-full flex-col">

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
          <div className="relative z-10 flex flex-1 flex-col px-10 py-10">

            {/* HERO */}
            <div className="mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">

              <div className="relative p-8">

                {/* HERO GLOW */}
                <div className="absolute right-[-10%] top-[-20%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[120px]" />

                <div className="relative z-10 flex items-center gap-6">

                  <img
                    src={avatar}
                    alt="profile"
                    referrerPolicy="no-referrer"
                    className="h-24 w-24 rounded-full border border-blue-400/20 object-cover shadow-[0_0_35px_rgba(59,130,246,0.25)]"
                  />

                  <div>

                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-blue-200/70">
                      MCP CONTROL PLANE
                    </p>

                    <h1 className="text-5xl font-bold tracking-tight">

                      Welcome back,

                      <span className="bg-gradient-to-r from-blue-200 to-violet-300 bg-clip-text text-transparent">

                        {" "}
                        {displayName}

                      </span>

                    </h1>

                    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/50">

                      Build, deploy, and manage AI-native MCP infrastructure
                      with semantic retrieval, vector search, and runtime orchestration.

                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* STATS */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">

              {/* CARD */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                  Total MCP Servers
                </p>

                <h2 className="mt-4 text-5xl font-bold">
                  {mcps.length}
                </h2>

              </div>

              {/* CARD */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                  Deployed Servers
                </p>

                <h2 className="mt-4 text-5xl font-bold">
                  {deployedCount}
                </h2>

              </div>

              {/* CARD */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                  Runtime Status
                </p>

                <div className="mt-5 flex items-center gap-3">

                  <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />

                  <span className="text-lg font-semibold text-green-300">
                    Operational
                  </span>

                </div>

              </div>

            </div>

            {/* MCP SECTION */}
            {
              loadingMcps ? (

                <div className="flex flex-1 items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.03] py-32">

                  <div className="flex items-center gap-4">

                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />

                    <span className="text-white/60">
                      Loading MCP infrastructure...
                    </span>

                  </div>

                </div>

              ) : mcps.length === 0 ? (

                <div className="flex flex-1 flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] px-10 py-24 text-center">

                  {/* ICON */}
                  <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur-xl">

                    <span className="material-symbols-outlined text-6xl text-blue-200">
                      dns
                    </span>

                  </div>

                  <h1 className="mb-4 text-center text-5xl font-bold tracking-tight">
                    No MCP Servers Yet
                  </h1>

                  <p className="mb-12 max-w-2xl text-lg leading-relaxed text-white/50">

                    Create your first MCP server and deploy AI-searchable
                    infrastructure in minutes.

                  </p>

                  {/* BUTTON */}
                  <button
                    onClick={
                      handleNavigate
                    }
                    disabled={loading}
                    className="flex items-center gap-3 rounded-2xl bg-blue-200 px-8 py-4 font-semibold text-[#020617] shadow-[0_0_35px_rgba(173,198,255,0.25)] transition hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                  >

                    {loading
                      ? "Loading..."
                      : "Create MCP Server"}

                  </button>

                </div>

              ) : (

                <div>

                  {/* HEADER */}
                  <div className="mb-8 flex items-center justify-between">

                    <div>

                      <h2 className="text-4xl font-bold tracking-tight">
                        Your MCP Servers
                      </h2>

                      <p className="mt-2 text-white/50">
                        Manage and monitor your AI infrastructure.
                      </p>

                    </div>

                    <button
                      onClick={
                        handleNavigate
                      }
                      className="rounded-2xl bg-blue-200 px-6 py-3 font-semibold text-[#020617] shadow-[0_0_35px_rgba(173,198,255,0.2)] transition hover:brightness-110"
                    >

                      Create MCP

                    </button>

                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {mcps.map((mcp) => (

                      <div
                        key={mcp.id}
                        className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-blue-300/20 hover:bg-white/[0.05]"
                      >

                        {/* GLOW */}
                        <div className="absolute right-[-30%] top-[-30%] h-[200px] w-[200px] rounded-full bg-blue-500/5 blur-[80px] transition group-hover:bg-blue-500/10" />

                        <div className="relative z-10">

                          {/* TOP */}
                          <div className="mb-5 flex items-center justify-between">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">

                              <span className="material-symbols-outlined text-3xl text-blue-200">
                                hub
                              </span>

                            </div>

                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">

                              {mcp.deployment_status}

                            </span>

                          </div>

                          {/* NAME */}
                          <h3 className="mb-3 text-2xl font-semibold tracking-tight">

                            {mcp.name}

                          </h3>

                          {/* DESCRIPTION */}
                          <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-white/50">

                            {mcp.description ||
                              "AI-native MCP runtime with semantic retrieval and vector-powered infrastructure."}

                          </p>

                          {/* META */}
                          <div className="space-y-3 text-sm text-white/40">

                            <div className="flex items-center gap-2">

                              <span className="material-symbols-outlined text-base">
                                language
                              </span>

                              <span>
                                {mcp.source_type}
                              </span>

                            </div>

                            <div className="flex items-center gap-2 truncate">

                              <span className="material-symbols-outlined text-base">
                                link
                              </span>

                              <span className="truncate">
                                {mcp.source_url}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              )
            }

          </div>

        </div>

      </div>

      <FloatingButton />

      {/* MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

    </main>
  );
}