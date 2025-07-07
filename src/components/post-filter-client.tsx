"use client";

import { useState } from "react";
import { Post } from "@/lib/notion";
import PostCard from "@/components/post-card";
import GroupedByCategory from "@/components/grouped-by-category";
import GroupedByTag from "@/components/grouped-by-tag";
import { motion, AnimatePresence } from "framer-motion";

interface PostFilterClientProps {
  posts: Post[];
}

const tabs = [
  { id: "all", label: "All Posts" },
  { id: "category", label: "By Category" },
  { id: "tag", label: "By Tag" },
];

export default function PostFilterClient({ posts }: PostFilterClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "category" | "tag">("all");

  return (
    <>
      <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-12">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative py-3 px-4 text-md font-medium transition-colors duration-300 focus:outline-none ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary/80"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
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