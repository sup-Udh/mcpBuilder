// MAIN FUNCTIONN:

// text
// ↓
// vector

import { pipeline } from "@xenova/transformers";



let extractor: any = null;


export async function loadBGEModel() {
  if (!extractor) {
    console.log('Loading BGE embedding model...');

    extractor = await pipeline(
      'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
);

    console.log('BGE model loaded');
  }

  return extractor;
}

// Single text embedding method 
export async function embedText(
  text: string
): Promise<number[]> {
  const model = await loadBGEModel();

  const output = await model(text, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data);
}