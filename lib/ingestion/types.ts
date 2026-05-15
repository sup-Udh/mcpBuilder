// main datamodel for all ingestion models

export interface IngestedItem {
  id?: string;

  // ==========================================
  // MULTI TENANT
  // ==========================================

  serverId: string;

  // ==========================================
  // CONTENT
  // ==========================================

  title: string;

  url: string;

  content: string;

  date?: string;

  // ==========================================
  // METADATA
  // ==========================================

  metadata?: Record<string, any>;

  sourceType?: 'rss' | 'webpage' | 'docs' | 'pdf';

  crawlsubpages?: boolean;
}