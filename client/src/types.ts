export interface SearchResult {
  answer: string;
  sources: {
    chapterTitle: string;
    content: string;
  }[];
}

export interface ApiError {
  error: string;
}
