"use client";

import { useState, useEffect, useMemo, useLayoutEffect, useRef } from "react";
import { Post } from "@/lib/notion";
import PostCard from "@/components/post-card";
import { gsap } from "gsap";

interface PostFilterClientProps {
  posts: Post[];
}

const tabs = [
  { id: "all", label: "All Posts" },
  { id: "category", label: "By Category" },
  { id: "tag", label: "By Tag" },
];

export default function PostFilterClient({ posts }: PostFilterClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [mounted, setMounted] = useState(false);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 카테고리별 포스트 수 계산 (memoization으로 안정화)
  const categoryStats = useMemo(() => {
    return posts.reduce((acc, post) => {
      const category = post.category || "기타";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [posts]);
  
  // 카테고리 목록을 안정화
  const sortedCategories = useMemo(() => {
    return Object.entries(categoryStats).sort(([a], [b]) => a.localeCompare(b, 'ko'));
  }, [categoryStats]);
  
  const allCount = posts.length;
  
  // 카테고리 필터링
  const filteredPosts = useMemo(() => {
    return activeCategory === "all" 
      ? posts 
      : posts.filter(post => (post.category || "기타") === activeCategory);
  }, [posts, activeCategory]);

  useLayoutEffect(() => {
    if (!mounted) return;
    if (!cardsContainerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-post-card]");
      gsap.set(cards, { opacity: 0, y: 40 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, cardsContainerRef);

    return () => ctx.revert();
  }, [filteredPosts, mounted]);

  // hydration 완료 전에는 로딩 상태 표시
  if (!mounted) {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">Category</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">Category</span>
        </div>
        <div className="flex flex-row gap-2 h-10 items-center flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={`cursor-target px-3 py-1 rounded-md text-sm font-medium transition-colors border h-7 ${
              activeCategory === "all"
                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            }`}
          >
            All ({allCount})
          </button>
          
          {sortedCategories.map(([category, count]) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-target px-3 py-1 rounded-md text-sm font-medium transition-colors border h-7 ${
                  activeCategory === category
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                }`}
              >
                {category === "기타" ? "🔥" : ""}{category} ({count})
              </button>
            ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div ref={cardsContainerRef} className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} data-post-card className="cursor-target will-change-[transform,opacity]">
            <PostCard post={post} />
          </div>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">해당 카테고리에 포스트가 없습니다.</p>
        </div>
      )}
    </>
  );
}
