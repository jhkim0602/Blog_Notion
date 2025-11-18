import { fetchProjects } from '@/lib/notion-projects';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects = await fetchProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('API Error fetching projects:', error);
    return NextResponse.json([], { status: 500 });
  }
}