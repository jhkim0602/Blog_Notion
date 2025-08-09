"use client";

import { useEffect, useMemo, useState } from "react";
import { slugify } from "@/lib/markdown";

type HeadingItem = {
  id: string;
  text: string;
  level: number;
};

export default function Toc() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-article]");
    if (!article) return;

    const collect = () => {
      const all = Array.from(
        article.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")
      );

      // 아이디가 없는 헤딩은 텍스트로 슬러그를 생성해 부여 (안정적 TOC)
      all.forEach((el) => {
        if (!el.id) {
          const text = el.textContent || "";
          const id = slugify(text);
          if (id) el.id = id;
        }
      });

      const elements = all.filter((el) => el.id);

      const mapped: HeadingItem[] = elements.map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: Number(el.tagName.replace("H", "")),
      }));
      setHeadings(mapped);

      io.disconnect();
      elements.forEach((el) => io.observe(el));
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: [0, 1.0] }
    );

    const mo = new MutationObserver(() => collect());
    mo.observe(article, { childList: true, subtree: true });
    collect();

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  const items = useMemo(() => headings, [headings]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <ul className="space-y-1 relative">
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-border" />
        {items.map((h) => (
          <li key={h.id} className={"truncate"}>
            <a
              href={`#${h.id}`}
              className={
                "group relative block truncate pl-3 py-1 rounded-md transition-colors " +
                (activeId === h.id
                  ? "text-foreground bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60")
              }
              style={{ paddingLeft: (h.level - 1) * 12 }}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (!el) return;
                const y = el.getBoundingClientRect().top + window.scrollY - 80; // header offset
                window.scrollTo({ top: y, behavior: "smooth" });
                history.replaceState(null, "", `#${h.id}`);
              }}
            >
              <span className="relative z-10">{h.text}</span>
              {activeId === h.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-full" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

