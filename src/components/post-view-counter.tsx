"use client";

import { useEffect, useState } from "react";

interface PostViewCounterProps {
  slug: string;
}

export default function PostViewCounter({ slug }: PostViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    // 조회수 증가 API 호출
    fetch(`/api/views/${slug}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.views !== undefined) {
          setViews(data.views);
        }
      })
      .catch(err => console.error('Failed to increment view:', err));

    // 초기 조회수 가져오기 (선택 사항, POST 응답에서 바로 받을 수도 있음)
    fetch(`/api/views/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.views !== undefined) {
          setViews(data.views);
        }
      })
      .catch(err => console.error('Failed to fetch initial views:', err));
  }, [slug]);

  if (views === null) {
    return (
      <span className="w-16 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></span>
    ); // 로딩 중에는 스켈레톤 표시
  }

  return (
    <span>Views: {views}</span>
  );
}
