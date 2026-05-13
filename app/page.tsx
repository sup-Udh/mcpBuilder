'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [chunks, setChunks] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'chunks'>('items');
  const [loadingItemUrl, setLoadingItemUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setStatus('Fetching, processing, and chunking...');
    setResults(null);
    setChunks(null);

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

      setStatus(data.message);
      setResults(data.items);
      setChunks(data.chunks);
      setActiveTab('items'); // Default to items so they can click chunk on specific ones
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChunkArticle = async (itemUrl: string) => {
    setLoadingItemUrl(itemUrl);
    setStatus(`Scraping full article from ${itemUrl}...`);
    
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Don't crawl subpages for a specific news article
        body: JSON.stringify({ url: itemUrl, crawlSubpages: false }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scraping failed');
      }

      // Add the new chunks to the top of the chunks list
      setChunks(prev => {
        const newChunks = data.chunks || [];
        return prev ? [...newChunks, ...prev] : newChunks;
      });
      
      setStatus(`Successfully scraped full article! Added ${data.chunks.length} new detailed chunks.`);
      setActiveTab('chunks'); // Automatically switch to chunks tab to show the new deep chunks
    } catch (error: any) {
      setStatus(`Error scraping article: ${error.message}`);
    } finally {
      setLoadingItemUrl(null);
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

        {results && results.length > 0 && chunks && (
          <div className="mt-8">
            <div className="flex gap-4 border-b border-gray-800 mb-6 pb-2">
              <button 
                onClick={() => setActiveTab('items')}
                className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'items' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Raw Items ({results.length})
              </button>
              <button 
                onClick={() => setActiveTab('chunks')}
                className={`pb-2 px-2 font-medium transition-colors ${activeTab === 'chunks' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Generated Chunks ({chunks.length})
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'items' && results.map((item, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-400 mb-1">{item.title}</h3>
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors mb-3 block truncate">
                        {item.url}
                      </a>
                    </div>
                    <button
                      onClick={() => handleChunkArticle(item.url)}
                      disabled={loadingItemUrl === item.url}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-xs text-white font-semibold py-2 px-4 rounded transition-colors"
                    >
                      {loadingItemUrl === item.url ? 'Scraping...' : 'Scrape & Chunk Full Article'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed mt-2">
                    {item.content}
                  </p>
                  {item.date && (
                    <div className="mt-3 text-xs text-gray-500">
                      Published: {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}

              {activeTab === 'chunks' && chunks.map((chunk, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-5 hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                      Chunk #{chunk.metadata.chunkIndex}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[200px]" title={chunk.metadata.sourceTitle}>
                      {chunk.metadata.sourceTitle}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed font-serif bg-gray-900 p-3 rounded border border-gray-800">
                    "{chunk.text}"
                  </p>
                  <div className="mt-3 flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>Words: {chunk.text.split(' ').length}</span>
                    <a href={chunk.metadata.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-gray-300 truncate ml-4">
                      {chunk.metadata.sourceUrl}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

