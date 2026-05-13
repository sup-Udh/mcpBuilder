import { IngestedItem } from '../ingestion/types';

export interface TextChunk {
  text: string;
  metadata: {
    sourceTitle: string;
    sourceUrl: string;
    date?: string;
    chunkIndex: number;
    [key: string]: any;
  };
}

/**
 * Splits an IngestedItem's text content into overlapping chunks of a specified word size.
 */
export function chunkText(item: IngestedItem, chunkSizeWords = 400, overlapWords = 50): TextChunk[] {
  // If no content, return empty array
  if (!item.content || item.content.trim() === '') {
    return [];
  }

  // Clean the text slightly and split by whitespace to get words
  const cleanText = item.content.replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ');
  
  // Handle texts shorter than or equal to 400 words as a single chunk without breaking
  if (words.length <= chunkSizeWords) {
    return [{
      text: cleanText,
      metadata: {
        sourceTitle: item.title,
        sourceUrl: item.url,
        date: item.date,
        chunkIndex: 0,
        ...item.metadata
      }
    }];
  }

  const chunks: TextChunk[] = [];
  let currentIndex = 0;
  let chunkIndex = 0;

  while (currentIndex < words.length) {
    // Get the slice of words for this chunk
    const endIndex = Math.min(currentIndex + chunkSizeWords, words.length);
    const chunkWords = words.slice(currentIndex, endIndex);
    
    chunks.push({
      text: chunkWords.join(' '),
      metadata: {
        sourceTitle: item.title,
        sourceUrl: item.url,
        date: item.date,
        chunkIndex,
        ...item.metadata
      }
    });

    // Move the index forward by chunkSize minus the overlap
    currentIndex += (chunkSizeWords - overlapWords);
    chunkIndex++;

    // Safety fallback to prevent infinite loops if overlap is configured incorrectly
    if (chunkSizeWords <= overlapWords) {
      break;
    }
  }

  return chunks;
}

/**
 * Process an array of ingested items into a flat array of all their chunks
 */
export function chunkItems(items: IngestedItem[], chunkSizeWords = 400, overlapWords = 50): TextChunk[] {
  return items.flatMap(item => chunkText(item, chunkSizeWords, overlapWords));
}
