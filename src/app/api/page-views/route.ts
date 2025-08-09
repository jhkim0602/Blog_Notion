import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

import { v4 as uuidv4 } from 'uuid'; // uuid 임포트

const TOTAL_VIEWS_ID = 'blog_total_views';
const VISITOR_COOKIE_NAME = 'blog_visitor_id';
const COOKIE_EXPIRATION_SECONDS = 60 * 60 * 24;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get(VISITOR_COOKIE_NAME);

  try {
    let pageViewCount = 0;

    if (!visitorId) {
      // 새로운 방문자: 조회수 증가 및 쿠키 설정
      const { data, error } = await supabase.rpc('increment_page_view', { row_id: TOTAL_VIEWS_ID });

      if (error) throw error;
      pageViewCount = data;

      const newVisitorId = uuidv4(); // uuidv4() 사용
      const response = NextResponse.json({ totalViews: pageViewCount }, { status: 200 });
      response.cookies.set(VISITOR_COOKIE_NAME, newVisitorId, {
        maxAge: COOKIE_EXPIRATION_SECONDS,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return response;
    } else {
      // 기존 방문자: 조회수 증가 없이 현재 값만 가져옴
      const { data, error } = await supabase
        .from('PageView')
        .select('count')
        .eq('id', TOTAL_VIEWS_ID)
        .single();

      if (error) throw error;
      pageViewCount = data ? data.count : 0;
    }

    return NextResponse.json({ totalViews: pageViewCount }, { status: 200 });
  } catch (error) {
    console.error('Error updating total page views:', error);
    return NextResponse.json({ error: 'Failed to update total page views' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('PageView')
      .select('count')
      .eq('id', TOTAL_VIEWS_ID)
      .single();

    if (error) throw error;

    return NextResponse.json({ totalViews: data ? data.count : 0 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching total page views:', error);
    return NextResponse.json({ error: 'Failed to fetch total page views' }, { status: 500 });
  }
}
