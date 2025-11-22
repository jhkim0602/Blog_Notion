import { getPost, getWordCount } from "@/lib/notion";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import NotionRendererWrapper from "@/components/notion-renderer";
import "@/styles/notion.css";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import PostViewCounter from "@/components/post-view-counter";
import Toc from "@/components/toc";
import Link from "next/link";
import { Moon, Github } from "lucide-react";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}



export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound(); // Add notFound() call for better error handling
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags, // Notion에 설정된 태그를 키워드로 사용
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/posts/${post.slug}`,
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

  // 서버에서 미리 헤딩 id를 계산해 클라이언트에서 안정적으로 감지되도록 함
  const readingTime = Math.ceil(getWordCount(post.content) / 200);

  if (!post.recordMap) {
    return <div>Error: No content available</div>;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-5xl mx-auto px-3 sm:px-5 md:px-8 xl:pr-[300px]">
        <article data-article className="notion-page max-w-none">
          {post.coverImage && (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <header className="mb-8">
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <time>{format(new Date(post.date), "MMMM d, yyyy")}</time>
              {post.author && <span>By {post.author}</span>}
              <span className="text-sm">•</span>
              <PostViewCounter slug={slug} />
              <span>•</span>
              <span>{readingTime}분 읽기</span>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {post.title}
            </h1>

            {post.category && (
              <div className="flex gap-4 mb-4">
                <span className="text-pink-600 dark:text-pink-400 text-sm">
                  {post.category}
                </span>
              </div>
            )}
          </header>

          <div className="notion-page-content max-w-none">
            <NotionRendererWrapper recordMap={post.recordMap} />
          </div>
        </article>
      </div>

      {/* TOC - Sticky sidebar for desktop */}
      <div
        className="hidden lg:block fixed z-10 w-[240px]"
        style={{
          top: "200px",
          right: "max(32px, calc((100vw - 1280px) / 2))"
        }}
      >
        <div className="sticky top-24">
          <Toc />
        </div>
      </div>
    </>
  );
}
