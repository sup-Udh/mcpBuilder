"use client";

import Sidebar from "../../components/dashboard/sidebar";
import TopNavbar from "../../components/dashboard/top-navbar";
import FloatingButton from "../../components/dashboard/floating-button";
import PageLoader from "@/components/PageLoader";

import { useRouter }
from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import { createClient }
from "@/lib/vector/client";

export default function DashboardPage() {
  
  const supabase =
    createClient();

  const [user, setUser] =
    useState<any>(null);

    const [checkingAuth, setCheckingAuth] =
  useState(true);

  const [loadingUser, setLoadingUser] =
    useState(true);

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // FETCH USER
  // ==========================================

useEffect(() => {
  const checkAuth = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("USER:", user);

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
  // PAGE TRANSITION
  // ==========================================

  const handleNavigate = () => {
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      router.push("/create");
    }, 1200);
  };

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
      ?.user_name ||
    user?.email?.split("@")[0] ||
    "Builder";

const avatar =
  user?.user_metadata?.picture ||
  user?.user_metadata?.avatar_url ||
  "https://i.pravatar.cc/150?img=12";
  // ==========================================
  // LOADING
  // ==========================================

if (checkingAuth) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
      Loading Dashboard...
    </div>
  );
}

  return (
    <main className="min-h-screen bg-[#020617] text-white">

      <Sidebar />

      <TopNavbar
        user={user}
      />

      {/* MAIN CONTENT */}
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

          {/* GLOW */}
          <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

          <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-1 flex-col px-10 py-10">

            {/* HERO */}
            <div className="mb-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">

              <div className="flex items-center gap-5">

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

                  <p className="mt-3 max-w-2xl text-lg text-white/50">
                    Deploy and manage AI-native MCP infrastructure,
                    semantic runtimes, and vector-powered knowledge systems.
                  </p>

                </div>

              </div>

            </div>

            {/* STATS */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                  Active Servers
                </p>

                <h2 className="mt-4 text-5xl font-bold">
                  0
                </h2>

              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                  Vector Chunks
                </p>

                <h2 className="mt-4 text-5xl font-bold">
                  0
                </h2>

              </div>

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

            {/* EMPTY STATE */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] px-10 py-24 text-center">

              <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur-xl">

                <span className="material-symbols-outlined text-6xl text-blue-200">
                  dns
                </span>

              </div>

              <h2 className="mb-4 text-5xl font-bold tracking-tight">
                No MCP Servers Yet
              </h2>

              <p className="mb-12 max-w-2xl text-lg leading-relaxed text-white/50">

                Create your first MCP server and deploy AI-searchable
                infrastructure in minutes.

              </p>

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

          </div>

        </div>

      </div>

      <FloatingButton />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

    </main>
  );
}