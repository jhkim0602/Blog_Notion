import { notion, n2m } from '@/lib/notion';
import { cache } from 'react';

export interface ProjectMetadata {
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  status: string;
  date_range: string;
  featured_image?: string;
}

export interface NotionProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tech_stack: string[];
  status: string;
  date_range: string;
  featured_image?: string;
  recordMap?: any;
}

// 프로젝트 데이터베이스에서 모든 프로젝트 가져오기
export async function fetchProjects(): Promise<NotionProject[]> {
  // 환경변수에서 프로젝트 데이터베이스 ID 가져오기
  const projectDatabaseId = process.env.NOTION_PROJECTS_DATABASE_ID;
  
  if (!projectDatabaseId) {
    console.error('NOTION_PROJECTS_DATABASE_ID is not set');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: projectDatabaseId,
      sorts: [
        {
          property: "Date Range",
          direction: "descending"
        }
      ]
    });

    const projects = await Promise.all(
      response.results.map(async (page: any) => {
        const project = await getProjectContent(page.id);
        return project;
      })
    );

    return projects.filter(Boolean) as NotionProject[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// 특정 프로젝트 상세 내용 가져오기
export const getProjectContent = cache(async (pageId: string): Promise<NotionProject | null> => {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId }) as any;
    
    if (!page || !page.properties) {
      console.error('Invalid project page data from Notion API');
      return null;
    }

    // Notion 블록을 마크다운으로 변환
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const { parent: contentString } = n2m.toMarkdownString(mdBlocks);

    const properties = page.properties;

    const project: NotionProject = {
      id: page.id,
      title: properties.Title?.title?.map((t: any) => t.plain_text).join("") || "Untitled",
      slug: properties.Title?.title?.map((t: any) => t.plain_text).join("").toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || page.id,
      description: properties.Description?.rich_text?.map((t: any) => t.plain_text).join("") || "",
      content: contentString || '',
      tech_stack: properties["Tech Stack"]?.multi_select?.map((tag: any) => tag.name) || [],
      status: "Published", // 기본값으로 설정
      date_range: properties["Date Range"]?.rich_text?.map((t: any) => t.plain_text).join("") || "",
      featured_image: undefined, // 현재 데이터베이스에 없음
    };

    return project;
  } catch (error) {
    console.error("Error getting project content:", error);
    return null;
  }
});

// 슬러그로 프로젝트 찾기
export async function getProjectBySlug(slug: string): Promise<NotionProject | null> {
  const projects = await fetchProjects();
  return projects.find(project => project.slug === slug) || null;
}