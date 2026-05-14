import OpenAI from "openai";
import { createEmbedding } from "./embeddings.js";
import { searchSimilar } from "./vectorstore.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RagResult {
  answer: string;
  sources: {
    chapterTitle: string;
    content: string;
  }[];
}

export async function ragSearch(
  query: string,
  bookId: string,
): Promise<RagResult> {
  const queryEmbedding = await createEmbedding(query);

  const { documents, metadatas } = await searchSimilar(bookId, queryEmbedding);

  const context = documents
    .map((doc, i) => {
      const meta = metadatas[i] as { chapterTitle: string };
      return `[${meta.chapterTitle}]\n${doc}`;
    })
    .join("\n\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that answers questions based on book content. 
Always base your answers on the provided context. 
If the answer is not in the context, say so clearly.`,
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${query}`,
      },
    ],
  });

  return {
    answer: response.choices[0].message.content ?? "",
    sources: documents.map((doc, i) => ({
      chapterTitle: (metadatas[i] as { chapterTitle: string }).chapterTitle,
      content: doc.slice(0, 200) + "...",
    })),
  };
}
