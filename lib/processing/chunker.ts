// lib/processing/chunker.ts

import crypto from "crypto";

import { IngestedItem } from "../ingestion/types";

import { Chunk } from "./types";

// ==========================================
// CONFIG
// ==========================================

// larger chunks = better semantic context
const TARGET_WORDS = 220;

const MIN_WORDS = 50;

const MAX_BLOCK_WORDS = 450;

const CHUNK_OVERLAP_WORDS = 35;

// ==========================================
// WORD COUNT
// ==========================================

function countWords(
  text: string
): number {

  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// ==========================================
// TOKEN ESTIMATE
// ==========================================

function estimateTokens(
  text: string
): number {

  return Math.ceil(
    text.length / 4
  );
}

// ==========================================
// NORMALIZE TEXT
// ==========================================

function normalizeText(
  text: string
): string {

  return text

    // invisible unicode
    .replace(
      /[\u200B-\u200D\uFEFF]/g,
      ""
    )

    // repeated spaces
    .replace(
      /[ \t]+/g,
      " "
    )

    // huge newlines
    .replace(
      /\n{3,}/g,
      "\n\n"
    )

    .trim();
}

// ==========================================
// SENTENCE SPLITTER
// ==========================================

function splitSentences(
  text: string
): string[] {

  return text

    .split(
      /(?<=[.!?])\s+(?=[A-Z])/g
    )

    .map((s) =>
      s.trim()
    )

    .filter(Boolean);
}

// ==========================================
// HARD SPLIT LARGE BLOCKS
// ==========================================

function splitLargeBlock(
  block: string
): string[] {

  const sentences =
    splitSentences(block);

  const chunks: string[] =
    [];

  let currentChunk = "";

  let currentWords = 0;

  for (const sentence of sentences) {

    const sentenceWords =
      countWords(sentence);

    if (
      currentWords +
        sentenceWords >
        MAX_BLOCK_WORDS &&
      currentChunk.length > 0
    ) {

      chunks.push(
        currentChunk.trim()
      );

      currentChunk =
        sentence;

      currentWords =
        sentenceWords;

    } else {

      currentChunk +=
        " " + sentence;

      currentWords +=
        sentenceWords;
    }
  }

  if (
    currentChunk.trim()
      .length > 0
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

  const rawBlocks =
    content

      .split(/\n\s*\n/g)

      .map((block) =>
        normalizeText(block)
      )

      .filter(
        (block) =>
          block.length > 0
      )

      // remove tiny junk
      .filter(
        (block) =>
          countWords(block) >= 3
      );

  const finalBlocks:
    string[] = [];

  for (const block of rawBlocks) {

    const wordCount =
      countWords(block);

    if (
      wordCount >
      MAX_BLOCK_WORDS
    ) {

      console.log(
        `Large block detected (${wordCount} words). Splitting...`
      );

      const splitBlocks =
        splitLargeBlock(
          block
        );

      finalBlocks.push(
        ...splitBlocks
      );

    } else {

      finalBlocks.push(
        block
      );
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

    .replace(
      /^#+\s*/,
      ""
    )

    .replace(
      /[ \t]+/g,
      " "
    )

    .trim();
}

// ==========================================
// HEADING DETECTOR
// ==========================================

function isHeading(
  block: string
): boolean {

  const trimmed =
    block.trim();

  return (

    // markdown headings
    trimmed.startsWith("#") ||

    // docs headings
    (
      trimmed.length <
        120 &&
      /^[A-Z0-9][A-Za-z0-9\s\-\:\(\)\.]+$/.test(
        trimmed
      ) &&
      countWords(
        trimmed
      ) <= 12
    )
  );
}

// ==========================================
// CLEAN CHUNK TEXT
// ==========================================

function cleanChunkText(
  text: string
): string {

  return normalizeText(

    text

      // markdown images
      .replace(
        /!\[[^\]]*\]\([^)]+\)/g,
        ""
      )

      // raw urls
      .replace(
        /https?:\/\/\S+/g,
        ""
      )

      // markdown links -> keep text
      .replace(
        /\[([^\]]+)\]\([^)]+\)/g,
        "$1"
      )

      // separators
      .replace(
        /[-=_]{4,}/g,
        ""
      )

      // empty headings
      .replace(
        /^#+\s*$/gm,
        ""
      )
  );
}

