'use client';

import { useState } from 'react';

export default function Home() {
  // ==========================================
  // INGESTION STATE
  // ==========================================

  const [url, setUrl] =
    useState('');

  const [status, setStatus] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [results, setResults] =
    useState<any[] | null>(null);

  const [chunks, setChunks] =
    useState<any[] | null>(null);

  const [
    crawlSubpages,
    setCrawlSubpages,
  ] = useState(false);

  // ==========================================
  // INGEST SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!url) return;

    setLoading(true);

    setStatus(
      'Fetching and processing...'
    );

    setResults(null);

    setChunks(null);

    try {
      const response = await fetch(
        '/api/ingest',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            url,
            crawlSubpages,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Ingestion failed'
        );
      }

      setStatus(
        `Successfully processed ${data.documents.length} documents into ${data.chunks.length} semantic chunks.`
      );

      setResults(data.documents);

      setChunks(data.chunks);
    } catch (error: any) {
      setStatus(
        `Error: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            MCP Builder
          </h1>

          <p className="text-gray-400 mt-2 max-w-3xl leading-relaxed">
            Turn websites, documentation,
            RSS feeds, and PDFs into
            semantic knowledge bases for
            AI agents and MCP servers.
          </p>
        </div>

        {/* ====================================== */}
        {/* INGESTION PANEL */}
        {/* ====================================== */}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Ingest Content
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* URL INPUT */}

            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) =>
                  setUrl(
                    e.target.value
                  )
                }
                placeholder="https://example.com/article"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all"
              >
                {loading
                  ? 'Processing...'
                  : 'Ingest'}
              </button>
            </div>

            {/* CRAWL TOGGLE */}

            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
              <label className="flex gap-4 items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    crawlSubpages
                  }
                  onChange={(e) =>
                    setCrawlSubpages(
                      e.target.checked
                    )
                  }
                  className="mt-1"
                />

                <div>
                  <div className="font-medium text-gray-200">
                    Crawl linked pages
                  </div>

                  <div className="text-sm text-gray-400 mt-1 leading-relaxed">
                    Disabled by default
                    for precise semantic
                    retrieval. Enable this
                    for documentation
                    websites, tutorials,
                    and multi-page
                    knowledge bases.
                  </div>
                </div>
              </label>
            </div>
          </form>

          {/* STATUS */}

          {status && (
            <div className="mt-6 p-4 rounded-lg border bg-gray-800 border-gray-700 text-gray-300">
              {status}
            </div>
          )}
        </div>

        {/* ====================================== */}
        {/* INGESTED DOCUMENTS */}
        {/* ====================================== */}

        {results &&
          results.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Ingested Documents (
                {results.length})
              </h2>

              <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2">
                {results.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-5"
                    >
                      <h3 className="text-lg font-semibold text-blue-300">
                        {item.title}
                      </h3>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors break-all"
                      >
                        {item.url}
                      </a>

                      <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {item.content.slice(
                            0,
                            1000
                          )}
                          ...
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* ====================================== */}
        {/* GENERATED CHUNKS */}
        {/* ====================================== */}

        {chunks &&
          chunks.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Semantic Chunks (
                {chunks.length})
              </h2>

              <div className="space-y-5 max-h-[900px] overflow-y-auto pr-2">
                {chunks.map(
                  (chunk, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-5"
                    >
                      {/* HEADER */}

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full">
                          Chunk #
                          {
                            chunk.chunkIndex
                          }
                        </span>

                        <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full">
                          {
                            chunk.wordCount
                          }{' '}
                          words
                        </span>

                        <span className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full">
                          {
                            chunk.sourceType
                          }
                        </span>
                      </div>

                      {/* TITLE */}

                      <h3 className="text-lg font-semibold text-blue-300">
                        {
                          chunk.sourceTitle
                        }
                      </h3>

                      {/* HEADING */}

                      <div className="text-sm text-indigo-300 mt-1 mb-4">
                        {chunk.heading}
                      </div>

                      {/* CONTENT */}

                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {chunk.text}
                        </p>
                      </div>

                      {/* FOOTER */}

                      <div className="mt-4 text-xs text-gray-500 break-all">
                        {
                          chunk.sourceUrl
                        }
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </div>
    </main>
  );
}