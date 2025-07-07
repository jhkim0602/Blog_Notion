import { fetchPublishedPosts, getPost, Post } from "@/lib/notion";
import PostFilterClient from "@/components/post-filter-client";
import { Bio } from "@/components/bio";

async function getPosts(): Promise<Post[]> {
  const posts = await fetchPublishedPosts();
  const allPosts = await Promise.all(
    posts.results.map((post) => getPost(post.id))
  );
  return allPosts.filter((post): post is Post => post !== null);
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
