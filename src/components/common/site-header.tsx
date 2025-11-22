"use client";
import Link from "next/link";
import Image from "next/image";
import GradientText from "@/components/ui-effects/gradient-text";
import { ModeToggle } from "@/components/common/mode-toggle";
import PageViews from "@/components/common/page-views"; // PageViews 컴포넌트 임포트

export default function Header() {
  return (
    <header className="border-b fixed top-0 left-0 w-full z-50 bg-background">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 md:h-16 md:py-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold whitespace-nowrap"
            >
              <Image
                src="/my-avatar.png"
                alt="Profile Avatar"
                width={32}
                height={32}
                className="rounded-full bg-transparent"
                priority
              />
              <GradientText className="mx-0 inline-flex rounded-none bg-transparent p-0 font-bold text-base sm:text-xl whitespace-nowrap">
                KJH's Dev Log
              </GradientText>
            </Link>
            <Link
              href="/about"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <PageViews />
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
