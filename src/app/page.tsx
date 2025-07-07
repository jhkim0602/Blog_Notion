import { fetchPublishedPosts, Post } from "@/lib/notion";
import PostFilterClient from "@/components/post-filter-client";
import { Bio } from "@/components/bio";

async function getPosts(): Promise<Post[]> {
  const posts = await fetchPublishedPosts();
  return posts.results; // fetchPublishedPosts가 이미 Post[]를 반환하도록 수정되었으므로 직접 반환
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
