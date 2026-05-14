import { Chunk } from "../processing/types"

export interface EmbeddingChunk extends Chunk {
    embedding: number[];

    embedingModel: string;

    embeddingDimensions: number;
}