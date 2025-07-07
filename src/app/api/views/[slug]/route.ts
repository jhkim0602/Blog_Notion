import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/').pop(); // URL에서 slug 추출

  if (!slug) {
    return NextResponse.json({ error: 'Slug not found' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.rpc('increment_post_view', { post_slug: slug });

    if (error) throw error;

    return NextResponse.json({ views: data }, { status: 200 });
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

    if (error) throw error;

    return NextResponse.json({ views: data ? data.views : 0 }, { status: 200 });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
  }
}
