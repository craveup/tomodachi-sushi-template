"use client";

import Link from "next/link";
// Temporary fix: Define Doc type locally to avoid import errors
type Doc = {
  slug: string;
  title: string;
};
// import { Doc } from "contentlayer2/generated";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface DocsPagerProps {
  doc: Doc;
}

export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc);

  if (!pager) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev ? (
        <Link
          href={pager.prev.slug}
          className={cn(buttonVariants({ variant: "ghost" }), "h-full")}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          {pager.prev.title}
        </Link>
      ) : (
        <div />
      )}
      {pager?.next && (
        <Link
          href={pager.next.slug}
          className={cn(buttonVariants({ variant: "ghost" }), "h-full ml-auto")}
        >
          {pager.next.title}
          <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function getPagerForDoc(doc: Doc) {
  const flattenedDocs = getFlattenedDocs();
  const currentIndex = flattenedDocs.findIndex((d) => d.slug === doc.slug);

  if (currentIndex === -1) {
    return null;
  }

  const prev = flattenedDocs[currentIndex - 1];
  const next = flattenedDocs[currentIndex + 1];

  return {
    prev: prev ? { title: prev.title, slug: prev.slug } : null,
    next: next ? { title: next.title, slug: next.slug } : null,
  };
}

export function getFlattenedDocs() {
  // Temporary fix: return empty array to prevent import errors
  // TODO: Fix Contentlayer configuration
  return [] as Doc[];

  /* Original code - disabled until Contentlayer is fixed:
  const { allDocs } = require(".contentlayer/generated");
  const docs = [...allDocs] as Doc[];

  return docs.sort((a, b) => {
    return a.slug.localeCompare(b.slug);
  });
  */
}
