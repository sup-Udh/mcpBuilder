export interface IngestedItem {
  id?: string;
  title: string;
  url: string;
  content: string; // The full text content
  date?: string;
  metadata?: Record<string, any>;
}
