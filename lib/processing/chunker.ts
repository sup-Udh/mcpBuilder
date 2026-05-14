// lib/processing/chunker.ts

import { IngestedItem } from '../ingestion/types';
import { Chunk } from './types';

// ==========================================
// CONFIG
// ==========================================

const TARGET_WORDS = 220;

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

    .filter((block) => block.length > 0)

    // remove tiny garbage blocks
    .filter((block) => countWords(block) >= 5);
}

// ==========================================
// DETECT HEADINGS
// ==========================================

function isHeading(block: string): boolean {
  const trimmed = block.trim();

  return (
    trimmed.startsWith('#') ||

    (
      trimmed.length < 120 &&
      /^[A-Z0-9][A-Za-z0-9\s\-\:\(\)]+$/.test(trimmed) &&
      countWords(trimmed) <= 12
    )
  );
}

// ==========================================
// CLEAN CHUNK TEXT
// ==========================================

function cleanChunkText(text: string): string {
  return text

    // remove markdown images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')

    // remove raw urls
    .replace(/https?:\/\/\S+/g, '')

    // remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    // remove repeated separators
    .replace(/[-=_]{4,}/g, '')

    // collapse excessive newlines
    .replace(/\n{3,}/g, '\n\n')

    // collapse spaces
    .replace(/[ \t]+/g, ' ')

    // remove empty markdown headings
    .replace(/^#+\s*$/gm, '')

    // trim each line
    .split('\n')
    .map((line) => line.trim())

    // remove empty lines
    .filter(Boolean)

    .join('\n')

    .trim();
}

// ==========================================
// BUILD CHUNK TEXT
// ==========================================

function buildChunkText(
  document: IngestedItem,
  heading: string,
  chunkBlocks: string[]
): string {
  return cleanChunkText(
    [
      `Title: ${document.title}`,

      heading
        ? `Heading: ${heading}`
        : '',

      ...chunkBlocks,
    ].join('\n\n')
  );
}

// ==========================================
// MAIN CHUNKER
// ==========================================

export function chunkDocument(
  document: IngestedItem
): Chunk[] {
  console.log(`\nChunking document: ${document.title}`);

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

      continue;
    }

    // ======================================
    // CREATE CHUNK IF LIMIT REACHED
    // ======================================

    if (
      currentWordCount + blockWordCount >
        TARGET_WORDS &&
      currentChunk.length > 0
    ) {
      const chunkText = buildChunkText(
        document,
        currentHeading,
        currentChunk
      );

      const finalWordCount =
        countWords(chunkText);

      if (finalWordCount >= MIN_WORDS) {
        chunks.push({
          id: `${document.url}::chunk-${chunkIndex}`,

          text: chunkText,

          chunkIndex,

          wordCount: finalWordCount,

          sourceTitle: document.title,

          sourceUrl: document.url,

          sourceType:
            document.sourceType || 'webpage',

          heading: currentHeading,

          metadata:
            document.metadata || {},
        });

        console.log(
          `Created chunk ${chunkIndex} (${finalWordCount} words)`
        );

        chunkIndex++;
      }

      // ======================================
      // OVERLAP STRATEGY
      // KEEP LAST BLOCK
      // ======================================

      const overlapBlock =
        currentChunk[
          currentChunk.length - 1
        ];

      currentChunk = overlapBlock
        ? [overlapBlock]
        : [];

      currentWordCount = overlapBlock
        ? countWords(overlapBlock)
        : 0;
    }

    // ======================================
    // ADD BLOCK
    // ======================================

    currentChunk.push(block);

    currentWordCount += blockWordCount;
  }

  // ==========================================
  // FINAL CHUNK
  // ==========================================

  if (currentChunk.length > 0) {
    const chunkText = buildChunkText(
      document,
      currentHeading,
      currentChunk
    );

    const finalWordCount =
      countWords(chunkText);

    if (finalWordCount >= MIN_WORDS) {
      chunks.push({
        id: `${document.url}::chunk-${chunkIndex}`,

        text: chunkText,

        chunkIndex,

        wordCount: finalWordCount,

        sourceTitle: document.title,

        sourceUrl: document.url,

        sourceType:
          document.sourceType || 'webpage',

        heading: currentHeading,

        metadata:
          document.metadata || {},
      });

      console.log(
        `Created final chunk ${chunkIndex} (${finalWordCount} words)`
      );
    }
  }

  console.log(
    `Finished chunking ${document.title}`
  );

  console.log(
    `Created ${chunks.length} chunks`
  );

  return chunks;
}

// ==========================================
// MULTI-DOCUMENT CHUNKER
// ==========================================

export function chunkDocuments(
  documents: IngestedItem[]
): Chunk[] {
  console.log('\n====================================');
  console.log('STARTING CHUNKING');
  console.log('====================================');

  const allChunks: Chunk[] = [];

  for (const document of documents) {
    const chunks = chunkDocument(document);

    allChunks.push(...chunks);
  }

  console.log('\n====================================');
  console.log('CHUNKING COMPLETE');
  console.log('====================================');

  console.log(
    `Total chunks created: ${allChunks.length}`
  );

  return allChunks;
}