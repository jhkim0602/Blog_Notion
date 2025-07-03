"use client";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

export default function Header() {
  const scrollDir = useScrollDirection();

  return (
    <header
      className={`
        border-b fixed top-0 left-0 w-full z-50 bg-background transition-transform duration-300
        ${scrollDir === "down" ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-foreground"
            >
              KJH's Dev Log
            </Link>
          </div>
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
