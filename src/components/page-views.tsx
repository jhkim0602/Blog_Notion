"use client";

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function PageViews() {
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    // 페이지 로드 시 방문자 수 증가 API 호출 (POST 응답만 사용)
    fetch('/api/page-views', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.totalViews !== undefined) {
          setTotalViews(data.totalViews);
        }
      })
      .catch(err => console.error('Failed to increment total page views:', err));
  }, []);

  if (totalViews === null) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground animate-pulse">
        <Eye className="h-4 w-4" />
        <span className="w-16 h-4 bg-gray-200 rounded dark:bg-gray-700"></span>
      </div>
    ); // 로딩 중에는 스켈레톤 표시
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>{totalViews} total views</span>
    </div>
  );
}
