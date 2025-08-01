"use client";

import * as React from "react";
import type { ComponentInfo } from "../types";
import { getHardcodedDemo } from "../hardcoded-demos";

interface UseComponentLoaderResult {
  Component: React.ComponentType | null;
  componentCode: string;
  isLoading: boolean;
  error: string | null;
}

export function useComponentLoader(name?: string): UseComponentLoaderResult {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(
    null
  );
  const [componentCode, setComponentCode] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!name) {
      setComponent(null);
      setComponentCode("");
      return;
    }

    let cancelled = false;

    const loadComponent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First check hardcoded demos
        const hardcodedDemo = getHardcodedDemo(name);
        if (hardcodedDemo) {
          if (!cancelled) {
            setComponent(() => hardcodedDemo.component);
            setComponentCode(hardcodedDemo.code);
            setIsLoading(false);
          }
          return;
        }

        // Then try to load from the component registry
        const { Index } = await import("@/config/components");
        const componentInfo: ComponentInfo = Index[name as keyof typeof Index];

        if (!componentInfo) {
          if (!cancelled) {
            setError(`Component "${name}" not found`);
          }
          return;
        }

        // Load the component module
        // componentInfo.component is already a lazy loaded React component
        const LazyComponent = componentInfo.component;

        if (!cancelled) {
          setComponent(() => LazyComponent);
          setComponentCode(componentInfo.source || "");
        }
      } catch (err) {
        console.error("Failed to load component:", err);
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load component"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      cancelled = true;
    };
  }, [name]);

  return { Component, componentCode, isLoading, error };
}
