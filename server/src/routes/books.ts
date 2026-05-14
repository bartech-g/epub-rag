import { Router, Request, Response } from "express";
import { parseEpub, chunkChapters } from "../services/epub.js";
import { createEmbeddings } from "../services/embeddings.js";
import { addChunks } from "../services/vectorstore.js";
import path from "path";

export const booksRouter = Router();

booksRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { filename } = req.body as { filename: string };

    if (!filename) {
      res.status(400).json({ error: "filename is required" });
      return;
    }

    const filePath = path.join(process.cwd(), "data", "books", filename);
    const bookId = filename.replace(".epub", "");

    console.log("Parsing epub...");
    const chapters = await parseEpub(filePath);

    console.log(`Chunking ${chapters.length} chapters...`);
    const chunks = chunkChapters(chapters);

    console.log(`Creating embeddings for ${chunks.length} chunks...`);
    const texts = chunks.map((c) => c.content);
    const embeddings = await createEmbeddings(texts);

    console.log("Storing in vector db...");
    await addChunks(bookId, chunks, embeddings);

    res.json({
      success: true,
      bookId,
      chapters: chapters.length,
      chunks: chunks.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process book" });
  }
});
