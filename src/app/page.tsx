import { fetchPublishedPosts, getPost, Post } from "@/lib/notion";
import PostFilterClient from "@/components/post-filter-client";

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
    <div>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          김정환의 개발 성장 Log
        </h1>
        <p className="text-lg text-muted-foreground">
          Notes from a developer who never stops learning.
        </p>
      </div>
      <PostFilterClient posts={posts} />
    </div>
  );
}
