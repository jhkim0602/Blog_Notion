"use client";

import { useState, useMemo } from "react";
import { Post, getWordCount } from "@/lib/notion";
import { format } from "date-fns";
import Link from "next/link";
import { Clock } from "lucide-react";
import TextType from "@/components/TextType";
import { AnimatedListItem } from "@/components/AnimatedList";

interface TagCloudSectionProps {
  posts: Post[];
}

export default function TagCloudSection({ posts }: TagCloudSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 모든 태그 수집 및 빈도 계산
  const tagStats = useMemo(() => {
    const tagMap = new Map<string, number>();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      }
    });
    return tagMap;
  }, [posts]);

  // 선택된 태그의 포스트 필터링
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return [];
    return posts.filter(post => 
      post.tags?.includes(selectedTag)
    ); // 모든 포스트 반환 (스크롤로 보기)
  }, [posts, selectedTag]);

  // 태그 클라우드 색상 배열
  const colors = [
    "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
    "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300", 
    "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
    "bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
    "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
    "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300",
    "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300",
  ];

  // 태그 크기 계산 (빈도에 따라)
  const getTagSize = (count: number) => {
    const maxCount = Math.max(...Array.from(tagStats.values()));
    const ratio = count / maxCount;
    if (ratio > 0.7) return "text-lg px-4 py-2";
    if (ratio > 0.4) return "text-base px-3 py-2";
    return "text-sm px-3 py-1";
  };

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 flex gap-6 lg:gap-8 mt-6 sm:mt-10 flex-col sm:flex-row items-stretch">
      {/* 태그 클라우드 박스 */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">태그 클라우드</h2>
        <div className="relative min-h-[200px]">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {Array.from(tagStats.entries()).map(([tag, count], index) => (
              <AnimatedListItem key={tag} index={index} delay={index * 0.05} className="flex-shrink-0">
                <button
                  onClick={() => setSelectedTag(tag)}
                  className={`
                    cursor-target
                    ${getTagSize(count)} 
                    ${colors[index % colors.length]}
                    ${selectedTag === tag ? 'ring-2 ring-blue-500' : ''}
                    rounded-full font-medium transition-all duration-200 
                    transform hover:scale-105 hover:shadow-md
                    animate-pulse
                  `}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: '2s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {tag} ({count})
                </button>
              </AnimatedListItem>
            ))}
          </div>
        </div>
      </div>

      {/* 태그별 포스트 리스트 박스 */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          {selectedTag ? `"${selectedTag}" 태그 포스트` : '태그를 선택해주세요'}
        </h2>
        
        {selectedTag ? (
          <div className="relative h-[300px]">
            <div className="scroll-fade-mask h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="space-y-4 py-4">
              {filteredPosts.map((post, index) => {
                const readingTime = Math.ceil(getWordCount(post.content) / 200);
                const getCategoryColor = (category: string) => {
                  // 배경 제거, 핑크 텍스트만 표시
                  return "text-pink-600 dark:text-pink-400";
                };

                return (
                  <AnimatedListItem key={post.id} index={index} delay={index * 0.05}>
                    <Link href={`/posts/${post.slug}`} className="block group cursor-target">
                      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-4 transition-all duration-200 hover:shadow-sm">
                        {/* 카테고리 라벨 */}
                        {post.category && (
                          <div className="mb-1">
                            <span className={`text-xs font-semibold ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </span>
                          </div>
                        )}
                        
                        {/* 제목 */}
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-3 transition-colors">
                          {post.title}
                        </h3>
                        
                        {/* 날짜 + 읽기 시간 */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <time>{format(new Date(post.date), "MMM d, yyyy")}</time>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{readingTime}분</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </AnimatedListItem>
                );
              })}
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    해당 태그의 포스트가 없습니다.
                  </p>
                </div>
              )}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-2 top-0 h-10 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent" />
            <div className="pointer-events-none absolute inset-x-2 bottom-0 h-10 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <TextType
              as="p"
              className="text-gray-500 dark:text-gray-400 text-center"
              text={"왼쪽에서 태그를 클릭하면\n해당 태그의 포스트들을 확인할 수 있습니다."}
              typingSpeed={42}
              pauseDuration={2500}
              loop={false}
            />
          </div>
        )}
      </div>
    </section>
  );
}
