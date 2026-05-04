import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>;
  body: string;
  html: string;
}

export async function parseMarkdown(raw: string): Promise<ParsedMarkdown> {
  const { data, content } = matter(raw);
  const file = await remark().use(remarkHtml).process(content);
  return {
    frontmatter: data,
    body: content,
    html: String(file),
  };
}
