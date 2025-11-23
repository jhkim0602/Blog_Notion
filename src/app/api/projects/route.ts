import { fetchProjects } from '@/lib/notion-projects';
import { NextResponse } from 'next/server';

export const revalidate = 60; // 60초 캐싱

export async function GET() {
  try {
    const projects = await fetchProjects();
    
    const response = NextResponse.json(projects);
    
    // 브라우저 캐싱도 추가 (60초)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
  } catch (error) {
    console.error('API Error fetching projects:', error);
    return NextResponse.json([], { status: 500 });
  }
}