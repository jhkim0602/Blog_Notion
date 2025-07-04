"use client";

import { useState } from "react";
import { Post } from "@/lib/notion";
import PostCard from "@/components/post-card";
import GroupedByCategory from "@/components/grouped-by-category";
import GroupedByTag from "@/components/grouped-by-tag";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PostFilterClientProps {
  posts: Post[];
}

export default function PostFilterClient({ posts }: PostFilterClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "category" | "tag">("all");

  return (
    <>
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
        >
          전체보기
        </Button>
        <Button
          variant={activeTab === "category" ? "default" : "outline"}
          onClick={() => setActiveTab("category")}
        >
          카테고리별
        </Button>
        <Button
          variant={activeTab === "tag" ? "default" : "outline"}
          onClick={() => setActiveTab("tag")}
        >
          태그별
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "all" && (
          <motion.div
            key="all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}
        {activeTab === "category" && (
          <GroupedByCategory key="category" posts={posts} />
        )}
        {activeTab === "tag" && (
          <GroupedByTag key="tag" posts={posts} />
        )}
      </AnimatePresence>
    </>
  );
}