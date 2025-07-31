"use client";

import type React from "react";

import { Star } from "lucide-react";

interface ReviewCardProps {
  userName?: string;
  userInitial?: string;
  userColor?: string;
  rating?: number;
  date?: string;
  orderType?: string;
  comment?: string;
  highlightedItems?: string[];
}

export default function ReviewCard({
  userName = "Rodolfo C",
  userInitial = "R",
  userColor = "#E8C500",
  rating = 5,
  date = "2/15/24",
  orderType = "DoorDash order",
  comment = "the egg tarts are amazing! all 3 kinds.",
  highlightedItems = [],
}: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className="w-3 h-3 fill-foreground text-foreground" />
    ));
  };

  const renderComment = (comment: string, highlightedItems: string[]) => {
    if (!highlightedItems || highlightedItems.length === 0) {
      return (
        <span className="text-foreground text-sm leading-relaxed">
          {comment}
        </span>
      );
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    highlightedItems.forEach((item, itemIndex) => {
      const itemStartIndex = comment.indexOf(item, lastIndex);
      if (itemStartIndex !== -1) {
        // Add text before the highlighted item
        if (itemStartIndex > lastIndex) {
          parts.push(
            <span
              key={`text-${lastIndex}`}
              className="text-foreground text-sm leading-relaxed"
            >
              {comment.slice(lastIndex, itemStartIndex)}
            </span>
          );
        }
        // Add the highlighted item
        parts.push(
          <button
            key={`highlight-${itemIndex}`}
            className="text-primary hover:text-primary/80 underline text-sm font-medium"
            role="button"
          >
            {item}
          </button>
        );
        lastIndex = itemStartIndex + item.length;
      }
    });

    // Add remaining text
    if (lastIndex < comment.length) {
      parts.push(
        <span
          key={`text-${lastIndex}`}
          className="text-foreground text-sm leading-relaxed"
        >
          {comment.slice(lastIndex)}
        </span>
      );
    }

    return <span>{parts}</span>;
  };

  return (
    <div className="space-y-3">
      {/* User Info Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3" tabIndex={0} role="button">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: userColor }}
            >
              <span data-testid="generated-profile-display-name">
                {userInitial}
              </span>
            </div>
            {/* User Name */}
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="font-medium text-foreground text-sm">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating and Date Row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">{renderStars(rating)}</div>
          <span className="text-muted-foreground text-sm">{date}</span>
        </div>
        <span className="text-muted-foreground text-sm">• {orderType}</span>
      </div>

      {/* Comment */}
      <div className="max-w-3xl">
        <div className="text-sm">
          {renderComment(comment, highlightedItems)}
        </div>
      </div>
    </div>
  );
}
