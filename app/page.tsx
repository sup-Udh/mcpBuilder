'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  // The main items returned from the initial ingestion (e.g. RSS summaries)
  const [items, setItems] = useState<any[] | null>(null);
  
  // State to store the deep-scraped details and chunks for each specific item URL
  const [detailedItems, setDetailedItems] = useState<Record<string, { rawData: string, chunks: any[] }>>({});
  
  const [loadingItemUrl, setLoadingItemUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setStatus('Fetching and processing...');
    setItems(null);
    setDetailedItems({});

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

      setStatus(`Successfully ingested ${data.items.length} items.`);
      setItems(data.items);
      
      // If it's a single webpage scrape, pre-populate its detailed view
      if (data.items.length === 1 && data.chunks && data.chunks.length > 0) {
        setDetailedItems({
          [data.items[0].url]: {
            rawData: data.items[0].content,
            chunks: data.chunks
          }
        });
      }

    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeArticle = async (itemUrl: string) => {
    setLoadingItemUrl(itemUrl);
    
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

      // Store the full scraped text and its chunks exactly where the user clicked
      setDetailedItems(prev => ({
        ...prev,
        [itemUrl]: {
          rawData: data.items[0]?.content || 'No text found.',
          chunks: data.chunks || []
        }
      }));
      
    } catch (error: any) {
      alert(`Error scraping article: ${error.message}`);
    } finally {
      setLoadingItemUrl(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-12 px-6">
      <div className="max-w-4xl w-full bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
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

        {items && items.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Ingested Items ({items.length})</h2>
            
            {items.map((item, i) => {
              const details = detailedItems[item.url];
              const isScraping = loadingItemUrl === item.url;
              
              return (
                <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-400 mb-1">{item.title}</h3>
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors mb-3 block truncate">
                        {item.url}
                      </a>
                    </div>
                    
                    {/* Only show the Scrape button if there's a URL and it hasn't been scraped yet */}
                    {item.url && !details && (
                      <button
                        onClick={() => handleScrapeArticle(item.url)}
                        disabled={isScraping}
                        className="shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-xs text-white font-semibold py-2 px-4 rounded transition-colors"
                      >
                        {isScraping ? 'Scraping...' : 'Scrape Full Article'}
                      </button>
                    )}
                  </div>
                  
                  {/* The RSS Summary */}
                  <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed mt-2 italic border-l-2 border-gray-600 pl-3">
                    {item.content}
                  </p>
                  
                  {item.date && (
                    <div className="mt-3 text-xs text-gray-500">
                      Published: {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Expandable Section for Full Article and Chunks */}
                  {details && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          Full Scraped Article
                        </h4>
                        <div className="bg-gray-950 border border-gray-800 rounded p-4 text-sm text-gray-300 max-h-48 overflow-y-auto custom-scrollbar">
                          {details.rawData}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                          Generated Chunks ({details.chunks.length})
                        </h4>
                        <div className="grid gap-3">
                          {details.chunks.map((chunk, idx) => (
                            <div key={idx} className="bg-gray-900 border border-gray-800 p-4 rounded text-sm text-gray-300 relative group">
                              <span className="absolute top-0 right-0 bg-purple-900/50 text-purple-300 text-[10px] px-2 py-1 rounded-bl rounded-tr font-mono">
                                Chunk #{idx}
                              </span>
                              <p className="pr-16 leading-relaxed font-serif">"{chunk.text}"</p>
                              <div className="mt-2 text-[10px] text-gray-500 font-mono">
                                Words: {chunk.text.split(' ').length}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
