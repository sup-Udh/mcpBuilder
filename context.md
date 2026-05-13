# MCP Builder — Master Project Context

> Paste this entire document at the start of any new conversation with any AI model to get full context on the project instantly.

---

## What you are helping me build

I am building a product called **MCP Builder** — a no-code visual platform that lets anyone turn any text-based data source into a deployed MCP (Model Context Protocol) server that AI models like Claude can query.

The core value proposition:
> "Turn anything you already have into something an AI can use — without writing code."

A user pastes a URL (RSS feed, website, documentation site, PDF), your app ingests and processes the content, generates a real MCP server, deploys it to Cloudflare Workers, and hands the user back a live endpoint URL they paste into Claude Desktop. From that point Claude can answer questions about that content.

---

## What MCP actually is

MCP (Model Context Protocol) is an open standard — like USB but for AI. It lets any AI model connect to any external tool or data source in a consistent way. An MCP server is a lightweight program that:

- Declares a list of tools (functions the AI can call)
- Waits for an AI client to call one of those tools
- Does the work and returns a result

MCP servers can be hosted locally (runs on the user's machine, talks over stdio) or remotely (runs on a server, accessible over HTTP — this is what we build). Claude Desktop, Cursor, and other AI clients all support MCP. The user adds an MCP server by pasting its URL into a config file on their computer. Claude then connects to it automatically on startup.

---

## The product in one diagram

```
User pastes URL
      ↓
Source detection (RSS / webpage / docs site / PDF)
      ↓
Content extraction (fetch → strip HTML → clean text)
      ↓
Chunking (split into ~400 word overlapping pieces)
      ↓
Embedding (convert chunks to vectors via OpenAI)
      ↓
Vector DB (store in Supabase pgvector)
      ↓
Code generation (produce TypeScript MCP server)
      ↓
Deployment (push to Cloudflare Workers via API)
      ↓
User gets live endpoint URL
      ↓
User pastes URL into Claude Desktop config file
      ↓
Claude can now answer questions about that content
```

---

## How the deployed MCP server gets used

The deployed server lives at a public URL like:
`https://mcp.ourapp.com/u/abc123`

The user adds this to their Claude Desktop config file:
```json
{
  "mcpServers": {
    "tailwind-docs": {
      "url": "https://mcp.ourapp.com/u/abc123"
    }
  }
}
```

Config file location:
- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

When Claude Desktop starts, it connects to the server, learns what tools it exposes, and calls them automatically whenever the user asks a relevant question. The user just chats normally — the MCP calls happen silently in the background.

Network flow:
```
User's computer (Claude Desktop)
      ↓  sends message
Anthropic servers (Claude runs here)
      ↓  Claude calls MCP tool via HTTP
Cloudflare Workers (our MCP server runs here)
      ↓  queries vector DB
Supabase (vector DB lives here)
      ↓  returns matching chunks
Cloudflare Workers
      ↓  returns results to Claude
Anthropic servers
      ↓  Claude writes answer using results
User's computer
      shows answer
```

---

## URL types we handle (v1 — text only)

**RSS feed**
```
https://feeds.buzzsprout.com/2175779.rss
https://blog.example.com/feed.xml
```
Structured XML. Extract title, date, description per item. Easiest case.

**Single webpage**
```
https://en.wikipedia.org/wiki/Artificial_intelligence
https://paulgraham.com/startups.html
```
Strip HTML, extract main article body using Mozilla Readability, convert to plain text.

**Documentation / multi-page site**
```
https://docs.anthropic.com
https://react.dev/learn
https://tailwindcss.com/docs
```
Crawl homepage, extract all same-domain links, fetch and strip each page, combine into one text corpus. Cap at 100 pages for v1.

**PDF**
```
https://arxiv.org/pdf/2303.08774
https://company.com/report.pdf
```
Binary file — use pdf-parse library to extract text. Detect scanned PDFs (no extractable text) and show a clear error.

**Not supported in v1**
- Audio files (MP3, WAV) — no Whisper transcription yet
- Video files (MP4, YouTube) — no transcription yet
- Image-only PDFs (scanned documents)
- Paywalled or login-required pages

---

## How HTML stripping works

Raw HTML goes through 4 layers to become clean text:

**Layer 1 — Remove non-content tags entirely**
Strip `<script>`, `<style>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, `<form>`, `<iframe>`, `<noscript>`, `<svg>`, HTML comments.

**Layer 2 — Extract main content block**
Try in order: `<article>`, `<main>`, divs with class/id containing "content", "article", "post", "body". Fall back to full `<body>` if nothing found. Mozilla Readability handles this automatically for most pages.

**Layer 3 — Convert remaining HTML to plain text**
- `<h1>` `<h2>` `<h3>` → keep text, add newlines
- `<p>` → keep text, add newline after
- `<li>` → prepend "- ", add newline
- `<a>` → keep link text only, discard href
- `<b>` `<strong>` `<i>` `<em>` → keep text, discard tags
- All other tags → keep text content, discard tag

**Layer 4 — Final cleanup**
- 3+ consecutive newlines → 2 newlines
- Multiple spaces → single space
- Remove invisible unicode characters
- Skip blocks under 50 words (captions, labels)

---

## Chunking explained

A full webpage or article might be 10,000–30,000 words. We can't store or search that as one unit because:
- Embedding models have token limits (~500 words max)
- Returning a full document to Claude blows its context window
- We want to return only the relevant paragraph, not the whole thing

Solution — split into overlapping chunks:
```
Full text (10,000 words)
      ↓
Chunk 1: words 1–400
Chunk 2: words 350–750    ← 50 word overlap with chunk 1
Chunk 3: words 700–1100
...and so on
```

Each chunk is stored with metadata:
```json
{
  "text": "...400 words of content...",
  "metadata": {
    "title": "Page or episode title",
    "url": "source URL",
    "date": "2025-05-09",
    "chunkIndex": 4
  }
}
```

---

## Embedding and vector search explained

Each chunk is converted to a vector — a list of 1536 numbers that mathematically represents the meaning of that text. When a user queries Claude ("how do I center a div in Tailwind?"), the query also gets converted to a vector. The vector DB finds the 5 chunks whose vectors are closest in meaning and returns them to Claude.

This is semantic search — it finds meaning not just matching keywords. "center a div" finds chunks that mention "flex justify-center items-center" even though those exact words weren't in the query.

Model used: `text-embedding-3-small` (OpenAI) — cheap, fast, good quality.

---

## The code generator

The code generator reads a config object and outputs a complete TypeScript MCP server as a string. This generated code is then bundled with esbuild and deployed to Cloudflare Workers via their REST API.

The generated MCP server exposes one tool in v1:
- `search(query: string)` — semantic search over the ingested content

The tool description is auto-generated from the source name and used verbatim in the MCP schema — this is what Claude reads to decide when to call the tool.

---

## Tech stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | one repo, fast iteration |
| Styling | Tailwind CSS + shadcn/ui | production quality UI fast |
| Backend | Next.js API routes | same repo as frontend for v1 |
| Embeddings | OpenAI text-embedding-3-small | cheap, reliable |
| Vector DB | Supabase pgvector | free tier, Postgres-based |
| MCP hosting | Cloudflare Workers | free tier, fast cold starts, global |
| File storage | Cloudflare R2 | free tier, pairs with Workers |
| Auth | Clerk or NextAuth | don't build auth yourself |
| Bundler | esbuild | bundles generated TS for Workers |

---

## What makes this different from existing tools

| Tool | What it does | What it can't do |
|---|---|---|
| n8n / Zapier | Connect existing apps visually | Doesn't generate MCP servers |
| Langflow | Build AI workflows visually | Not focused on MCP output |
| OpenAI Agent Builder | Connect existing MCP servers | Doesn't let you create new ones |
| podcast-transcriber-mcp | Transcribes one podcast | No semantic search, no hosting |
| Podsidian | Podcast search via MCP | Apple Podcasts only, local only |
| **MCP Builder** | **Visual canvas → deployed MCP server** | **Nothing like this exists cleanly** |

The gap we fill: a general-purpose, hosted, zero-setup framework where anyone pastes a URL and gets back a live MCP endpoint. No local setup, no code, works with any text source.

---

## V1 scope — what we are and are not building

**In v1:**
- Text-based sources only (RSS, webpages, docs sites, PDFs)
- One source per MCP server
- One tool exposed: search
- Simple form UI (no drag and drop canvas yet)
- Deployed to Cloudflare Workers
- Basic auth so users have their own servers
- Three screens: create, result, dashboard

**Not in v1:**
- Audio or video transcription (Whisper)
- Drag and drop canvas (v2)
- Multiple tools per server (v2)
- Scheduling / auto-refresh (v2)
- Analytics (v2)
- Team sharing (v2)
- Cross-server search (v2)

---

## V1 to-do list (full)

### Phase 1 — Data pipeline
- [ ] RSS fetcher — given any RSS URL, extract all items with title, date, description, link
- [ ] URL type detector — detect RSS vs webpage vs docs site vs PDF from Content-Type and content
- [ ] Single page scraper — fetch HTML, run Readability, convert to clean plain text
- [ ] Multi-page crawler — crawl same-domain links up to 100 pages, combine text
- [ ] PDF extractor — extract text from PDF URLs using pdf-parse
- [ ] Text cleaner — strip noise, normalize whitespace, skip blocks under 50 words
- [ ] Scanned PDF detection — if extracted text under 100 chars for multi-page PDF, show error

### Phase 2 — Processing pipeline
- [ ] Chunker — split text into 400 word overlapping chunks with 50 word overlap
- [ ] Metadata tagging — attach source title, URL, date, chunk index to every chunk
- [ ] Embedder — batch embed chunks via OpenAI text-embedding-3-small
- [ ] Supabase setup — pgvector extension, chunks table, similarity search function, index
- [ ] Store chunks — insert chunks + vectors + metadata into Supabase

### Phase 3 — MCP server generation
- [ ] Code generator — take server config, output complete TypeScript MCP server string
- [ ] Single tool: search — query → embed → vector search → return top 5 chunks
- [ ] Error handling in generated code — DB unreachable, bad query → helpful message not crash
- [ ] esbuild bundler — compile generated TS to single JS file for Cloudflare Workers
- [ ] Cloudflare deploy — push bundle via Workers REST API, assign unique subdomain
- [ ] Verify deployment — confirm worker is live before returning URL to user

### Phase 4 — API routes
- [ ] POST /api/ingest — accept URL + server name, run full pipeline, return progress
- [ ] POST /api/deploy — take server ID, generate + deploy, return endpoint URL
- [ ] GET /api/status/:serverId — return ingestion/deployment status + chunk count
- [ ] GET /api/servers — return all servers for current user
- [ ] DELETE /api/servers/:serverId — remove chunks, delete worker, remove record

### Phase 5 — UI
- [ ] Screen 1: Create — server name field, URL field, submit button, progress bar with status messages
- [ ] Screen 2: Result — copyable endpoint URL, step-by-step Claude Desktop instructions, test panel
- [ ] Screen 3: Dashboard — list of servers as cards, copy button, delete with confirmation, empty state
- [ ] Error states — plain English error messages, retry buttons, no raw stack traces
- [ ] Loading states — every action over 1 second shows a loading indicator
- [ ] Auth — Clerk or NextAuth, users see only their own servers

### Phase 6 — Polish
- [ ] Handle 403/blocked pages gracefully
- [ ] Handle empty RSS feeds
- [ ] Handle PDFs with no extractable text
- [ ] Show clear "audio/video not supported in v1" message for those URL types
- [ ] Green "live" badge on deployed servers
- [ ] Red "failed" badge with retry on failed servers

---

## Definition of done for v1

A complete stranger can:
1. Visit the site
2. Paste an RSS feed URL or a documentation URL
3. Wait 2 minutes
4. Get a working MCP endpoint URL
5. Paste it into Claude Desktop
6. Ask Claude a question about that content and get a real answer

That's done. Everything else is v2.

---

## Future v2 ideas (not building yet)

- Drag and drop canvas (visual block system)
- Audio and video transcription via Whisper
- Cross-podcast / cross-source semantic search
- Scheduled re-ingestion when new content is published
- Analytics: which tools get called, what queries are most common
- Team workspaces and shared servers
- Hosted SaaS: paste RSS URL, get MCP endpoint, no setup at all
- More tool types: fetch by date, list all items, summarise topic
- More source types: YouTube, Google Drive, Notion, GitHub repos

---

## How to use this context document

Paste this entire document at the start of a new conversation with any AI model before asking questions about the project. The AI will have full context on:

- What the product is and does
- The full technical architecture
- Which phase you are currently in
- What is and is not in scope for v1
- The exact to-do list to work from

Then update the progress section below as you build.

---

## Current build progress

> Update this section as you go. Be specific — note what works, what is broken, what decisions you made and why.

### Status: NOT STARTED

---

### Phase 1 — Data pipeline
```
RSS fetcher             [ ] not started
URL type detector       [ ] not started
Single page scraper     [ ] not started
Multi-page crawler      [ ] not started
PDF extractor           [ ] not started
Text cleaner            [ ] not started
```

### Phase 2 — Processing pipeline
```
Chunker                 [ ] not started
Embedder                [ ] not started
Supabase setup          [ ] not started
Store chunks            [ ] not started
```

### Phase 3 — MCP server generation
```
Code generator          [ ] not started
esbuild bundler         [ ] not started
Cloudflare deploy       [ ] not started
```

### Phase 4 — API routes
```
POST /api/ingest        [ ] not started
POST /api/deploy        [ ] not started
GET  /api/status        [ ] not started
GET  /api/servers       [ ] not started
DELETE /api/servers     [ ] not started
```

### Phase 5 — UI
```
Screen 1: Create        [ ] not started
Screen 2: Result        [ ] not started
Screen 3: Dashboard     [ ] not started
Auth                    [ ] not started
```

### Phase 6 — Polish
```
Error handling          [ ] not started
Edge cases              [ ] not started
```

---

### Progress log

Use this section to note what you did each session:

```
[DATE] — [what you built or figured out]
[DATE] — [decisions made and why]
[DATE] — [blockers or problems encountered]
```

---

### Decisions log

Use this to record key technical decisions so you don't second-guess them later:

```
[DATE] — chose Supabase over ChromaDB because: free hosted tier, no local setup needed
[DATE] — chose Cloudflare Workers over Render because: no cold start problem
[DATE] — decided not to use Whisper in v1 because: keeps scope small, text sources are enough to validate
```

---

### Blockers

Note anything you are stuck on so you can ask about it specifically:

```
Currently blocked on: nothing yet
```

---

*Last updated: [DATE]*
*Current phase: not started*
*Next action: set up Next.js project and environment variables*