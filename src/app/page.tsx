import { fetchPublishedPostsSummary as fetchPublishedPosts, Post } from "@/lib/notion";
import PostFilterClient from "@/components/post-filter-client";
import { Bio } from "@/components/bio";

async function getPosts(): Promise<Post[]> {
  const posts = await fetchPublishedPosts();
  return posts.results;
}
export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <Bio />
      <PostFilterClient posts={posts} />
    </div>
  );
}
