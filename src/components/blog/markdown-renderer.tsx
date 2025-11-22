"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { 
  oneLight, 
  oneDark 
} from "react-syntax-highlighter/dist/cjs/styles/prism";

// 코드 블록을 위한 Copy 버튼 컴포넌트
function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 z-10 p-2 rounded-md bg-gray-700 dark:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="rounded-lg !bg-gray-900 dark:!bg-gray-800 !p-4"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

const components = {
  // 헤딩들 - d5br5.dev 스타일
  h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className={cn("text-4xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-6 scroll-mt-24", className)}>
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className={cn("text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4 scroll-mt-24", className)}>
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className={cn("text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-3 scroll-mt-24", className)}>
      {children}
    </h3>
  ),
  h4: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className={cn("text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2 scroll-mt-24", className)}>
      {children}
    </h4>
  ),
  h5: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 {...props} className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2 scroll-mt-24", className)}>
      {children}
    </h5>
  ),
  h6: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 {...props} className={cn("text-base font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2 scroll-mt-24", className)}>
      {children}
    </h6>
  ),

  // 본문 텍스트 - 높은 line-height, 넓은 spacing
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-gray-700 dark:text-gray-300 leading-8 mb-6">{children}</p>
  ),

  // 링크 - 핑크 색상 테마
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a 
      href={href} 
      className="text-pink-600 dark:text-pink-400 hover:underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  // 리스트 - 노션과 유사한 스타일
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-6 space-y-2 pl-6 list-disc text-gray-700 dark:text-gray-300">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-6 space-y-2 pl-6 list-decimal text-gray-700 dark:text-gray-300">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),

  // 인용구 - 최소한의 스타일
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-6 border-l-4 border-gray-300 dark:border-gray-600 pl-6 py-2 text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900 rounded-r-lg">
      {children}
    </blockquote>
  ),

  // 코드 블록과 인라인 코드
  code: ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");
    
    return match ? (
      <CodeBlock language={match[1]}>{codeString}</CodeBlock>
    ) : (
      <code className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    );
  },

  pre: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn("mb-6", className)} {...props} />;
  },

  // 이미지 - 중앙 정렬, caption 지원
  img: ({ src, alt }: { src?: string | Blob; alt?: string }) => {
    const imageUrl = src
      ? typeof src === "string"
        ? src
        : URL.createObjectURL(src)
      : "";
    return (
      <div className="mb-8 text-center">
        <Image
          src={imageUrl}
          alt={alt || ""}
          className="rounded-lg mx-auto max-w-full h-auto"
          width={800}
          height={600}
        />
        {alt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
            {alt}
          </p>
        )}
      </div>
    );
  },

  // Strong과 Em
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-gray-700 dark:text-gray-300">{children}</em>
  ),

  // 테이블 - 최소한의 스타일
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="mb-8 overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700">{children}</tr>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{children}</td>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </th>
  ),

  // HR - 섹션 구분선
  hr: () => (
    <hr className="my-8 border-gray-200 dark:border-gray-700" />
  ),
};

export { components };
