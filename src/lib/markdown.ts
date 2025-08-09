export type HeadingItem = {
  id: string;
  text: string;
  level: number;
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()_+=[\]{}|;:'",.<>/?]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractHeadings(markdown: string, maxLevel: number = 4): HeadingItem[] {
  const lines = markdown.split(/\r?\n/);
  const results: HeadingItem[] = [];
  const headingRegex = new RegExp(`^(#{1,${maxLevel}})\\s+(.+)$`);

  for (const line of lines) {
    const m = headingRegex.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const raw = m[2].trim();
    const text = raw.replace(/[#]*$/g, "").trim();
    const id = slugify(text);
    results.push({ id, text, level });
  }
  return results;
}

