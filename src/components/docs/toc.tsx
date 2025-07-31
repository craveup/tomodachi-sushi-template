"use client";

import * as React from "react";
import { getTableOfContents } from "@/lib/toc";
import { cn } from "@/lib/utils";

interface TableOfContentsItem {
  title: string;
  url: string;
  items?: TableOfContentsItem[];
}

interface TableOfContents {
  items: TableOfContentsItem[];
}

interface TocProps {
  toc: TableOfContents;
}

export function DashboardTableOfContents({ toc }: TocProps) {
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const tocItem = document.querySelector(`a[href="#${id}"]`);
            if (tocItem) {
              document
                .querySelectorAll(".toc-item")
                .forEach((item) => item.classList.remove("font-medium"));
              tocItem.classList.add("font-medium");
            }
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    const headings = document.querySelectorAll("h2, h3, h4");
    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      headings.forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, []);

  function isActive(id: string): boolean {
    if (!id) return false;
    const element = document.getElementById(id.substring(1));
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= window.innerHeight * 0.4;
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <Tree toc={toc} />
    </div>
  );
}

function Tree({ toc }: { toc: TableOfContents }) {
  return (
    <div className="space-y-2 text-sm">
      {toc.items?.map((item: TableOfContentsItem, index: number) => (
        <div key={index} className="space-y-2">
          <Link href={item.url} level={1}>
            {item.title}
          </Link>
          {item.items && item.items.length > 0 && (
            <div className="ml-4 space-y-2">
              {item.items.map(
                (subItem: TableOfContentsItem, subIndex: number) => (
                  <Link key={subIndex} href={subItem.url} level={2}>
                    {subItem.title}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface LinkProps {
  href: string;
  level: 1 | 2;
  children: React.ReactNode;
}

function Link({ href, level, children }: LinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "toc-item block text-muted-foreground hover:text-foreground",
        level === 2 && "text-xs"
      )}
    >
      {children}
    </a>
  );
}
