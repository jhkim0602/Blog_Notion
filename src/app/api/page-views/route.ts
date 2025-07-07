import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers'; // cookies 임포트

const TOTAL_VIEWS_ID = 'blog_total_views'; // 고정된 ID
const VISITOR_COOKIE_NAME = 'blog_visitor_id';
const COOKIE_EXPIRATION_SECONDS = 60 * 60 * 24; // 24시간

export async function POST(request: Request) {
  const cookieStore = cookies();
  const visitorId = cookieStore.get(VISITOR_COOKIE_NAME);

  try {
    let pageView;

    if (!visitorId) {
      // 새로운 방문자: 조회수 증가 및 쿠키 설정
      pageView = await prisma.pageView.upsert({
        where: { id: TOTAL_VIEWS_ID },
        update: { count: { increment: 1 } },
        create: { id: TOTAL_VIEWS_ID, count: 1 },
      });

      // 고유한 방문자 ID 생성 (간단하게 타임스탬프 + 랜덤 문자열)
      const newVisitorId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      cookieStore.set(VISITOR_COOKIE_NAME, newVisitorId, {
        maxAge: COOKIE_EXPIRATION_SECONDS,
        path: '/', // 블로그 전체에 적용
        httpOnly: true, // JavaScript에서 접근 불가
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
        sameSite: 'lax',
      });
    } else {
      // 기존 방문자: 조회수 증가 없이 현재 값만 가져옴
      pageView = await prisma.pageView.findUnique({
        where: { id: TOTAL_VIEWS_ID },
      });
    }

    return NextResponse.json({ totalViews: pageView ? pageView.count : 0 }, { status: 200 });
  } catch (error) {
    console.error('Error updating total page views:', error);
    return NextResponse.json({ error: 'Failed to update total page views' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pageView = await prisma.pageView.findUnique({
      where: { id: TOTAL_VIEWS_ID },
    });

    return NextResponse.json({ totalViews: pageView ? pageView.count : 0 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching total page views:', error);
    return NextResponse.json({ error: 'Failed to fetch total page views' }, { status: 500 });
  }
}