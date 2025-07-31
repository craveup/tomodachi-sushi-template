"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface PreviewContainerProps {
  children: React.ReactNode;
  align?: "center" | "start" | "end";
  minHeight?: string;
}

export function PreviewContainer({
  children,
  align = "center",
  minHeight = "min-h-[500px]",
}: PreviewContainerProps) {
  const alignmentClasses = {
    center: "items-center justify-center",
    start: "items-start justify-start",
    end: "items-end justify-end",
  };

  return (
    <div
      className={cn(
        "preview flex w-full p-10 bg-muted/30",
        minHeight,
        alignmentClasses[align]
      )}
    >
      {children}
    </div>
  );
}
