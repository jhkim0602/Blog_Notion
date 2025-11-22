import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Post, getWordCount } from "@/lib/notion";
import { Calendar, Clock } from "lucide-react";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  // 읽기 시간 계산 (분 단위)
  const readingTime = Math.ceil(getWordCount(post.content) / 200);

  return (
    <article className="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 hover:shadow-md transition-shadow duration-300">
      <Link
        href={`/posts/${post.slug}`}
        className="absolute inset-0 z-10"
        aria-label={post.title}
      />

      {/* 추천 배지 */}
      {featured && (
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            추천
          </span>
        </div>
      )}

      {/* 이미지 */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800" />
        )}
      </div>

      {/* 컨텐츠 */}
      <div className="p-6 space-y-3">
        {/* 카테고리 */}
        {post.category && (
          <span className="text-sm text-pink-600 dark:text-pink-400 font-medium">
            {post.category}
          </span>
        )}

        {/* 제목 */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>

        {/* 날짜 및 읽기 시간 */}
        <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(post.date), "yyyy.MM.dd")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime}분 읽기</span>
          </div>
        </div>
      </div>
    </article>
  );
}
