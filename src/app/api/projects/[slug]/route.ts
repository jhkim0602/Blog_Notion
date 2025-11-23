import { NextRequest, NextResponse } from 'next/server';
import { getProjectBySlug } from '@/lib/notion-projects';

export const revalidate = 60; // 60초 캐싱

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Project slug is required' },
        { status: 400 }
      );
    }

    const project = await getProjectBySlug(slug);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(project);
    
    // 브라우저 캐싱도 추가 (60초)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}