// ==========================================
// OVERLAP BUILDER
// ==========================================

function getOverlapText(
  blocks: string[]
): string[] {

  if (
    blocks.length === 0
  ) {
    return [];
  }

  const combined =
    blocks.join(" ");

  const words =
    combined.split(/\s+/);

  return words.slice(
    -CHUNK_OVERLAP_WORDS
  );
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
      `Document Title: ${document.title}`,

      `Section: ${
        heading ||
        document.title
      }`,

      `Source URL: ${document.url}`,

      "",

      ...chunkBlocks,
    ].join("\n\n")
  );
}

// ==========================================
// CHUNK ID
// ==========================================

function createChunkId(
  serverId: string,
  url: string,
  chunkIndex: number
): string {

  const base =
    `${serverId}-${url}-${chunkIndex}`;

  return crypto
    .createHash("md5")
    .update(base)
    .digest("hex");
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

  // ======================================
  // VALIDATE SERVER ID
  // ======================================

  if (
    !document.serverId
  ) {

    throw new Error(
      `Missing serverId on document: ${document.title}`
    );
  }

  const blocks =
    splitIntoBlocks(
      document.content
    );

  console.log(
    `Found ${blocks.length} semantic blocks`
  );

  const chunks: Chunk[] =
    [];

  let currentChunk:
    string[] = [];

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
      countWords(
        chunkText
      );

    const estimatedTokens =
      estimateTokens(
        chunkText
      );

    if (
      finalWordCount >=
      MIN_WORDS
    ) {

      const chunkId =
        createChunkId(
          document.serverId!,
          document.url,
          chunkIndex
        );

      const chunk: Chunk = {

        id: chunkId,

        serverId:
          document.serverId!,

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
          "webpage",

        heading:
          currentHeading ||
          document.title,

        metadata: {

          ...(document.metadata ||
            {}),

          estimatedTokens,

          chunkStrategy:
            "semantic",

          chunkedAt:
            new Date().toISOString(),
        },
      };

      chunks.push(
        chunk
      );

      console.log(
        `Created chunk ${chunkIndex} (${finalWordCount} words | ${estimatedTokens} est tokens)`
      );

      chunkIndex++;
    }

    // ======================================
    // OVERLAP PRESERVATION
    // ======================================

    const overlapWords =
      getOverlapText(
        currentChunk
      );

    currentChunk =
      overlapWords.length > 0
        ? [
            overlapWords.join(
              " "
            ),
          ]
        : [];

    currentWordCount =
      countWords(
        overlapWords.join(
          " "
        )
      );
  }

  // ======================================
  // MAIN LOOP
  // ======================================

  for (
    let i = 0;
    i < blocks.length;
    i++
  ) {

    const block =
      blocks[i];

    const blockWordCount =
      countWords(block);

    // ======================================
    // HEADING DETECTION
    // ======================================

    if (
      isHeading(block)
    ) {

      const newHeading =
        cleanHeading(block);

      console.log(
        `Detected heading: ${newHeading}`
      );

      flushChunk();

      currentHeading =
        newHeading;

      continue;
    }

    // ======================================
    // TARGET SIZE REACHED
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

    currentChunk.push(
      block
    );

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
// MULTI DOC CHUNKER
// ==========================================

export function chunkDocuments(
  documents: IngestedItem[]
): Chunk[] {

  console.log(
    "\n===================================="
  );

  console.log(
    "STARTING CHUNKING"
  );

  console.log(
    "===================================="
  );

  const allChunks:
    Chunk[] = [];

  for (const document of documents) {

    try {

      const chunks =
        chunkDocument(
          document
        );

      allChunks.push(
        ...chunks
      );

    } catch (error) {

      console.error(
        `Chunking failed for document: ${document.title}`,
        error
      );
    }
  }

  console.log(
    "\n===================================="
  );

  console.log(
    "CHUNKING COMPLETE"
  );

  console.log(
    "===================================="
  );

  console.log(
    `Total chunks created: ${allChunks.length}`
  );

  return allChunks;
}