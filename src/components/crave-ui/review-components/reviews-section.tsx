"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  date: string;
  title?: string;
  content: string;
  verified?: boolean;
  helpful?: number;
  orderItems?: string[];
  photos?: string[];
}

interface ReviewsSectionProps {
  reviews: Review[];
  overallRating?: number;
  totalReviews?: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  className?: string;
  showPhotos?: boolean;
  showHelpful?: boolean;
  maxReviews?: number;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function ReviewsSection({
  reviews,
  overallRating = 4.5,
  totalReviews = 0,
  ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  className,
  showPhotos = true,
  showHelpful = true,
  maxReviews,
  onLoadMore,
  isLoading = false,
}: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const displayedReviews = reviews
    .filter((review) => (filterRating ? review.rating === filterRating : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    })
    .slice(0, maxReviews || reviews.length);

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/50"
            )}
          />
        ))}
      </div>
    );
  };

  const getRatingPercentage = (rating: number) => {
    const total = Object.values(ratingDistribution).reduce(
      (sum, count) => sum + count,
      0
    );
    return total > 0
      ? (ratingDistribution[rating as keyof typeof ratingDistribution] /
          total) *
          150
      : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Reviews Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {totalReviews > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              {renderStars(Math.round(overallRating), "md")}
              <div className="flex items-center  gap-1">
                <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {overallRating}
                </span>
                <span className="text-sm mt-2 text-muted-foreground">
                  ({totalReviews} reviews)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        {Object.values(ratingDistribution).some((count) => count > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const getRatingColor = (rating: number) => {
                  switch (rating) {
                    case 5:
                      return "bg-green-500";
                    case 4:
                      return "bg-blue-500";
                    case 3:
                      return "bg-yellow-500";
                    case 2:
                      return "bg-red-500";
                    case 1:
                      return "bg-red-500";
                    default:
                      return "bg-gray-400";
                  }
                };

                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[3rem]">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`${getRatingColor(
                            rating
                          )} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${getRatingPercentage(rating)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground min-w-[1.5rem] text-right">
                      {
                        ratingDistribution[
                          rating as keyof typeof ratingDistribution
                        ]
                      }
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Filter by Rating</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterRating === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRating(null)}
                  className="rounded-full px-4 font-medium"
                >
                  All
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filterRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRating(rating)}
                    className="flex items-center gap-1 rounded-full px-3 font-medium"
                  >
                    {rating} <Star className="w-3 h-3 fill-current" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-muted/30 rounded-lg">
          <span className="text-sm font-medium text-foreground mt-2">
            Sort by:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "highest", label: "Highest Rated" },
              { value: "lowest", label: "Lowest Rated" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option.value as typeof sortBy)}
                className="rounded-full px-4 font-medium"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No reviews match your criteria.
            </p>
          </div>
        ) : (
          displayedReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {review.customerAvatar ? (
                        <Image
                          src={review.customerAvatar}
                          alt={review.customerName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-sm font-medium text-primary">
                          {getInitials(review.customerName)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                        <h4 className="font-medium">{review.customerName}</h4>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs p-1">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating, "sm")}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Review Title */}
                {review.title && (
                  <h5 className="font-medium">{review.title}</h5>
                )}

                {/* Review Content */}
                <p className="text-sm leading-relaxed">{review.content}</p>

                {/* Order Items */}
                {review.orderItems && review.orderItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Items ordered:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {review.orderItems.map((item, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs p-2"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Photos */}
                {showPhotos && review.photos && review.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 max-w-sm">
                    {review.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Actions */}
                {showHelpful && (
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-sm text-muted-foreground">
                      Was this helpful?
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        Yes {review.helpful && `(${review.helpful})`}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ThumbsDown className="w-3 h-3" />
                        No
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button */}
      {onLoadMore && (maxReviews ? reviews.length > maxReviews : false) && (
        <div className="text-center">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
            className="w-full max-w-sm"
          >
            {isLoading ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  );
}
