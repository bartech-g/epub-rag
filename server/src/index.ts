import "dotenv/config";
import express from "express";
import { booksRouter } from "./routes/books.js";
import { searchRouter } from "./routes/search.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/books", booksRouter);
app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
