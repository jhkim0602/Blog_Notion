"use client";

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function PageViews() {
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    // 페이지 로드 시 방문자 수 증가 API 호출
    fetch('/api/page-views', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.totalViews !== undefined) {
          setTotalViews(data.totalViews);
        }
      })
      .catch(err => console.error('Failed to increment total page views:', err));

    // 초기 방문자 수 가져오기 (선택 사항, POST 응답에서 바로 받을 수도 있음)
    fetch('/api/page-views')
      .then(res => res.json())
      .then(data => {
        if (data.totalViews !== undefined) {
          setTotalViews(data.totalViews);
        }
      })
      .catch(err => console.error('Failed to fetch initial total page views:', err));
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
