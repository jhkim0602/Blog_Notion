import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const postView = await prisma.postView.upsert({
      where: { slug: slug },
      update: { views: { increment: 1 } },
      create: { slug: slug, views: 1 },
    });

    return NextResponse.json({ views: postView.views }, { status: 200 });
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json({ error: 'Failed to update view count' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const postView = await prisma.postView.findUnique({
      where: { slug: slug },
    });

    return NextResponse.json({ views: postView ? postView.views : 0 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
  }
}
