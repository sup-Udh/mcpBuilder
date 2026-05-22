"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import TopNavbar from "@/components/dashboard/top-navbar"
import { createClient } from "@/lib/vector/client"
import { useTheme } from "@/lib/theme-context"

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push("/login")
        return
      }

      setUser(user)
      setLoading(false)
    }
    loadUser()
  }, [])

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This will also delete all of your created MCP servers and data, and this action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch("/api/user/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete account");
      }

      // Success, sign out client-side session
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      alert(err.message || "An error occurred while deleting your account.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>
            Loading Settings...
          </span>
        </div>
      </div>
    )
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User"

  const email = user?.email || "—"

  const avatar =
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar_url ||
    "https://i.pravatar.cc/150?img=12"

  return (
    <main
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Sidebar />
      <TopNavbar user={user} />

      <div className="ml-64 mt-16 min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="relative min-h-full overflow-hidden px-10 py-10">
          {/* GRID BG */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundSize: "40px 40px",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
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

          <div className="relative z-10 mx-auto max-w-3xl">
            {/* HEADER */}
            <div className="mb-10">
              <p
                className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em]"
                style={{ color: 'var(--text-muted)' }}
              >
                CONFIGURATION
              </p>
              <h1 className="text-4xl font-bold tracking-tight">
                Settings
              </h1>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Manage your appearance, authentication details, and account preferences.
              </p>
            </div>

            {/* ====================================== */}
            {/* APPEARANCE                             */}
            {/* ====================================== */}
            <div
              className="mb-8 rounded-2xl p-6 backdrop-blur-md"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  palette
                </span>
                <h2 className="text-lg font-bold">
                  Appearance
                </h2>
              </div>

              {/* THEME TOGGLE */}
              <div
                className="flex items-center justify-between rounded-xl p-4"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: 'rgba(var(--accent-rgb), 0.1)',
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {isDark ? "dark_mode" : "light_mode"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {isDark ? "Dark Mode" : "Light Mode"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {isDark
                        ? "Optimized for low-light environments"
                        : "Bright and clean for daytime use"}
                    </p>
                  </div>
                </div>

                {/* TOGGLE SWITCH */}
                <button
                  onClick={toggleTheme}
                  className="relative h-7 w-12 rounded-full transition-all duration-300"
                  style={{
                    background: 'var(--accent-primary)',
                  }}
                >
                  <div
                    className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300"
                    style={{
                      left: isDark ? '2px' : '22px',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* ====================================== */}
            {/* ACCOUNT                                */}
            {/* ====================================== */}
            <div
              className="mb-8 rounded-2xl p-6 backdrop-blur-md"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ color: 'var(--accent-secondary)' }}
                >
                  person
                </span>
                <h2 className="text-lg font-bold">
                  Account
                </h2>
              </div>

              {/* PROFILE */}
              <div
                className="flex items-center gap-4 rounded-xl p-4"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <img
                  src={avatar}
                  alt="profile"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-full object-cover"
                  style={{ border: '2px solid var(--border-primary)' }}
                />

                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {displayName}
                  </p>
                  <p
                    className="font-mono text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {email}
                  </p>
                </div>

                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                  style={{
                    background: 'rgba(76,175,80,0.1)',
                    border: '1px solid rgba(76,175,80,0.2)',
                    color: 'var(--status-success)',
                  }}
                >
                  Active
                </span>
              </div>

              {/* META */}
              <div className="mt-4 space-y-2">
                {[
                  { label: "Provider", value: "Google OAuth" },
                  { label: "User ID", value: user?.id?.slice(0, 18) + "..." },
                  { label: "Last Sign In", value: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg px-4 py-2.5"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <span
                      className="font-mono text-[9px] uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ====================================== */}
            {/* DANGER ZONE                            */}
            {/* ====================================== */}
            <div
              className="mb-8 rounded-2xl p-6 backdrop-blur-md"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(224,90,90,0.15)',
              }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[var(--status-error)]">
                  warning
                </span>
                <h2 className="text-lg font-bold">
                  Danger Zone
                </h2>
              </div>

              <div
                className="flex items-center justify-between rounded-xl p-4"
                style={{
                  background: isDark ? 'rgba(224,90,90,0.03)' : 'rgba(224,90,90,0.01)',
                  border: '1px solid rgba(224,90,90,0.15)',
                }}
              >
                <div>
                  <p className="text-sm font-semibold">
                    Delete Account
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Permanently remove your account and all data.
                  </p>
                </div>

                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="rounded-xl border border-[var(--status-error)]/30 bg-[var(--status-error)]/10 px-4 py-2 text-xs font-semibold text-[var(--status-error)] transition hover:bg-[var(--status-error)]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
