import { EPub } from "epub2/lib/epub.js";

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export function parseEpub(filePath: string): Promise<Chapter[]> {
  return new Promise((resolve, reject) => {
    const epub = (EPub as any).create(filePath);

    epub.on("end", async () => {
      const chapters: Chapter[] = [];

      for (const item of epub.flow) {
        if (!item.id) continue;

        try {
          const content = await new Promise<string>((res, rej) => {
            epub.getChapterRaw(item.id, (err, text) => {
              if (err) rej(err);
              else res(text);
            });
          });

          chapters.push({
            id: item.id,
            title: item.title ?? "Untitled",
            content: stripHtml(content),
          });
        } catch {
          // skip broken chapters
        }
      }

      resolve(chapters);
    });

    epub.on("error", reject);
    epub.parse();
  });
}

export interface Chunk {
  id: string;
  chapterId: string;
  chapterTitle: string;
  content: string;
  index: number;
}

export function chunkChapters(chapters: Chapter[], chunkSize = 500): Chunk[] {
  const chunks: Chunk[] = [];

  for (const chapter of chapters) {
    const words = chapter.content.split(" ");
    let index = 0;

    while (words.length > 0) {
      const chunkWords = words.splice(0, chunkSize);
      chunks.push({
        id: `${chapter.id}-${index}`,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        content: chunkWords.join(" "),
        index,
      });
      index++;
    }
  }

  return chunks;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
