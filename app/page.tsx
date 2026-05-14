'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  // chunk loader
  const [chunks, setChunks] = useState<any[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setStatus('Fetching and processing...');
    setResults(null);

    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ingestion failed');
      }

      setStatus(`Success! Processed ${data.items.length} items.`);
      setResults(data.items);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          MCP Builder
        </h1>
        <p className="text-gray-400 mb-8">
          Enter an RSS feed or Website URL to ingest its content.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-100"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            {loading ? 'Processing...' : 'Ingest Data'}
          </button>
        </form>

        {status && (
          <div className={`p-4 rounded-lg mb-6 border ${status.startsWith('Error') ? 'bg-red-950/30 border-red-900/50 text-red-300' : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'}`}>
            {status}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-8 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Ingested Items ({results.length})</h2>
            {results.map((item, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 hover:bg-gray-800 transition-colors">
                <h3 className="font-medium text-blue-400 mb-1">{item.title}</h3>
                <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors mb-3 block truncate">
                  {item.url}
                </a>
                <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
                  {item.content}
                </p>
                {item.date && (
                  <div className="mt-3 text-xs text-gray-500">
                    Published: {new Date(item.date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
