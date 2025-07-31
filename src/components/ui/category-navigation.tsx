import { cn } from "@/lib/utils";
import * as React from "react";

export interface MenuCategory {
  id: string;
  name: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface CategoryNavigationProps {
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sticky?: boolean;
  stickyTop?: string;
  className?: string;
  showCounts?: boolean;
}

export function CategoryNavigation({
  categories,
  selectedCategory,
  onCategoryChange,
  sticky = true,
  stickyTop = "top-20",
  className,
  showCounts = true,
}: CategoryNavigationProps) {
  const [isStuck, setIsStuck] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sticky || !navRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      {
        threshold: 1,
        rootMargin: "-1px 0px 0px 0px",
      }
    );

    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "-1px";
    sentinel.style.left = "0";
    sentinel.style.right = "0";
    sentinel.style.height = "1px";
    navRef.current.parentElement?.insertBefore(sentinel, navRef.current);

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [sticky]);

  const scrollbarHideStyles = {
    msOverflowStyle: "none" as const,
    scrollbarWidth: "none" as const,
    WebkitOverflowScrolling: "touch" as const,
  };

  return (
    <div
      ref={navRef}
      className={cn(
        "bg-background/95 backdrop-blur border-b transition-shadow duration-200",
        sticky && stickyTop,
        sticky && "sticky z-20",
        isStuck && "shadow-sm",
        className
      )}
    >
      <div
        className="flex gap-6 overflow-x-auto text-sm font-medium text-muted-foreground scrollbar-hide"
        style={scrollbarHideStyles}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "relative py-4 px-1 whitespace-nowrap transition-all flex items-center gap-2",
              selectedCategory === category.id
                ? "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-foreground"
                : "hover:text-foreground"
            )}
          >
            {category.icon && (
              <span className="flex-shrink-0">{category.icon}</span>
            )}
            <span>
              {category.name}
              {showCounts && category.count !== undefined && (
                <span className="ml-1">({category.count})</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
