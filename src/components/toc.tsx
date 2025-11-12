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
        article.querySelectorAll<HTMLElement>("h2, h3, h4, h5, h6")
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
    <nav aria-label="Table of contents" className="w-full pl-4 border-l border-gray-200 dark:border-gray-800">
      {/* Header */}
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
        on this page
      </h2>
      
      {/* Items List */}
      <ul className="space-y-1">
        {items.map((h: HeadingItem) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={
                "block text-sm transition-colors duration-200 " +
                (activeId === h.id
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300")
              }
              style={{ 
                paddingLeft: h.level === 2 ? "0px" : h.level === 3 ? "12px" : `${(h.level - 2) * 12}px`,
                paddingTop: "4px",
                paddingBottom: "4px"
              }}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (!el) return;
                const y = el.getBoundingClientRect().top + window.scrollY - 80; // header offset
                window.scrollTo({ top: y, behavior: "smooth" });
                history.replaceState(null, "", `#${h.id}`);
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

