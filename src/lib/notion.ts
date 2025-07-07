import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/";

console.log("NOTION_TOKEN:", process.env.NOTION_TOKEN);

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const n2m = new NotionToMarkdown({
  notionClient: notion,
  // Add custom transformer for callout blocks
  customTransformers: {
    callout: async (block) => {
      const { callout } = block as any;
      if (callout && callout.rich_text) {
        const text = callout.rich_text.map((rt: any) => rt.plain_text).join("");
        return `<aside class="notion-aside">${text}</aside>`;
      }
      return false; // Fallback to default behavior if not a simple callout
    },
  },
});

export interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  description: string;
  date: string;
  content: string;
  author?: string;
  tags?: string[];
  category?: string;
}

export async function getDatabaseStructure() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!,
  });
  return database;
}

export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleanText.split(" ").length;
}

export async function fetchPublishedPosts() {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Status",
          status: {
            equals: "Published",
          },
        },
      ],
    },
    sorts: [
      {
        property: "Published Date",
        direction: "descending",
      },
    ],
  });

  return posts;
}

export async function getPost(pageId: string): Promise<Post | null> {
  try {
    const page = (await notion.pages.retrieve({
      page_id: pageId,
    })) as PageObjectResponse;
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const { parent: contentString } = n2m.toMarkdownString(mdBlocks);

    // Get first paragraph for description (excluding empty lines)
    const paragraphs = (contentString || "")
      .split("\n")
      .filter((line: string) => line.trim().length > 0);
    const firstParagraph = paragraphs[0] || "";
    const description =
      firstParagraph.slice(0, 160) + (firstParagraph.length > 160 ? "..." : "");

    const properties = page.properties as any;

    //console.log("Title Raw:", properties["Title"]?.title);\n    //console.log("Post Properties:", properties);

    //page는 notion api에서 받아온 한개의 페이지(글) 데이터
    //post는 타입/객체 이며 코드에서 사용하기 위해 page를 가공한
    //posts는 Post 객체 배열 -> 블로그 메인, 목록 페이지등에서 사용
    const post: Post = {
      id: page.id,
      title: properties.Title.title[0]?.plain_text || "Untitled",
      slug: page.id.replace(/-/g, "").slice(0, 15),
      coverImage: properties["Featured Image"]?.url || undefined,
      description,
      date:
        properties["Published Date"]?.date?.start || new Date().toISOString(),
      content: contentString,
      author: properties.Author?.people[0]?.name,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      category: properties.Category?.select?.name,
    };

    return post;
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}
