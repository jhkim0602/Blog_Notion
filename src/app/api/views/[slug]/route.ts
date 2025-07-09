import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop();

  if (!slug) {
    return NextResponse.json({ error: 'Slug not found' }, { status: 400 });
  }

  const cookieName = `post_viewed_${slug}`;

  // 쿠키가 있는지 확인
  if (request.cookies.has(cookieName)) {
    // 쿠키가 있으면 조회수를 증가시키지 않고 현재 조회수만 가져옴
    try {
      const { data, error } = await supabase
        .from('PostView')
        .select('views')
        .eq('slug', slug)
        .single();

      // 'PGRST116'는 행이 없는 경우의 에러 코드로, 실제 에러가 아님
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return NextResponse.json({ views: data ? data.views : 0 }, { status: 200 });
    } catch (error) {
      console.error('Error fetching view count:', error);
      return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
    }
  }

  // 쿠키가 없으면 조회수 증가
  try {
    const { data, error } = await supabase.rpc('increment_post_view', { post_slug: slug });

    if (error) {
      throw error;
    }

    // 응답을 생성하고 쿠키를 설정
    const response = NextResponse.json({ views: data }, { status: 200 });
    response.cookies.set({
      name: cookieName,
      value: 'true',
      maxAge: 60 * 60 * 24, // 24시간
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json({ error: 'Failed to update view count' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop(); // URL에서 slug 추출

  if (!slug) {
    return NextResponse.json({ error: 'Slug not found' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('PostView')
      .select('views')
      .eq('slug', slug)
      .single();

    // 'PGRST116'는 행이 없는 경우의 에러 코드로, 실제 에러가 아님
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ views: data ? data.views : 0 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
  }
}
