export interface Chunk {
    id:string;
    text: string;
    chunkIndex: number;
    wordCount: number;

    sourceTitle: string;
    sourceUrl: string;

    sourceType: 'rss' | 'webpage' | 'docs' | 'pdf';

    heading?:string;
    metadata?: Record<string, any>;

}
