export interface Chunk {
  id: string;

  // ==========================================
  // MULTI TENANT
  // ==========================================

  serverId: string;

  // ==========================================
  // CHUNK DATA
  // ==========================================

  text: string;

  chunkIndex: number;

  wordCount: number;

  // ==========================================
  // SOURCE INFO
  // ==========================================

  sourceTitle: string;

  sourceUrl: string;

  sourceType:
    | 'rss'
    | 'webpage'
    | 'docs'
    | 'pdf';

  // ==========================================
  // OPTIONAL
  // ==========================================

  heading?: string;

  metadata?: Record<string, any>;
}