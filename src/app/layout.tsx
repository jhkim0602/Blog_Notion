import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";
import "@/styles/notion.css";
import Layout from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";
import "katex/dist/katex.min.css";

const ibmPlexSansKR = IBM_Plex_Sans_KR({ 
  subsets: ["latin"], 
  weight: ["100", "200", "300", "400", "500", "600", "700"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://junghwan.blog";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "정환이의 개발 블로그",
    template: `%s | 김정환의 개발 블로그`,
  },
  description:
    "코딩, 프로그래밍, 기술에 대한 생각과 경험의 성장을 공유하는 개발 블로그입니다.",
  keywords: [
    "개발블로그",
    "기술블로그",
    "프로그래밍",
    "코딩",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "개발자",
    "프론트엔드",
    "백엔드",
    "웹 개발",
    "소프트웨어 개발",
    "기술",
    "IT",
  ],
  verification: {
    google: "yY-qORard3SBo58pyL3Hf0ecTZPtibQDI24Z-XOlII8",
  },
  openGraph: {
    title: "정환이의 개발 블로그",
    description:
      "코딩, 프로그래밍, 기술에 대한 생각과 경험을 공유하는 개발 블로그입니다.",
    url: siteUrl,
    siteName: "정환이의 개발 블로그",
    images: [
      {
        url: `${siteUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "정환이의 개발 블로그",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteUrl}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //Seo 최적화 lang="ko"로 변경
    <html lang="ko" suppressHydrationWarning>
      <body className={ibmPlexSansKR.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
