"use client";

import { cn } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";

interface RatingDisplayProps {
  rating?: string | number;
  reviewCount?: string | number;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showIcon?: boolean;
}

export function RatingDisplay({
  rating,
  reviewCount,
  className,
  iconClassName,
  textClassName,
  showIcon = true,
}: RatingDisplayProps) {
  if (!rating) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showIcon && <ThumbsUp className={cn("h-3.5 w-3.5", iconClassName)} />}
      <span className={cn("text-sm text-muted-foreground", textClassName)}>
        {rating}
        {reviewCount && ` (${reviewCount})`}
      </span>
    </div>
  );
}

export default RatingDisplay;
