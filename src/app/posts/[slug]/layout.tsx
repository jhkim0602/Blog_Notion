import { fetchPublishedPosts } from "@/lib/notion";

export async function generateStaticParams() {
  const posts = await fetchPublishedPosts();
  return posts.results.map((post) => ({ slug: post.id }));
}

export const revalidate = 60; // 1분마다 갱신

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
