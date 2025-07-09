import { getPost } from "@/lib/notion";
import { Metadata } from "next";
import { ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteUrl}/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteUrl}/posts/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : [],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || `${siteUrl}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

import { fetchPublishedPosts } from "@/lib/notion";

export async function generateStaticParams() {
  const posts = await fetchPublishedPosts();
  const params = posts.results.map((post) => ({ slug: post.id }));
  console.log("Generated static params:", params); // 디버깅 로그
  return params;
}

export const revalidate = 60; // 1분마다 갱신

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
