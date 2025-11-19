import { fetchProjects } from '@/lib/notion-projects';
import { NextResponse } from 'next/server';

export const revalidate = 300; // 5분 캐싱

export async function GET() {
  try {
    const projects = await fetchProjects();
    
    const response = NextResponse.json(projects);
    
    // 브라우저 캐싱도 추가 (5분)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('API Error fetching projects:', error);
    return NextResponse.json([], { status: 500 });
  }
}