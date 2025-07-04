"use client";

import { Post } from "@/lib/notion";
import PostCard from "@/components/post-card";
import { motion } from "framer-motion";

interface GroupedByCategoryProps {
  posts: Post[];
}

const categoryColors: { [key: string]: string } = {
  "Web Development": "border-blue-500",
  "Mobile Development": "border-green-500",
  "AI/ML": "border-purple-500",
  "Data Science": "border-red-500",
  "Cloud Computing": "border-yellow-500",
  "DevOps": "border-orange-500",
  "Cybersecurity": "border-pink-500",
  "Game Development": "border-indigo-500",
  "Blockchain": "border-teal-500",
  "UI/UX": "border-cyan-500",
  "Database": "border-lime-500",
  "Programming Languages": "border-fuchsia-500",
  "Operating Systems": "border-rose-500",
  "Network": "border-emerald-500",
  "Algorithm": "border-amber-500",
  "Software Engineering": "border-violet-500",
  "Others": "border-gray-500",
};

export default function GroupedByCategory({ posts }: GroupedByCategoryProps) {
  const groupedPosts: { [key: string]: Post[] } = posts.reduce((acc, post) => {
    const category = post.category || "Others";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(post);
    return acc;
  }, {} as { [key: string]: Post[] });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-12"
    >
      {Object.entries(groupedPosts).map(([category, categoryPosts]) => (
        <section key={category} className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground border-b-2 pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                categoryColor={categoryColors[category] || categoryColors["Others"]}
              />
            ))}
          </div>
        </section>
      ))}
    </motion.div>
  );
}