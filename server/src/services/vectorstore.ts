import { LocalIndex } from "vectra";
import path from "path";
import { Chunk } from "./epub.js";

function getIndex(bookId: string): LocalIndex {
  const indexPath = path.join(process.cwd(), "data", "indexes", bookId);
  return new LocalIndex(indexPath);
}

export async function addChunks(
  bookId: string,
  chunks: Chunk[],
  embeddings: number[][],
): Promise<void> {
  const index = getIndex(bookId);

  if (!(await index.isIndexCreated())) {
    await index.createIndex();
  }

  for (let i = 0; i < chunks.length; i++) {
    await index.insertItem({
      vector: embeddings[i],
      metadata: {
        chapterId: chunks[i].chapterId,
        chapterTitle: chunks[i].chapterTitle,
        content: chunks[i].content,
        index: chunks[i].index,
      },
    });
  }
}

export async function searchSimilar(
  bookId: string,
  queryEmbedding: number[],
  nResults = 5,
): Promise<{ documents: string[]; metadatas: object[] }> {
  const index = getIndex(bookId);
  const results = await index.queryItems(queryEmbedding, "", nResults);

  return {
    documents: results.map((r) => r.item.metadata.content as string),
    metadatas: results.map((r) => r.item.metadata),
  };
}
