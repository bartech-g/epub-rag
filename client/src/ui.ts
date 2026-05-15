import type { SearchResult } from "./types";

export function renderResult(result: SearchResult): void {
  const container = document.querySelector<HTMLDivElement>("#result")!;

  container.innerHTML = `
    <div class="answer">
      <h2>Answer</h2>
      <p>${result.answer}</p>
    </div>
    <div class="sources">
      <h3>Sources</h3>
      ${result.sources
        .map(
          (s) => `
        <div class="source">
          <span class="chapter">${s.chapterTitle}</span>
          <p>${s.content}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

export function renderError(message: string): void {
  const container = document.querySelector<HTMLDivElement>("#result")!;
  container.innerHTML = `<div class="error">${message}</div>`;
}

export function setLoading(loading: boolean): void {
  const button = document.querySelector<HTMLButtonElement>("#search-btn")!;
  const spinner = document.querySelector<HTMLDivElement>("#spinner")!;

  button.disabled = loading;
  spinner.style.display = loading ? "block" : "none";
}
