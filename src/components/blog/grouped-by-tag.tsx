"use client";

import { useState } from "react";
import { Post } from "@/lib/notion";
import PostCard from "@/components/blog/post-card";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface GroupedByTagProps {
  posts: Post[];
}

export default function GroupedByTag({ posts }: GroupedByTagProps) {
  const tagCounts: { [key: string]: number } = posts.reduce((acc, post) => {
    post.tags?.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as { [key: string]: number });

  const allTags = Object.keys(tagCounts).sort();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Badge
          variant={selectedTag === null ? "default" : "outline"}
          onClick={() => setSelectedTag(null)}
          className="cursor-pointer px-4 py-1.5 text-base"
        >
          전체 태그 ({posts.length})
        </Badge>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            onClick={() => setSelectedTag(tag)}
            className="cursor-pointer px-4 py-1.5 text-base"
          >
            {tag} ({tagCounts[tag]})
          </Badge>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTag || "all-posts"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              <p>선택된 태그에 해당하는 포스트가 없습니다.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
