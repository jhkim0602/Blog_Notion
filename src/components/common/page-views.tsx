"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import CountUp from "@/components/ui-effects/count-up";
import DecryptedText from "@/components/ui-effects/decrypted-text";

export default function PageViews() {
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    // 페이지 로드 시 방문자 수 증가 API 호출 (POST 응답만 사용)
    fetch("/api/page-views", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.totalViews !== undefined) {
          setTotalViews(data.totalViews);
        }
      })
      .catch((err) => console.error("Failed to increment total page views:", err));
  }, []);

  if (totalViews === null) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground animate-pulse">
        <Eye className="h-4 w-4" />
        <span className="relative h-4 w-20 overflow-hidden rounded-full bg-muted/60 dark:bg-muted/30">
          <span aria-hidden className="skeleton-shimmer" />
        </span>
      </div>
    ); // 로딩 중에는 스켈레톤 표시
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <div className="flex items-baseline gap-1 font-medium">
        <CountUp
          to={totalViews}
          separator=","
          className="text-sm leading-none text-foreground"
          startWhen={totalViews !== null}
        />
        <DecryptedText
          text="total views"
          animateOn="view"
          sequential
          speed={35}
          parentClassName="text-sm text-muted-foreground"
          className="text-current"
          encryptedClassName="text-muted-foreground/50"
        />
      </div>
    </div>
  );
}
