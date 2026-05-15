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
  // CHAT STATE
  // ==========================================

  const [question, setQuestion] =
    useState('');

  const [chatLoading, setChatLoading] =
    useState(false);

  const [answer, setAnswer] =
    useState('');

  const [
    retrievedChunks,
    setRetrievedChunks,
  ] = useState<any[]>([]);

  const [llmChunks, setLlmChunks] =
    useState<any[]>([]);

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
        `Success! Processed ${data.documents.length} documents into ${data.chunks.length} chunks.`
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
  // ASK QUESTION
  // ==========================================

  const handleAskQuestion =
    async () => {
      if (!question) return;

      setChatLoading(true);

      setAnswer('');

      setRetrievedChunks([]);

      setLlmChunks([]);

      try {
        const response = await fetch(
          '/api/chat',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              question,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              'Chat failed'
          );
        }

        setAnswer(data.answer);

        setRetrievedChunks(
          data.retrievedChunks || []
        );

        setLlmChunks(
          data.llmChunks || []
        );
      } catch (error: any) {
        setAnswer(
          `Error: ${error.message}`
        );
      } finally {
        setChatLoading(false);
      }
    };

  // ==========================================
  // HELPERS
  // ==========================================

  const isChunkUsedByLLM = (
    chunk: any
  ) => {
    return llmChunks.some(
      (llmChunk) =>
        llmChunk.chunk_id ===
        chunk.chunk_id
    );
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

          <p className="text-gray-400 mt-2">
            Semantic ingestion +
            vector retrieval +
            RAG testing playground
          </p>
        </div>

        {/* ====================================== */}
        {/* INGESTION */}
        {/* ====================================== */}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Ingest Content
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold"
              >
                {loading
                  ? 'Processing...'
                  : 'Ingest'}
              </button>
            </div>

            {/* crawl toggle */}

            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
              <label className="flex gap-4 items-start">
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
                />

                <div>
                  <div className="font-medium">
                    Crawl linked pages
                  </div>

                  <div className="text-sm text-gray-400 mt-1">
                    Recommended for
                    docs sites and
                    tutorials.
                  </div>
                </div>
              </label>
            </div>
          </form>

          {/* status */}

          {status && (
            <div className="mt-6 p-4 rounded-lg border bg-gray-800 border-gray-700">
              {status}
            </div>
          )}
        </div>

        {/* ====================================== */}
        {/* ASK QUESTIONS */}
        {/* ====================================== */}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Ask Questions
          </h2>

          <div className="flex gap-4">
            <input
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              placeholder="Ask a question about the ingested content..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
            />

            <button
              onClick={
                handleAskQuestion
              }
              disabled={chatLoading}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-semibold"
            >
              {chatLoading
                ? 'Thinking...'
                : 'Ask'}
            </button>
          </div>

          {/* answer */}

          {answer && (
            <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-lg mb-3 text-blue-300">
                Answer
              </h3>

              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {answer}
              </p>
            </div>
          )}
        </div>

        {/* ====================================== */}
        {/* RETRIEVED CHUNKS */}
        {/* ====================================== */}

        {retrievedChunks.length >
          0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Retrieved Chunks (
              {
                retrievedChunks.length
              }
              )
            </h2>

            <div className="space-y-5">
              {retrievedChunks.map(
                (
                  chunk,
                  index
                ) => {
                  const usedByLLM =
                    isChunkUsedByLLM(
                      chunk
                    );

                  return (
                    <div
                      key={index}
                      className={`border rounded-xl p-5 ${
                        usedByLLM
                          ? 'border-emerald-500 bg-emerald-950/10'
                          : 'border-gray-700 bg-gray-800'
                      }`}
                    >
                      {/* top row */}

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full">
                          Similarity{' '}
                          {chunk.similarity?.toFixed(
                            4
                          )}
                        </span>

                        {usedByLLM && (
                          <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full">
                            Used by GPT
                          </span>
                        )}

                        <span className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full">
                          Chunk #
                          {
                            chunk.chunk_index
                          }
                        </span>
                      </div>

                      {/* title */}

                      <h3 className="text-lg font-semibold text-blue-300">
                        {
                          chunk.source_title
                        }
                      </h3>

                      {/* heading */}

                      <div className="text-sm text-indigo-300 mt-1 mb-4">
                        {
                          chunk.heading
                        }
                      </div>

                      {/* content */}

                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {chunk.content}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}