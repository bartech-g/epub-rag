import "./style.css";
import { searchBook } from "./api";
import { renderResult, renderError, setLoading } from "./ui";

const form = document.querySelector<HTMLFormElement>("#search-form")!;
const input = document.querySelector<HTMLInputElement>("#query")!;
const bookSelect = document.querySelector<HTMLSelectElement>("#book-select")!;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  const bookId = bookSelect.value;

  if (!query || !bookId) return;

  setLoading(true);

  try {
    const result = await searchBook(query, bookId);
    renderResult(result);
  } catch {
    renderError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
});
