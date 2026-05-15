# epub-rag

A full-stack RAG (Retrieval-Augmented Generation) app that lets you search and ask questions about any EPUB book using AI.

## How it works

1. Place an EPUB file in `server/data/books/`
2. Send a request to process the book — it gets parsed, chunked, and vectorized
3. Ask questions in natural language via the UI
4. Get AI-generated answers with references to the source chapters

## Project structure

```
epub-rag/
├── server/         # Node.js + TypeScript REST API
├── client/         # Vanilla TypeScript + Vite PWA
└── README.md
```

## Requirements

- Node.js v20+
- An OpenAI API key
- An EPUB file

---

## Server setup

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

### Start the server

```bash
npm run dev       # development with hot reload
npm run build     # compile to dist/
npm start         # run compiled build
```

### Process a book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"filename": "fileName.epub"}'
```

Response:

```json
{
  "success": true,
  "bookId": "bookId",
  "chapters": 31,
  "chunks": 219
}
```

### Search

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "your question?", "bookId": "bookId"}'
```

Response:

```json
{
  "answer": "...",
  "sources": [
    {
      "chapterTitle": "...",
      "content": "..."
    }
  ]
}
```

---

## Client setup

```bash
cd client
npm install
```

### Start the client

```bash
npm run dev       # development server at http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview production build
```

The client proxies all `/api` requests to `http://localhost:3000` automatically in development.

### Add a new book to the UI

In `client/index.html`, add a new option to the select element:

```html
<option value="YourBookId">Your Book Title</option>
```

The `value` must match the `bookId` returned when processing the book (filename without `.epub`).

---

## Server structure

```
server/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── routes/
│   │   ├── books.ts          # POST /api/books
│   │   └── search.ts         # POST /api/search
│   └── services/
│       ├── epub.ts            # EPUB parsing + chunking
│       ├── embeddings.ts      # OpenAI vectorization
│       ├── vectorstore.ts     # Vectra local vector DB
│       └── rag.ts             # Search + AI answer generation
└── data/
    ├── books/                 # place your .epub files here
    └── indexes/               # vector indexes stored here automatically
```

## Client structure

```
client/
├── src/
│   ├── main.ts               # Entry point, form handling
│   ├── api.ts                # Fetch wrapper for backend
│   ├── ui.ts                 # DOM rendering
│   ├── types.ts              # TypeScript interfaces
│   └── style.css             # Styles
└── index.html
```
