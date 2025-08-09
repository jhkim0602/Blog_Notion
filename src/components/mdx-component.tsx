import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Badge } from "./ui/badge";

const components = {
  h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className={cn("mb-4 font-bold text-4xl", className)}>{children}</h1>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="-mb-1 leading-normal">{children}</p>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} className="text-blue-500">
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 list-disc pl-5">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 list-decimal pl-5">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="mb-2">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-4 border-neutral-300 border-l-2 py-2 pl-4 italic">
      {children}
    </blockquote>
  ),
  code: ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        showLineNumbers
        {...props}
        className="rounded-md [&>code]:bg-transparent [&>code]:p-2 [&>code]:rounded-md [&_.linenumber]:select-none"
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <Badge variant="pre" className="font-mono rounded-md text-sm">
        {children}
      </Badge>
    );
  },
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return <pre className={cn("bg-transparent p-0", className)} {...props} />;
  },
  img: ({ src, alt }: { src?: string | Blob; alt?: string }) => {
    const imageUrl = src
      ? typeof src === "string"
        ? src
        : URL.createObjectURL(src)
      : "";
    return (
      <Image
        src={imageUrl}
        alt={alt || ""}
        className="mb-4 h-auto w-full rounded-md"
        width={1000}
        height={1000}
      />
    );
  },
  h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className={cn("mb-2 font-bold text-2xl", className)}>{children}</h2>
  ),
  h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className={cn("mb-1 font-bold text-xl", className)}>{children}</h3>
  ),
  h4: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className={cn("mb-1 font-bold text-lg", className)}>{children}</h4>
  ),
  h5: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 {...props} className={cn("mb-1 font-bold text-base", className)}>{children}</h5>
  ),
  h6: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 {...props} className={cn("mb-1 font-bold text-sm", className)}>{children}</h6>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <Table className="rounded-md">{children}</Table>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <TableHeader className="bg-muted first:rounded-t-md">
      {children}
    </TableHeader>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <TableBody className="[&>tr:nth-child(even)]:bg-muted/50">
      {children}
    </TableBody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <TableRow className="border-border group">{children}</TableRow>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <TableCell className="border-r border-border last:border-r-0 group-last:first:rounded-bl-md group-last:last:rounded-br-md">
      {children}
    </TableCell>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <TableHead className="font-bold  border-r border-border last:border-r-0 first:rounded-tl-md last:rounded-tr-md">
      {children}
    </TableHead>
  ),
};

export { components };
