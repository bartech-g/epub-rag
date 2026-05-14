import EPub from "epub2";

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Chunk {
  id: string;
  chapterId: string;
  chapterTitle: string;
  content: string;
  index: number;
}

export async function parseEpub(filePath: string): Promise<Chapter[]> {
  const epub = await (EPub as any).createAsync(filePath);
  const chapters: Chapter[] = [];

  for (const chapter of epub.flow) {
    if (!chapter.id) continue;

    const content = await epub.getChapterRawAsync(chapter.id);
    chapters.push({
      id: chapter.id,
      title: chapter.title ?? "Untitled",
      content: stripHtml(content),
    });
  }

  return chapters;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
