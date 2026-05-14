# epub-rag

A RAG (Retrieval-Augmented Generation) pipeline that lets you search and ask questions about any EPUB book using AI.

## How it works

1. Upload an EPUB file
2. The server parses, chunks, and vectorizes the content
3. Ask questions in natural language
4. Get AI-generated answers with references to the source chapters

## Requirements

- Node.js v20+
- An OpenAI API key
- An EPUB file

## Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```
OPENAI_API_KEY=sk-your-key-here
PORT=3000
```

Place your EPUB file in `server/data/books/`.

## Start the server

```bash
npm run dev
```

## Process a book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"filename": "fileName.epub"}'
```

Response:

```json
{
  "success": true,
  "bookId": "ID",
  "chapters": 31,
  "chunks": 219
}
```

## Search

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What is chapter 1 about?", "bookId": "ID"}'
```

Response:

```json
{
  "answer": ""
  "sources": [
    {
      "chapterTitle": "...",
      "content": "..."
    }
  ]
}
```

## Project structure

```
server/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── books.ts
│   │   └── search.ts
│   └── services/
│       ├── epub.ts
│       ├── embeddings.ts
│       ├── vectorstore.ts
│       └── rag.ts
└── data/
    ├── books/       # place your .epub files here
    └── indexes/     # vector indexes are stored here automatically
```
