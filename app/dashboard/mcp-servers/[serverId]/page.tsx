"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useParams,
} from "next/navigation";

import Sidebar
  from "@/components/dashboard/sidebar";

import TopNavbar
  from "@/components/dashboard/top-navbar";

import {
  createClient,
} from "@/lib/vector/client";

import { useTheme } from "@/lib/theme-context";
import ConnectionGuide from "@/components/connection-guide";

// ==========================================
// STATUS HELPERS
// ==========================================

function getStatusColor(status: string) {
  switch (status) {
    case "operational":
      return {
        dot: "bg-[var(--status-success)]",
        text: "text-[var(--status-success)]",
        badge: "border-[var(--status-success)]/20 bg-[var(--status-success)]/10 text-[var(--status-success)]",
      };
    case "deploying":
    case "scraping":
    case "chunking":
    case "embedding":
    case "storing":
    case "pending":
      return {
        dot: "bg-[var(--status-warning)]",
        text: "text-[var(--status-warning)]",
        badge: "border-[var(--status-warning)]/20 bg-[var(--status-warning)]/10 text-[var(--status-warning)]",
      };
    case "failed":
      return {
        dot: "bg-[var(--status-error)]",
        text: "text-[var(--status-error)]",
        badge: "border-[var(--status-error)]/20 bg-[var(--status-error)]/10 text-[var(--status-error)]",
      };
    default:
      return {
        dot: "bg-[var(--text-muted)]/40",
        text: "text-[var(--text-muted)]/40",
        badge: "border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-muted)]",
      };
  }
}

