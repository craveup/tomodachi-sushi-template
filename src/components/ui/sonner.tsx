"use client";

import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const STORAGE_KEY = "tomodachi-theme";

const Toaster = ({ theme, ...props }: ToasterProps) => {
  const [resolvedTheme, setResolvedTheme] =
    useState<NonNullable<ToasterProps["theme"]>>("light");

  useEffect(() => {
    if (typeof window === "undefined") {
      if (theme) {
        setResolvedTheme(theme);
      }
      return;
    }

    if (theme) {
      setResolvedTheme(theme);
      return;
    }

    const root = document.documentElement;
    const detectTheme = () => {
      setResolvedTheme(root.classList.contains("dark") ? "dark" : "light");
    };

    detectTheme();

    const observer = new MutationObserver(detectTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY)) return;
      } catch (error) {
        // Swallow storage access errors and fall back to system preference.
      }
      detectTheme();
    };

    media.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", handleMediaChange);
    };
  }, [theme]);

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
