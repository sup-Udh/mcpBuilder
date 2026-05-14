// lib/processing/chunker.ts

import { IngestedItem } from '../ingestion/types';
import { Chunk } from './types';

// ==========================================
// CONFIG
// ==========================================

const TARGET_WORDS = 300;
const MIN_WORDS = 80;

// ==========================================
// WORD COUNT
// ==========================================

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// ==========================================
// SPLIT INTO SEMANTIC BLOCKS
// ==========================================

function splitIntoBlocks(content: string): string[] {
  return content
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}

// ==========================================
// DETECT HEADINGS
// ==========================================

function isHeading(block: string): boolean {
  return (
    block.startsWith('#') ||
    block.length < 80 && /^[A-Z0-9\s\-\:]+$/.test(block)
  );
}

// ==========================================
// CLEAN CHUNK TEXT
// ==========================================

function cleanChunkText(text: string): string {
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

// ==========================================
// MAIN CHUNKER
// ==========================================

export function chunkDocument(document: IngestedItem): Chunk[] {
  console.log(`Chunking document: ${document.title}`);

  const blocks = splitIntoBlocks(document.content);

  console.log(`Found ${blocks.length} semantic blocks`);

  const chunks: Chunk[] = [];

  let currentChunk: string[] = [];
  let currentWordCount = 0;

  let currentHeading = '';

  let chunkIndex = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    const blockWordCount = countWords(block);

    // ======================================
    // TRACK HEADINGS
    // ======================================

    if (isHeading(block)) {
      currentHeading = block;
    }

    // ======================================
    // CREATE CHUNK IF LIMIT REACHED
    // ======================================

    if (
      currentWordCount + blockWordCount > TARGET_WORDS &&
      currentChunk.length > 0
    ) {
      const chunkText = cleanChunkText(
        [
          currentHeading,
          ...currentChunk,
        ].join('\n\n')
      );

      const finalWordCount = countWords(chunkText);

      if (finalWordCount >= MIN_WORDS) {
        chunks.push({
          id: `${document.url}::chunk-${chunkIndex}`,

          text: chunkText,

          chunkIndex,

          wordCount: finalWordCount,

          sourceTitle: document.title,

          sourceUrl: document.url,

          sourceType: document.sourceType || 'webpage',

          heading: currentHeading,

          metadata: document.metadata || {},
        });

        chunkIndex++;
      }

      // ======================================
      // OVERLAP STRATEGY
      // KEEP LAST BLOCK
      // ======================================

      const overlapBlock =
        currentChunk[currentChunk.length - 1];

      currentChunk = overlapBlock ? [overlapBlock] : [];

      currentWordCount = overlapBlock
        ? countWords(overlapBlock)
        : 0;
    }

    // ======================================
    // ADD BLOCK TO CHUNK
    // ======================================

    currentChunk.push(block);

    currentWordCount += blockWordCount;
  }

  // ==========================================
  // FINAL CHUNK
  // ==========================================

  if (currentChunk.length > 0) {
    const chunkText = cleanChunkText(
      [
        currentHeading,
        ...currentChunk,
      ].join('\n\n')
    );

    const finalWordCount = countWords(chunkText);

    if (finalWordCount >= MIN_WORDS) {
      chunks.push({
        id: `${document.url}::chunk-${chunkIndex}`,

        text: chunkText,

        chunkIndex,

        wordCount: finalWordCount,

        sourceTitle: document.title,

        sourceUrl: document.url,

        sourceType: document.sourceType || 'webpage',

        heading: currentHeading,

        metadata: document.metadata || {},
      });
    }
  }

  console.log(
    `Created ${chunks.length} chunks from ${document.title}`
  );

  return chunks;
}

// ==========================================
// MULTI-DOCUMENT CHUNKER
// ==========================================

export function chunkDocuments(
  documents: IngestedItem[]
): Chunk[] {
  const allChunks: Chunk[] = [];

  for (const document of documents) {
    const chunks = chunkDocument(document);

    allChunks.push(...chunks);
  }

  console.log(`Total chunks created: ${allChunks.length}`);

  return allChunks;
}