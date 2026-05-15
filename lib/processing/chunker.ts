// lib/processing/chunker.ts

import { IngestedItem } from '../ingestion/types';
import { Chunk } from './types';

// ==========================================
// CONFIG
// ==========================================

// smaller chunks = better retrieval precision
const TARGET_WORDS = 120;

const MIN_WORDS = 40;

// fallback split threshold
const MAX_BLOCK_WORDS = 300;

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
// HARD SPLIT LARGE BLOCKS
// ==========================================

function splitLargeBlock(
  block: string
): string[] {
  const sentences = block.split(
    /(?<=[.!?])\s+/
  );

  const chunks: string[] = [];

  let currentChunk = '';

  let currentWords = 0;

  for (const sentence of sentences) {
    const sentenceWords =
      countWords(sentence);

    if (
      currentWords + sentenceWords >
        MAX_BLOCK_WORDS &&
      currentChunk.length > 0
    ) {
      chunks.push(
        currentChunk.trim()
      );

      currentChunk = sentence;

      currentWords =
        sentenceWords;
    } else {
      currentChunk +=
        ' ' + sentence;

      currentWords +=
        sentenceWords;
    }
  }

  if (
    currentChunk.trim().length >
    0
  ) {
    chunks.push(
      currentChunk.trim()
    );
  }

  return chunks;
}

// ==========================================
// SPLIT INTO SEMANTIC BLOCKS
// ==========================================

function splitIntoBlocks(
  content: string
): string[] {
  const rawBlocks = content
    .split(/\n\s*\n/g)

    .map((block) =>
      block.trim()
    )

    .filter(
      (block) => block.length > 0
    )

    // remove tiny garbage blocks
    .filter(
      (block) =>
        countWords(block) >= 3
    );

  const finalBlocks: string[] =
    [];

  // ======================================
  // FALLBACK SPLITTING
  // ======================================

  for (const block of rawBlocks) {
    const wordCount =
      countWords(block);

    // oversized block
    if (
      wordCount >
      MAX_BLOCK_WORDS
    ) {
      console.log(
        `Large block detected (${wordCount} words). Applying fallback split...`
      );

      const splitBlocks =
        splitLargeBlock(block);

      finalBlocks.push(
        ...splitBlocks
      );
    } else {
      finalBlocks.push(block);
    }
  }

  const largestBlock =
    Math.max(
      ...finalBlocks.map(
        countWords
      )
    );

  console.log(
    `Largest block word count: ${largestBlock}`
  );

  return finalBlocks;
}

// ==========================================
// CLEAN HEADING
// ==========================================

function cleanHeading(
  text: string
): string {
  return text

    // remove markdown heading syntax
    .replace(/^#+\s*/, '')

    // collapse spaces
    .replace(/[ \t]+/g, ' ')

    .trim();
}

// ==========================================
// DETECT HEADINGS
// ==========================================

function isHeading(
  block: string
): boolean {
  const trimmed =
    block.trim();

  return (
    // markdown headings
    trimmed.startsWith('#') ||

    // docs/wiki headings
    (
      trimmed.length < 120 &&
      /^[A-Z0-9][A-Za-z0-9\s\-\:\(\)\.]+$/.test(
        trimmed
      ) &&
      countWords(trimmed) <= 12
    )
  );
}

// ==========================================
// CLEAN CHUNK TEXT
// ==========================================

function cleanChunkText(
  text: string
): string {
  return text

    // remove markdown images
    .replace(
      /!\[[^\]]*\]\([^)]+\)/g,
      ''
    )

    // remove raw urls
    .replace(
      /https?:\/\/\S+/g,
      ''
    )

    // markdown links → keep text
    .replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      '$1'
    )

    // repeated separators
    .replace(
      /[-=_]{4,}/g,
      ''
    )

    // excessive newlines
    .replace(
      /\n{3,}/g,
      '\n\n'
    )

    // collapse spaces
    .replace(
      /[ \t]+/g,
      ' '
    )

    // remove empty markdown headings
    .replace(
      /^#+\s*$/gm,
      ''
    )

    // trim lines
    .split('\n')
    .map((line) =>
      line.trim()
    )

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

      `Heading: ${
        heading ||
        document.title
      }`,

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
  console.log(
    `\nChunking document: ${document.title}`
  );

  const blocks =
    splitIntoBlocks(
      document.content
    );

  console.log(
    `Found ${blocks.length} semantic blocks`
  );

  const chunks: Chunk[] = [];

  let currentChunk: string[] =
    [];

  let currentWordCount = 0;

  let currentHeading =
    document.title;

  let chunkIndex = 0;

  // ======================================
  // FLUSH CHUNK
  // ======================================

  function flushChunk() {
    if (
      currentChunk.length === 0
    ) {
      return;
    }

    const chunkText =
      buildChunkText(
        document,
        currentHeading,
        currentChunk
      );

    const finalWordCount =
      countWords(chunkText);

    if (
      finalWordCount >=
      MIN_WORDS
    ) {
      chunks.push({
        id: `${document.url}::chunk-${chunkIndex}`,

        text: chunkText,

        chunkIndex,

        wordCount:
          finalWordCount,

        sourceTitle:
          document.title,

        sourceUrl:
          document.url,

        sourceType:
          document.sourceType ||
          'webpage',

        heading:
          currentHeading ||
          document.title,

        metadata:
          document.metadata ||
          {},
      });

      console.log(
        `Created chunk ${chunkIndex} (${finalWordCount} words)`
      );

      chunkIndex++;
    }

    currentChunk = [];

    currentWordCount = 0;
  }

  // ======================================
  // MAIN LOOP
  // ======================================

  for (
    let i = 0;
    i < blocks.length;
    i++
  ) {
    const block = blocks[i];

    const blockWordCount =
      countWords(block);

    // ======================================
    // HEADING DETECTION
    // ======================================

    if (isHeading(block)) {
      const newHeading =
        cleanHeading(block);

      console.log(
        `Detected heading: ${newHeading}`
      );

      // flush previous section
      flushChunk();

      currentHeading =
        newHeading;

      continue;
    }

    // ======================================
    // SIZE LIMIT SPLIT
    // ======================================

    if (
      currentWordCount +
        blockWordCount >
        TARGET_WORDS &&
      currentChunk.length > 0
    ) {
      flushChunk();
    }

    // ======================================
    // ADD BLOCK
    // ======================================

    currentChunk.push(block);

    currentWordCount +=
      blockWordCount;
  }

  // ======================================
  // FINAL FLUSH
  // ======================================

  flushChunk();

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
  console.log(
    '\n===================================='
  );

  console.log(
    'STARTING CHUNKING'
  );

  console.log(
    '===================================='
  );

  const allChunks: Chunk[] =
    [];

  for (const document of documents) {
    const chunks =
      chunkDocument(document);

    allChunks.push(
      ...chunks
    );
  }

  console.log(
    '\n===================================='
  );

  console.log(
    'CHUNKING COMPLETE'
  );

  console.log(
    '===================================='
  );

  console.log(
    `Total chunks created: ${allChunks.length}`
  );

  return allChunks;
}