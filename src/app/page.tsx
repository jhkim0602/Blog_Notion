import { fetchPublishedPostsSummary as fetchPublishedPosts, Post } from "@/lib/notion";
import PostFilterClient from "@/components/post-filter-client";
import { Bio } from "@/components/bio";
import TagCloudSection from "@/components/tag-cloud-section";
import TargetCursor from "@/components/TargetCursor";

async function getPosts(): Promise<Post[]> {
  const posts = await fetchPublishedPosts();
  return posts.results;
}
export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <TargetCursor targetSelector=".cursor-target" hoverDuration={0.25} />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Bio />
        
        {/* Section 1 */}
        <TagCloudSection posts={posts} />

        {/* Section 2 - 기존 카드 형식 */}
        <section className="mt-12">
          <PostFilterClient posts={posts} />
        </section>
      </div>
    </>
  );
}