function getSourceIcon(sourceType: string) {
  switch (sourceType) {
    case "Website":
      return "language";
    case "PDF":
      return "picture_as_pdf";
    case "Docs":
      return "menu_book";
    default:
      return "description";
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ==========================================
// COMPONENT
// ==========================================

export default function MCPServerDetailPage() {

  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const serverId = params.serverId as string;
  const { isDark } = useTheme();

  // ==========================================
  // STATE
  // ==========================================

  const [user, setUser] =
    useState<any>(null);

  const [server, setServer] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [copied, setCopied] =
    useState(false);

  const [copiedQuery, setCopiedQuery] =
    useState(false);

  // Query tester state
  const [queryText, setQueryText] =
    useState("");

  const [queryTopK, setQueryTopK] =
    useState(5);

  const [queryLoading, setQueryLoading] =
    useState(false);

  const [queryResults, setQueryResults] =
    useState<any>(null);

  const [queryError, setQueryError] =
    useState<string | null>(null);

  // Delete state
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  // Connection guide state
  const [showConnectGuide, setShowConnectGuide] =
    useState(false);

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

      const { data, error } =
        await supabase
          .from("mcp_servers")
          .select("*")
          .eq("id", serverId)
          .single();

      if (error || !data) {
        router.push("/dashboard/mcp-servers");
        return;
      }

      setServer(data);
      setLoading(false);
    }

    loadData();

  }, [serverId]);

  // ==========================================
  // AUTO-REFRESH STATUS
  // ==========================================

  useEffect(() => {

    if (!server) return;

    // Only poll if still deploying
    const activeStatuses = [
      "pending",
      "scraping",
      "chunking",
      "embedding",
      "storing",
      "deploying",
    ];

    if (
      !activeStatuses.includes(
        server.deployment_status
      )
    ) return;

    const interval = setInterval(
      async () => {

        const { data } =
          await supabase
            .from("mcp_servers")
            .select("*")
            .eq("id", serverId)
            .single();

        if (data) {
          setServer(data);
        }
      },
      3000
    );

    return () => clearInterval(interval);

  }, [server?.deployment_status]);

  // ==========================================
  // COPY ENDPOINT
  // ==========================================

  const handleCopy = (
    text: string,
    setter: (v: boolean) => void
  ) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(
      () => setter(false),
      2000
    );
  };

  // ==========================================
  // QUERY TESTER
  // ==========================================

  const handleQuery = async () => {

    if (!queryText.trim()) return;
    if (!server?.endpoint) return;

    setQueryLoading(true);
    setQueryError(null);
    setQueryResults(null);

    try {
      const endpoint =
        server.endpoint.replace(
          /\/$/,
          ""
        );

      const res = await fetch(
        `${endpoint}/query`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            query: queryText.trim(),
            topK: queryTopK,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setQueryError(
          data.error ||
          `Request failed (${res.status})`
        );
      } else {
        setQueryResults(data);
      }
    } catch (err: any) {
      setQueryError(
        err.message ||
        "Failed to reach endpoint"
      );
    } finally {
      setQueryLoading(false);
    }
  };

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
            Loading MCP Server...
          </span>

        </div>

      </div>
    );
  }

  // ==========================================
  // DERIVED
  // ==========================================

  const status = getStatusColor(
    server?.deployment_status || ""
  );

  const curlCommand =
    server?.endpoint
      ? `curl -X POST ${server.endpoint}/query \\\n  -H "Content-Type: application/json" \\\n  -d '{"query": "your question here", "topK": 5}'`
      : "";

  // ==========================================
  // DELETE HANDLER
  // ==========================================

  const handleDelete = async () => {

    setDeleting(true);

    try {
      const res = await fetch(
        "/api/mcp/delete",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            serverId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
          "Failed to delete server"
        );
        setDeleting(false);
        return;
      }

      router.push(
        "/dashboard/mcp-servers"
      );
    } catch (err: any) {
      alert(
        err.message ||
        "Failed to delete server"
      );
      setDeleting(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
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

          {/* GRID BG */}
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
          <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full blur-[140px]" style={{ background: 'var(--gradient-glow-1)' }} />

          <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[140px]" style={{ background: 'var(--gradient-glow-2)' }} />

          {/* CONTENT */}
          <div className="relative z-10">

            {/* BACK BUTTON */}
            <button
              onClick={() =>
                router.push(
                  "/dashboard/mcp-servers"
                )
              }
              className="mb-8 flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            >

              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>

              Back to MCP Servers

            </button>

            {/* ====================================== */}
            {/* HEADER CARD                            */}
            {/* ====================================== */}

            <div
              className="mb-8 overflow-hidden rounded-2xl border backdrop-blur-md"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
              }}
            >

              <div className="relative p-8">

                {/* HERO GLOW */}
                <div className="absolute right-[-10%] top-[-20%] h-[300px] w-[300px] rounded-full blur-[120px]" style={{ background: 'var(--gradient-glow-3)' }} />

                <div className="relative z-10">

                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                    <div className="flex items-center gap-6">

                      {/* ICON */}
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl border"
                        style={{
                          borderColor: 'var(--border-primary)',
                          background: 'rgba(var(--accent-rgb), 0.1)',
                        }}
                      >

                        <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--accent-primary)' }}>
                          {getSourceIcon(
                            server?.source_type
                          )}
                        </span>

                      </div>

                      <div>

                        <p
                          className="mb-2 font-mono text-[9px] uppercase tracking-[0.25em]"
                          style={{ color: 'var(--accent-primary)', opacity: 0.8 }}
                        >
                          MCP SERVER RUNTIME
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight">
                          {server?.name}
                        </h1>

                        <div className="mt-3 flex items-center gap-4">

                          {/* SOURCE TYPE */}
                          <span
                            className="rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                            style={{
                              border: '1px solid var(--border-primary)',
                              background: 'var(--bg-elevated)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {server?.source_type}
                          </span>

                          {/* STATUS BADGE */}
                          <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${status.badge}`}>

                            <div className={`h-1.5 w-1.5 animate-pulse rounded-full ${status.dot}`} />

                            {server?.deployment_status}

                          </span>

                        </div>

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-3">

                      {/* CONNECT BUTTON */}
                      {server?.endpoint && (
                        <button
                          onClick={() => setShowConnectGuide(true)}
                          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            borderColor: 'var(--border-primary)',
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <span className="material-symbols-outlined text-base">
                            cable
                          </span>
                          Connect
                        </button>
                      )}

                      {server?.endpoint &&
                        server.endpoint.startsWith("http") && (

                        <a
                          href={`${server.endpoint}/health`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            borderColor: 'var(--border-primary)',
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                          }}
                        >

                          <span className="material-symbols-outlined text-base">
                            monitor_heart
                          </span>

                          Health Check

                        </a>
                      )}

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() =>
                          setShowDeleteModal(true)
                        }
                        className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          borderColor: 'rgba(224,90,90,0.2)',
                          background: 'rgba(224,90,90,0.05)',
                          color: 'var(--status-error)',
                        }}
                      >

                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ====================================== */}
            {/* STATS ROW                              */}
            {/* ====================================== */}

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">

              {/* DOCUMENTS */}
              <div
                className="rounded-2xl border p-6 backdrop-blur-md"
                style={{
                  borderColor: 'var(--border-primary)',
                  background: 'var(--bg-card)',
                }}
              >

                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}
                >
                  <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-primary)' }}>
                    article
                  </span>
                </div>

                <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Documents
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  {server?.total_documents ?? "—"}
                </h2>

              </div>

              {/* CHUNKS */}
              <div
                className="rounded-2xl border p-6 backdrop-blur-md"
                style={{
                  borderColor: 'var(--border-primary)',
                  background: 'var(--bg-card)',
                }}
              >

                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(var(--highlight-rgb), 0.1)' }}
                >
                  <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-highlight)' }}>
                    data_object
                  </span>
                </div>

                <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Chunks
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  {server?.total_chunks ?? "—"}
                </h2>

              </div>

              {/* EMBEDDINGS */}
              <div
                className="rounded-2xl border p-6 backdrop-blur-md"
                style={{
                  borderColor: 'var(--border-primary)',
                  background: 'var(--bg-card)',
                }}
              >

                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}
                >
                  <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-primary)' }}>
                    hub
                  </span>
                </div>

                <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Embeddings
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  {server?.total_embeddings ?? "—"}
                </h2>

              </div>

              {/* CREATED */}
              <div
                className="rounded-2xl border p-6 backdrop-blur-md"
                style={{
                  borderColor: 'var(--border-primary)',
                  background: 'var(--bg-card)',
                }}
              >

                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}
                >
                  <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-secondary)' }}>
                    schedule
                  </span>
                </div>

                <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Created
                </p>

                <p className="mt-2.5 text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(
                    server?.created_at
                  )}
                </p>

              </div>

            </div>

            {/* ====================================== */}
            {/* TWO COLUMN LAYOUT                      */}
            {/* ====================================== */}

            <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">

              {/* ================================== */}
              {/* LEFT: CONNECTION INFO              */}
              {/* ================================== */}

              <div className="space-y-8">

                {/* SOURCE URL */}
                <div
                  className="rounded-2xl border p-6 backdrop-blur-md"
                  style={{
                    borderColor: 'var(--border-primary)',
                    background: 'var(--bg-card)',
                  }}
                >

                  <div className="mb-4 flex items-center gap-3">

                    <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-primary)' }}>
                      language
                    </span>

                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Source URL
                    </p>

                  </div>

                  <a
                    href={server?.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all text-sm transition hover:text-[var(--accent-primary)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {server?.source_url}
                  </a>

                </div>

                {/* CLOUDFLARE ENDPOINT */}
                <div
                  className="rounded-2xl border p-6 backdrop-blur-md"
                  style={{
                    borderColor: 'var(--border-primary)',
                    background: 'var(--bg-card)',
                  }}
                >

                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-secondary)' }}>
                        cloud
                      </span>

                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        Cloudflare Endpoint
                      </p>

                    </div>

                    {server?.endpoint &&
                      server.endpoint.startsWith("http") && (

                      <button
                        onClick={() =>
                          handleCopy(
                            server.endpoint,
                            setCopied
                          )
                        }
                        className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] transition hover:bg-[var(--bg-elevated)]"
                        style={{
                          borderColor: 'var(--border-primary)',
                          background: 'var(--bg-elevated)',
                          color: 'var(--text-secondary)',
                        }}
                      >

                        <span className="material-symbols-outlined text-sm">
                          {copied
                            ? "check"
                            : "content_copy"}
                        </span>

                        {copied
                          ? "Copied"
                          : "Copy"}

                      </button>
                    )}

                  </div>

                  {server?.endpoint &&
                    server.endpoint.startsWith("http") ? (

                    <a
                      href={server.endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block break-all rounded-xl border p-4 font-mono text-xs transition"
                      style={{
                        borderColor: 'var(--border-primary)',
                        background: 'var(--bg-primary)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {server.endpoint}
                    </a>

                  ) : (

                    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)' }}>

                      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        {server?.endpoint ||
                          "Not yet deployed"}
                      </p>

                    </div>
                  )}

                  {/* AVAILABLE ROUTES */}
                  {server?.endpoint &&
                    server.endpoint.startsWith("http") && (

                    <div className="mt-4 flex items-center gap-2">

                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                        Routes:
                      </span>

                      <code className="rounded-lg border px-2 py-0.5 font-mono text-[10px]" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--accent-secondary)' }}>
                        GET /health
                      </code>

                      <code className="rounded-lg border px-2 py-0.5 font-mono text-[10px]" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)', color: 'var(--accent-secondary)' }}>
                        POST /query
                      </code>

                    </div>
                  )}

                </div>

                {/* CURL COMMAND */}
                {server?.endpoint &&
                  server.endpoint.startsWith("http") && (

                  <div
                    className="rounded-2xl border p-6 backdrop-blur-md"
                    style={{
                      borderColor: 'var(--border-primary)',
                      background: 'var(--bg-card)',
                    }}
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-secondary)' }}>
                          terminal
                        </span>

                        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Quick Start (cURL)
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          handleCopy(
                            curlCommand,
                            setCopiedQuery
                          )
                        }
                        className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] transition hover:bg-[var(--bg-elevated)]"
                        style={{
                          borderColor: 'var(--border-primary)',
                          background: 'var(--bg-elevated)',
                          color: 'var(--text-secondary)',
                        }}
                      >

                        <span className="material-symbols-outlined text-sm">
                          {copiedQuery
                            ? "check"
                            : "content_copy"}
                        </span>

                        {copiedQuery
                          ? "Copied"
                          : "Copy"}

                      </button>

                    </div>

                    <pre
                      className="overflow-x-auto rounded-xl border p-4 font-mono text-[11px] leading-relaxed"
                      style={{
                        borderColor: 'var(--border-primary)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {curlCommand}
                    </pre>

                  </div>
                )}

              </div>

              {/* ================================== */}
              {/* RIGHT: QUERY TESTER               */}
              {/* ================================== */}

              <div className="space-y-8">

                {/* PIPELINE STATUS */}
                <div
                  className="rounded-2xl border p-6 backdrop-blur-md"
                  style={{
                    borderColor: 'var(--border-primary)',
                    background: 'var(--bg-card)',
                  }}
                >

                  <div className="mb-6 flex items-center gap-3">

                    <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-primary)' }}>
                      fact_check
                    </span>

                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Pipeline Status
                    </p>

                  </div>

                  <div className="space-y-3">

                    {[
                      {
                        label: "Ingestion",
                        key: "ingest_status",
                        icon: "download",
                      },
                      {
                        label: "Deployment",
                        key: "deployment_status",
                        icon: "rocket_launch",
                      },
                    ].map((item) => {

                      const val =
                        server?.[item.key] || "unknown";

                      const s =
                        getStatusColor(val);

                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between rounded-xl border p-3"
                          style={{
                            borderColor: 'var(--border-primary)',
                            background: 'var(--bg-elevated)',
                          }}
                        >

                          <div className="flex items-center gap-3">

                            <span className="material-symbols-outlined text-lg" style={{ color: 'var(--text-muted)' }}>
                              {item.icon}
                            </span>

                            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                              {item.label}
                            </span>

                          </div>

                          <span className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${s.badge}`}>

                            <div className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />

                            {val}

                          </span>

                        </div>
                      );
                    })}

                  </div>

                  {/* ERROR MESSAGE */}
                  {server?.error_message && (

                    <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'rgba(224,90,90,0.2)', background: 'rgba(224,90,90,0.05)' }}>

                      <p className="mb-1 font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--status-error)' }}>
                        Error
                      </p>

                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {server.error_message}
                      </p>

                    </div>
                  )}

                </div>

                {/* QUERY TESTER */}
                {server?.endpoint &&
                  server.endpoint.startsWith("http") && (

                  <div
                    className="rounded-2xl border p-6 backdrop-blur-md"
                    style={{
                      borderColor: 'var(--border-primary)',
                      background: 'var(--bg-card)',
                    }}
                  >

                    <div className="mb-6 flex items-center gap-3">

                      <span className="material-symbols-outlined text-xl" style={{ color: 'var(--accent-highlight)' }}>
                        search
                      </span>

                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        Live Query Tester
                      </p>

                    </div>

                    {/* INPUT */}
                    <div className="mb-4">

                      <textarea
                        value={queryText}
                        onChange={(e) =>
                          setQueryText(
                            e.target.value
                          )
                        }
                        placeholder="Ask a question about your ingested data..."
                        rows={3}
                        className="w-full resize-none rounded-xl border p-4 text-xs outline-none transition focus:ring-1"
                        style={{
                          borderColor: 'var(--border-primary)',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                        }}
                      />

                    </div>

                    {/* CONTROLS */}
                    <div className="mb-4 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <label className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                          Top K:
                        </label>

                        <select
                          value={queryTopK}
                          onChange={(e) =>
                            setQueryTopK(
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="rounded-lg border px-2 py-1.5 font-mono text-xs outline-none"
                          style={{
                            borderColor: 'var(--border-primary)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {[3, 5, 8, 10, 15, 20].map(
                            (n) => (
                              <option
                                key={n}
                                value={n}
                                style={{ background: 'var(--bg-card)' }}
                              >
                                {n}
                              </option>
                            )
                          )}
                        </select>

                      </div>

                      <button
                        onClick={handleQuery}
                        disabled={
                          queryLoading ||
                          !queryText.trim()
                        }
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
                        style={{
                          background: 'var(--gradient-primary)',
                        }}
                      >

                        {queryLoading ? (

                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                        ) : (

                          <span className="material-symbols-outlined text-base">
                            send
                          </span>

                        )}

                        {queryLoading
                          ? "Querying..."
                          : "Run Query"}

                      </button>

                    </div>

                    {/* ERROR */}
                    {queryError && (

                      <div className="mb-4 rounded-xl border p-4" style={{ borderColor: 'rgba(224,90,90,0.2)', background: 'rgba(224,90,90,0.05)' }}>

                        <p className="text-xs" style={{ color: 'var(--status-error)' }}>
                          {queryError}
                        </p>

                      </div>
                    )}

                    {/* RESULTS */}
                    {queryResults && (

                      <div>

                        <div className="mb-3 flex items-center justify-between border-t border-[var(--border-primary)] pt-4">

                          <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                            Results ({queryResults.total || 0})
                          </p>

                        </div>

                        <div className="max-h-[350px] space-y-3 overflow-y-auto pr-1">

                          {(queryResults.results || []).map(
                            (
                              result: any,
                              i: number
                            ) => (

                              <div
                                key={i}
                                className="rounded-xl border p-4"
                                style={{
                                  borderColor: 'var(--border-primary)',
                                  background: 'var(--bg-elevated)',
                                }}
                              >

                                <div className="mb-2 flex items-center justify-between">

                                  <div className="flex items-center gap-2">

                                    <span className="flex h-5 w-5 items-center justify-center rounded-md font-mono text-[10px] font-bold" style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent-primary)' }}>
                                      {result.rank || i + 1}
                                    </span>

                                    {result.heading && (

                                      <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                        {result.heading}
                                      </span>
                                    )}

                                  </div>

                                  {result.similarity != null && (

                                    <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
                                      {(
                                        result.similarity *
                                        100
                                      ).toFixed(1)}
                                      % match
                                    </span>
                                  )}

                                </div>

                                <p className="line-clamp-4 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                  {result.text}
                                </p>

                                {result.source_url && (

                                  <a
                                    href={
                                      result.source_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 block truncate text-[11px] transition hover:text-[var(--accent-primary)]"
                                    style={{ color: 'var(--text-muted)' }}
                                  >
                                    {result.source_url}
                                  </a>
                                )}

                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                  </div>
                )}

                {/* SERVER METADATA */}
                <div
                  className="rounded-2xl border p-6 backdrop-blur-md"
                  style={{
                    borderColor: 'var(--border-primary)',
                    background: 'var(--bg-card)',
                  }}
                >

                  <div className="mb-6 flex items-center gap-3">

                    <span className="material-symbols-outlined text-xl" style={{ color: 'var(--text-muted)' }}>
                      info
                    </span>

                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Server Metadata
                    </p>

                  </div>

                  <div className="space-y-2">

                    {[
                      {
                        label: "Server ID",
                        value: server?.id,
                      },
                      {
                        label: "Source Type",
                        value: server?.source_type,
                      },
                      {
                        label: "Created",
                        value: formatDate(
                          server?.created_at
                        ),
                      },
                      {
                        label: "Last Updated",
                        value: formatDate(
                          server?.updated_at
                        ),
                      },
                    ].map((item) => (

                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border px-4 py-2.5"
                        style={{
                          borderColor: 'var(--border-primary)',
                          background: 'var(--bg-elevated)',
                        }}
                      >

                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                          {item.label}
                        </span>

                        <span className="max-w-[60%] truncate text-right font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {item.value || "—"}
                        </span>

                      </div>
                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* DELETE CONFIRMATION MODAL               */}
      {/* ====================================== */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-[999] flex items-center justify-center">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() =>
              !deleting &&
              setShowDeleteModal(false)
            }
          />

          {/* MODAL */}
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[20px] border p-8 shadow-2xl"
            style={{
              borderColor: 'rgba(224,90,90,0.15)',
              background: 'var(--bg-primary)',
            }}
          >

            {/* GLOW */}
            <div className="absolute left-[-20%] top-[-20%] h-[200px] w-[200px] rounded-full blur-[100px]" style={{ background: 'rgba(224,90,90,0.05)' }} />

            <div className="relative z-10">

              {/* ICON */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border" style={{ borderColor: 'rgba(224,90,90,0.2)', background: 'rgba(224,90,90,0.05)' }}>

                <span className="material-symbols-outlined text-2xl text-[var(--status-error)]">
                  delete_forever
                </span>

              </div>

              {/* TITLE */}
              <h2 className="mb-3 text-xl font-bold">
                Delete MCP Server
              </h2>

              {/* DESCRIPTION */}
              <p className="mb-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                You are about to permanently delete
                <span className="font-semibold text-[var(--text-primary)]">
                  {" "}{server?.name}
                </span>
                {" "}and all of its associated data.
              </p>

              {/* WARNING */}
              <div className="mb-6 rounded-xl border p-4" style={{ borderColor: 'rgba(224,90,90,0.2)', background: 'rgba(224,90,90,0.05)' }}>

                <div className="flex items-start gap-3">

                  <span className="material-symbols-outlined mt-0.5 text-base text-[var(--status-error)]">
                    warning
                  </span>

                  <div>

                    <p className="text-xs font-semibold text-[var(--status-error)]">
                      This action is irreversible
                    </p>

                    <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      All documents, chunks, embeddings, and the Cloudflare
                      Worker endpoint will be permanently removed.
                    </p>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                  className="flex-1 rounded-xl border py-2.5 text-xs font-medium transition hover:bg-[var(--bg-elevated)] disabled:opacity-40"
                  style={{
                    borderColor: 'var(--border-primary)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
                  style={{
                    background: 'var(--status-error)',
                  }}
                >

                  {deleting ? (

                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Deleting...
                    </>

                  ) : (

                    <>
                      <span className="material-symbols-outlined text-base">
                        delete
                      </span>
                      Yes, Delete
                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* CONNECTION GUIDE */}
      {server && (
        <ConnectionGuide
          endpoint={server.endpoint}
          serverName={server.name}
          isOpen={showConnectGuide}
          onClose={() => setShowConnectGuide(false)}
        />
      )}

    </main>
  )
}
