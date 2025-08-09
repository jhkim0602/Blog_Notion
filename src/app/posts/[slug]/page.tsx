import { getPost } from "@/lib/notion";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next"; // Metadata는 서버 컴포넌트에서만 사용 가능하므로, generateMetadata 함수는 별도로 유지
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { components } from "@/components/mdx-component";
import { extractHeadings } from "@/lib/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import PostViewCounter from "@/components/post-view-counter"; // PostViewCounter 임포트
import Toc from "@/components/toc";
import ReadingProgress from "@/components/reading-progress";
// import ScrollFollow from "@/components/scroll-follow";

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
  const precomputedHeadings = extractHeadings(post.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <div className="max-w-5xl mx-auto px-4 lg:pr-[300px]">
        <article data-article className="prose dark:prose-invert max-w-none">
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
            <span className="text-sm">•</span>
            <PostViewCounter slug={slug} />
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
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              rehypeRaw,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
              rehypeKatex,
            ]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        </article>
      </div>
      <div
        className="hidden sm:block fixed top-1/2 -translate-y-1/2 z-[60] w-[260px]"
        style={{ right: "min(16vw, 16rem)" }}
      >
        <div className="rounded-2xl border bg-background/80 backdrop-blur-xl p-4 ring-1 ring-black/5">
          <Toc />
        </div>
      </div>
    </>
  );
}
