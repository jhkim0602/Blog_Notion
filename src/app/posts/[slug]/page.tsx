"use client"; // 클라이언트 컴포넌트로 전환

import { getPost } from "@/lib/notion";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next"; // Metadata는 서버 컴포넌트에서만 사용 가능하므로, generateMetadata 함수는 별도로 유지
import ReactMarkdown from "react-markdown";
import { ResolvingMetadata } from "next";
import { Badge } from "@/components/ui/badge";
import { components } from "@/components/mdx-component";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import PostViewCounter from "@/components/post-view-counter"; // PostViewCounter 임포트

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// generateMetadata 함수는 서버 컴포넌트에서만 작동하므로, 이 부분은 그대로 유지
// 하지만 PostPage가 클라이언트 컴포넌트가 되면서 generateMetadata는 별도로 호출되어야 함
// Next.js 13+ App Router에서는 generateMetadata는 서버에서 실행되므로,
// page.tsx가 "use client"여도 generateMetadata는 서버에서 실행됩니다.




export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug); // getPost 직접 호출

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage || `${siteUrl}/opengraph-image.png`,
    datePublished: new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: post.author || "Guest Author",
    },
    publisher: {
      "@type": "Organization",
      name: "Your Site Name",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/posts/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto prose dark:prose-invert">
        {post.coverImage && (
          <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <time>{format(new Date(post.date), "MMMM d, yyyy")}</time>
            {post.author && <span>By {post.author}</span>}
            <PostViewCounter slug={slug} /> {/* 조회수 컴포넌트 추가 */}
          </div>

          <h1 className="text-4xl font-bold mb-4 text-foreground">
            {post.title}
          </h1>

          <div className="flex gap-4 mb-4">
            {post.category && (
              <Badge variant="secondary">{post.category}</Badge>
            )}
            {post.tags &&
              post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
          </div>
        </header>

        <div className="max-w-none">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}