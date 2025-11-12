"use client";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import PageViews from "@/components/page-views"; // PageViews 컴포넌트 임포트

export default function Header() {
  return (
    <header className="border-b fixed top-0 left-0 w-full z-50 bg-background">
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-3 text-xl font-bold text-foreground"
            >
              <Image
                src="/my-avatar.png"
                alt="Profile Avatar"
                width={32}
                height={32}
                className="rounded-full border border-primary/30"
              />
              KJH's Dev Log
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex items-center gap-4"> {/* gap-4 추가 */}
            <PageViews /> {/* 방문자 수 컴포넌트 추가 */}
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
