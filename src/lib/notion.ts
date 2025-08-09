import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/";
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트 임포트
import { cache } from "react";

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const n2m = new NotionToMarkdown({
  notionClient: notion,
  // @ts-ignore
  customTransformers: {
    callout: async (block: any) => {
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
  views?: number; // 조회수 속성 추가
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

export async function fetchPublishedPosts(): Promise<{ results: Post[] }> {
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

  const allPosts = await Promise.all(
    posts.results.map(async (p) => {
      const post = await getPost(p.id);
      if (!post) return null;

      // Supabase에서 조회수 가져오기
      const { data, error } = await supabase
        .from('PostView')
        .select('views')
        .eq('slug', post.slug)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116은 데이터가 없을 때 발생 (not found)
        console.error('Error fetching post views from Supabase:', error);
      }

      return { ...post, views: data ? data.views : 0 };
    })
  );

  return { results: allPosts.filter(Boolean) as Post[] }; // null 값 필터링 후 Post[]로 타입 단언
}

// 목록용 요약 데이터: 콘텐츠 변환 없이 속성만 사용
export async function fetchPublishedPostsSummary(): Promise<{ results: Post[] }> {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Status",
          status: { equals: "Published" },
        },
      ],
    },
    sorts: [
      { property: "Published Date", direction: "descending" },
    ],
  });

  const mapped = await Promise.all(
    posts.results.map(async (p: any) => {
      const properties = p.properties as any;
      const post: Post = {
        id: p.id,
        title: properties.Title?.title?.map((t: any) => t.plain_text).join("") || "Untitled",
        slug: p.id,
        coverImage: properties["Featured Image"]?.url || undefined,
        description: "",
        date: properties["Published Date"]?.date?.start || new Date().toISOString(),
        content: "", // 목록에서는 사용하지 않음
        author: properties.Author?.people?.[0]?.name,
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        category: properties.Category?.select?.name,
      };

      const { data, error } = await supabase
        .from('PostView')
        .select('views')
        .eq('slug', post.slug)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching post views from Supabase:', error);
      }
      return { ...post, views: data ? data.views : 0 };
    })
  );

  return { results: mapped };
}

export const getPost = cache(async (pageId: string): Promise<Post | null> => {
  try {
    const page = (await notion.pages.retrieve.bind(notion.pages)({
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
      title: properties.Title.title.map((t: any) => t.plain_text).join("") || "Untitled",
      slug: page.id,
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
});
