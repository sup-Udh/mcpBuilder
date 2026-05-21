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

// ==========================================
// STATUS HELPERS
// ==========================================

function getStatusColor(status: string) {
  switch (status) {
    case "operational":
      return {
        dot: "bg-green-400",
        text: "text-green-300",
        badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };
    case "deploying":
    case "scraping":
    case "chunking":
    case "embedding":
    case "storing":
    case "pending":
      return {
        dot: "bg-amber-400",
        text: "text-amber-300",
        badge: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      };
    case "failed":
      return {
        dot: "bg-red-400",
        text: "text-red-300",
        badge: "border-red-500/20 bg-red-500/10 text-red-300",
      };
    default:
      return {
        dot: "bg-white/40",
        text: "text-white/40",
        badge: "border-white/10 bg-white/[0.03] text-white/50",
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
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">

        <div className="flex items-center gap-4">

          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />

          <span className="text-white/60">
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
  // RENDER
  // ==========================================

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

          {/* GRID BG */}
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

            {/* BACK BUTTON */}
            <button
              onClick={() =>
                router.push(
                  "/dashboard/mcp-servers"
                )
              }
              className="mb-8 flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white/50 transition hover:bg-white/[0.03] hover:text-white"
            >

              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>

              Back to MCP Servers

            </button>

            {/* ====================================== */}
            {/* HEADER CARD                            */}
            {/* ====================================== */}

            <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1120]/70 backdrop-blur-xl">

              <div className="relative p-8">

                {/* HERO GLOW */}
                <div className="absolute right-[-10%] top-[-20%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[120px]" />

                <div className="relative z-10">

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-6">

                      {/* ICON */}
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-300/10 bg-blue-400/10">

                        <span className="material-symbols-outlined text-4xl text-blue-200">
                          {getSourceIcon(
                            server?.source_type
                          )}
                        </span>

                      </div>

                      <div>

                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-blue-200/50">
                          MCP SERVER RUNTIME
                        </p>

                        <h1 className="text-5xl font-bold tracking-tight">
                          {server?.name}
                        </h1>

                        <div className="mt-4 flex items-center gap-4">

                          {/* SOURCE TYPE */}
                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
                            {server?.source_type}
                          </span>

                          {/* STATUS BADGE */}
                          <span className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${status.badge}`}>

                            <div className={`h-2 w-2 animate-pulse rounded-full ${status.dot}`} />

                            {server?.deployment_status}

                          </span>

                        </div>

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3">

                      {server?.endpoint &&
                        server.endpoint.startsWith("http") && (

                        <a
                          href={`${server.endpoint}/health`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/60 transition hover:border-blue-300/20 hover:text-white"
                        >

                          <span className="material-symbols-outlined text-base">
                            monitor_heart
                          </span>

                          Health Check

                        </a>
                      )}

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
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <span className="material-symbols-outlined text-2xl text-blue-200">
                    article
                  </span>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Documents
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  {server?.total_documents ?? "—"}
                </h2>

              </div>

              {/* CHUNKS */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                  <span className="material-symbols-outlined text-2xl text-violet-200">
                    data_object
                  </span>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Chunks
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  {server?.total_chunks ?? "—"}
                </h2>

              </div>

              {/* EMBEDDINGS */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                  <span className="material-symbols-outlined text-2xl text-cyan-200">
                    hub
                  </span>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Embeddings
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  {server?.total_embeddings ?? "—"}
                </h2>

              </div>

              {/* CREATED */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <span className="material-symbols-outlined text-2xl text-emerald-200">
                    schedule
                  </span>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Created
                </p>

                <p className="mt-3 text-lg font-semibold text-white/70">
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
                <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl">

                  <div className="mb-4 flex items-center gap-3">

                    <span className="material-symbols-outlined text-xl text-blue-200">
                      language
                    </span>

                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                      Source URL
                    </p>

                  </div>

                  <a
                    href={server?.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all text-base text-blue-200/80 transition hover:text-blue-200"
                  >
                    {server?.source_url}
                  </a>

                </div>

                {/* CLOUDFLARE ENDPOINT */}
                <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl">

                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <span className="material-symbols-outlined text-xl text-violet-200">
                        cloud
                      </span>

                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
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
                        className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition hover:border-blue-300/20 hover:text-white"
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
                      className="block break-all rounded-xl border border-white/5 bg-white/[0.02] p-4 font-mono text-sm text-emerald-300 transition hover:border-blue-300/10"
                    >
                      {server.endpoint}
                    </a>

                  ) : (

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">

                      <p className="font-mono text-sm text-white/30">
                        {server?.endpoint ||
                          "Not yet deployed"}
                      </p>

                    </div>
                  )}

                  {/* AVAILABLE ROUTES */}
                  {server?.endpoint &&
                    server.endpoint.startsWith("http") && (

                    <div className="mt-4 flex items-center gap-3">

                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                        Routes:
                      </span>

                      <code className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1 font-mono text-xs text-cyan-300">
                        GET /health
                      </code>

                      <code className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1 font-mono text-xs text-cyan-300">
                        POST /query
                      </code>

                    </div>
                  )}

                </div>

                {/* CURL COMMAND */}
                {server?.endpoint &&
                  server.endpoint.startsWith("http") && (

                  <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl">

                    <div className="mb-4 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span className="material-symbols-outlined text-xl text-cyan-200">
                          terminal
                        </span>

                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
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
                        className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition hover:border-blue-300/20 hover:text-white"
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

                    <pre className="overflow-x-auto rounded-xl border border-white/5 bg-[#0A0E1A] p-4 font-mono text-xs leading-relaxed text-green-300/80">
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
                <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl">

                  <div className="mb-6 flex items-center gap-3">

                    <span className="material-symbols-outlined text-xl text-emerald-200">
                      fact_check
                    </span>

                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                      Pipeline Status
                    </p>

                  </div>

                  <div className="space-y-4">

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
                          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        >

                          <div className="flex items-center gap-3">

                            <span className="material-symbols-outlined text-lg text-white/40">
                              {item.icon}
                            </span>

                            <span className="text-sm font-medium text-white/70">
                              {item.label}
                            </span>

                          </div>

                          <span className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${s.badge}`}>

                            <div className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />

                            {val}

                          </span>

                        </div>
                      );
                    })}

                  </div>

                  {/* ERROR MESSAGE */}
                  {server?.error_message && (

                    <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-red-300/70">
                        Error
                      </p>

                      <p className="text-sm text-red-200/80">
                        {server.error_message}
                      </p>

                    </div>
                  )}

                </div>

                {/* QUERY TESTER */}
                {server?.endpoint &&
                  server.endpoint.startsWith("http") && (

                  <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl">

                    <div className="mb-6 flex items-center gap-3">

                      <span className="material-symbols-outlined text-xl text-amber-200">
                        search
                      </span>

                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
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
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-blue-300/30 focus:ring-1 focus:ring-blue-300/20"
                      />

                    </div>

                    {/* CONTROLS */}
                    <div className="mb-4 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">
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
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-white outline-none"
                        >
                          {[3, 5, 8, 10, 15, 20].map(
                            (n) => (
                              <option
                                key={n}
                                value={n}
                                className="bg-[#0B1120]"
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
                        className="flex items-center gap-2 rounded-xl bg-blue-200 px-5 py-2.5 text-sm font-semibold text-[#020617] shadow-[0_0_25px_rgba(173,198,255,0.2)] transition hover:scale-[1.02] hover:brightness-110 disabled:opacity-40 disabled:hover:scale-100"
                      >

                        {queryLoading ? (

                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#020617] border-t-transparent" />

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

                      <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                        <p className="text-sm text-red-200/80">
                          {queryError}
                        </p>

                      </div>
                    )}

                    {/* RESULTS */}
                    {queryResults && (

                      <div>

                        <div className="mb-3 flex items-center justify-between">

                          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                            Results ({queryResults.total || 0})
                          </p>

                        </div>

                        <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">

                          {(queryResults.results || []).map(
                            (
                              result: any,
                              i: number
                            ) => (

                              <div
                                key={i}
                                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                              >

                                <div className="mb-2 flex items-center justify-between">

                                  <div className="flex items-center gap-2">

                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 font-mono text-[10px] font-bold text-blue-300">
                                      {result.rank || i + 1}
                                    </span>

                                    {result.heading && (

                                      <span className="text-xs font-medium text-white/70">
                                        {result.heading}
                                      </span>
                                    )}

                                  </div>

                                  {result.similarity != null && (

                                    <span className="font-mono text-[10px] text-white/30">
                                      {(
                                        result.similarity *
                                        100
                                      ).toFixed(1)}
                                      % match
                                    </span>
                                  )}

                                </div>

                                <p className="line-clamp-4 text-sm leading-relaxed text-white/50">
                                  {result.text}
                                </p>

                                {result.source_url && (

                                  <a
                                    href={
                                      result.source_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 block truncate text-xs text-blue-300/50 transition hover:text-blue-300"
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
                <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl">

                  <div className="mb-6 flex items-center gap-3">

                    <span className="material-symbols-outlined text-xl text-white/40">
                      info
                    </span>

                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                      Server Metadata
                    </p>

                  </div>

                  <div className="space-y-3">

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
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-4 py-3"
                      >

                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                          {item.label}
                        </span>

                        <span className="max-w-[60%] truncate text-right font-mono text-xs text-white/60">
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

    </main>
  );
}
