import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/";
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트 임포트
import { cache } from "react";
import { NotionAPI } from "notion-client";

// 환경변수 검증 (빌드 시에만)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'development') {
  if (!process.env.NOTION_TOKEN) {
    console.warn('Warning: NOTION_TOKEN is not set');
  }
  if (!process.env.NOTION_DATABASE_ID) {
    console.warn('Warning: NOTION_DATABASE_ID is not set');
  }
}

export const notion = new Client({ 
  auth: process.env.NOTION_TOKEN || '',
  notionVersion: '2022-06-28'
});
export const notionClient = new NotionAPI();
export const n2m = new NotionToMarkdown({
  notionClient: notion,
  // @ts-ignore
  customTransformers: {
    callout: async (block: any) => {
      const { callout } = block as any;
      if (callout && callout.rich_text) {
        const text = callout.rich_text.map((rt: any) => rt.plain_text).join("");
        return `<div class="notion-callout bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500 p-4 my-4">${text}</div>`;
      }
      return false;
    },
    heading_1: async (block: any) => {
      const { heading_1 } = block as any;
      if (heading_1 && heading_1.rich_text) {
        const text = heading_1.rich_text.map((rt: any) => rt.plain_text).join("");
        const id = text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        return `<h1 class="notion-h1" id="${id}">${text}</h1>`;
      }
      return false;
    },
    heading_2: async (block: any) => {
      const { heading_2 } = block as any;
      if (heading_2 && heading_2.rich_text) {
        const text = heading_2.rich_text.map((rt: any) => rt.plain_text).join("");
        const id = text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        return `<h2 class="notion-h2" id="${id}">${text}</h2>`;
      }
      return false;
    },
    heading_3: async (block: any) => {
      const { heading_3 } = block as any;
      if (heading_3 && heading_3.rich_text) {
        const text = heading_3.rich_text.map((rt: any) => rt.plain_text).join("");
        const id = text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        return `<h3 class="notion-h3" id="${id}">${text}</h3>`;
      }
      return false;
    },
    paragraph: async (block: any) => {
      const { paragraph } = block as any;
      if (paragraph && paragraph.rich_text) {
        const text = paragraph.rich_text.map((rt: any) => rt.plain_text).join("");
        if (!text.trim()) return '';
        return `<p class="notion-paragraph">${text}</p>`;
      }
      return false;
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
  recordMap?: any; // Notion 블록 데이터 추가
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
      // Supabase에서 조회수 가져오기 (에러 처리 개선)
      let views = 0;
      try {
        const { data, error } = await supabase
          .from('PostView')
          .select('views')
          .eq('slug', post.slug)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116은 데이터가 없을 때 발생 (not found)
            console.error('Error fetching post views from Supabase:', {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint,
            });
          }
        } else if (data) {
          views = data.views || 0;
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
      }

      return { ...post, views };
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
        author: properties.Author?.people?.[0]?.name || 'Anonymous',
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        category: properties.Category?.select?.name,
      };

      // Supabase에서 조회수 가져오기 (에러 처리 개선)
      let views = 0;
      try {
        const { data, error } = await supabase
          .from('PostView')
          .select('views')
          .eq('slug', post.slug)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116은 데이터가 없을 때 발생 (not found)
            console.error('Error fetching post views from Supabase:', {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint,
            });
          }
        } else if (data) {
          views = data.views || 0;
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
      }

      return { ...post, views };
    })
  );

  return { results: mapped };
}

export const getPost = cache(async (pageId: string): Promise<Post | null> => {
  try {
    const page = (await notion.pages.retrieve.bind(notion.pages)({
      page_id: pageId,
    })) as PageObjectResponse;
    
    // Notion API 응답 검증
    if (!page || !page.properties) {
      console.error('Invalid page data from Notion API');
      return null;
    }
    
    // react-notion-x를 위한 recordMap 가져오기 (재시도 로직 포함)
    let recordMap;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // console 경고를 임시로 억제
        const originalConsoleWarn = console.warn;
        console.warn = (...args: any[]) => {
          if (!args[0]?.toString().includes('missing user')) {
            originalConsoleWarn(...args);
          }
        };
        
        recordMap = await notionClient.getPage(pageId);
        
        // 원래 console.warn 복원
        console.warn = originalConsoleWarn;
        break; // 성공하면 반복 중단
        
      } catch (error) {
        console.error(`Attempt ${attempt} failed for recordMap:`, error);
        
        if (attempt === maxRetries) {
          console.error('All attempts failed for recordMap, continuing without it');
          recordMap = null;
          break;
        }
        
        // 재시도 전 대기 (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    // Notion 블록을 마크다운으로 변환 (custom transformers 적용)
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const { parent: contentString } = n2m.toMarkdownString(mdBlocks);
    
    // 콘텐츠 검증 및 정리
    const cleanedContent = contentString || '';
    
    // Get first paragraph for description (excluding empty lines)
    const paragraphs = (cleanedContent || "")
      .split("\n")
      .filter((line: string) => line.trim().length > 0);
    const firstParagraph = paragraphs[0] || "";
    const description =
      firstParagraph.slice(0, 160) + (firstParagraph.length > 160 ? "..." : "");

    const properties = page.properties as any;

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
      content: cleanedContent,
      author: properties.Author?.people?.[0]?.name || 'Anonymous',
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      category: properties.Category?.select?.name,
      recordMap // react-notion-x용 recordMap 추가
    };

    return post;
  } catch (error) {
    console.error("Error getting post:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
});
