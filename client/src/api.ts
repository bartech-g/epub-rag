import type { SearchResult } from "./types";

export async function searchBook(
  query: string,
  bookId: string,
): Promise<SearchResult> {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, bookId }),
  });

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}

export async function processBook(filename: string): Promise<void> {
  const response = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });

  if (!response.ok) {
    throw new Error("Failed to process book");
  }
}
