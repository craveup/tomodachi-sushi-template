"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "tomodachi-theme";

type ThemeToggleProps = {
  className?: string;
  variant?: "icon" | "compact";
};

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const apply = (next: boolean) => {
      root.classList.toggle("dark", next);
      root.dataset.theme = next ? "dark" : "light";
      setIsDark(next);
    };

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      stored = null;
    }
    if (stored === "dark" || stored === "light") {
      apply(stored === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      apply(prefersDark);
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY)) return;
      } catch (error) {
        // ignore storage access errors
      }
      apply(event.matches);
    };

    media.addEventListener("change", handleMediaChange);
    return () => media.removeEventListener("change", handleMediaChange);
  }, []);

  const toggleTheme = () => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    root.dataset.theme = next ? "dark" : "light";
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch (error) {
      // ignore storage write errors
    }
    setIsDark(next);
  };

  const resetToSystem = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // ignore storage write errors
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const root = document.documentElement;
    root.classList.toggle("dark", prefersDark);
    root.dataset.theme = prefersDark ? "dark" : "light";
    setIsDark(prefersDark);
  };

  const resolvedDark = isDark ?? false;
  const size = variant === "icon" ? "icon" : "sm";

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      aria-label={resolvedDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      onContextMenu={(event) => {
        event.preventDefault();
        resetToSystem();
      }}
      className={cn(
        "relative flex items-center justify-center border-borderdefault bg-backgroundmuted/60 hover:bg-backgroundmuted/80",
        variant === "icon" ? "h-[44px] w-[44px] rounded-lg" : "rounded-lg px-3 py-2",
        className,
      )}
    >
      <Sun
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200",
          resolvedDark ? "scale-0" : "scale-100",
        )}
      />
      <Moon
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200",
          resolvedDark ? "scale-100" : "scale-0",
        )}
      />
    </Button>
  );
}
