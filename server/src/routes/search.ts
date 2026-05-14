import { Router, Request, Response } from "express";
import { ragSearch } from "../services/rag.js";

export const searchRouter = Router();

searchRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { query, bookId } = req.body as { query: string; bookId: string };

    if (!query || !bookId) {
      res.status(400).json({ error: "query and bookId are required" });
      return;
    }

    const result = await ragSearch(query, bookId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
});
