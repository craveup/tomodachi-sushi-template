"use client";

import ReviewsSection from "@/components/crave-ui/review-components/reviews-section";
import { useState } from "react";

export default function ReviewsSectionDemo() {
  const [reviews] = useState([
    {
      id: "1",
      customerName: "Sarah Johnson",
      customerAvatar: "/avatars/sarah.jpg",
      rating: 5,
      date: "2024-01-22",
      title: "Outstanding Experience!",
      content:
        "The food was absolutely incredible! The Karaage Chicken Katsu Sando was cooked to perfection with the perfect balance of crispy and tender. The service was fast and friendly. Will definitely be ordering again!",
      verified: true,
      helpful: 18,
      orderItems: [
        "Karaage Chicken Katsu Sando",
        "Sweet Potato Fries",
        "Green Tea Latte",
      ],
      photos: [
        "/images/food/karaage-chicken-katsu-sando.jpg",
        "/images/food/wagyu-tataki.jpg",
      ],
    },
    {
      id: "2",
      customerName: "Mike Chen",
      customerAvatar: "/avatars/mike.jpg",
      rating: 4,
      date: "2024-01-20",
      title: "Great Food, Minor Issues",
      content:
        "Really enjoyed the fusion flavors. The ramen was authentic and the portion size was generous. Delivery took a bit longer than expected, but the food arrived hot and well-packaged.",
      verified: true,
      helpful: 12,
      orderItems: ["Tonkotsu Ramen", "Gyoza", "Miso Soup"],
    },
    {
      id: "3",
      customerName: "Emma Wilson",
      rating: 5,
      date: "2024-01-18",
      content:
        "Amazing quality and taste! The attention to detail in presentation was impressive. Every dish felt carefully crafted. The online ordering process was smooth and user-friendly.",
      verified: false,
      helpful: 9,
      orderItems: ["Chirashi Bowl", "Miso Salmon", "Edamame"],
    },
    {
      id: "4",
      customerName: "David Rodriguez",
      customerAvatar: "/avatars/david.jpg",
      rating: 3,
      date: "2024-01-15",
      title: "Decent but Room for Improvement",
      content:
        "The food was okay but not exceptional. The flavors were good but some items were a bit cold when they arrived. Customer service was responsive when I called about the issue.",
      verified: true,
      helpful: 5,
      orderItems: ["Beef Teriyaki", "Vegetable Tempura", "Jasmine Rice"],
    },
    {
      id: "5",
      customerName: "Lisa Park",
      rating: 5,
      date: "2024-01-12",
      title: "New Favorite Restaurant!",
      content:
        "Absolutely love this place! The fusion of Japanese and modern cuisine is brilliant. Fresh ingredients, creative presentations, and excellent execution. The spicy tuna roll was the best I've had in the city.",
      verified: true,
      helpful: 22,
      orderItems: ["Spicy Tuna Roll", "Dragon Roll", "Seaweed Salad"],
      photos: ["/images/food/uni-carbonara.jpg"],
    },
    {
      id: "6",
      customerName: "James Thompson",
      rating: 4,
      date: "2024-01-10",
      content:
        "Solid choice for Japanese food. The quality is consistent and the prices are reasonable. The bento box was well-balanced with a good variety of items. Will order again.",
      verified: false,
      helpful: 7,
      orderItems: ["Chicken Teriyaki Bento", "Miso Soup", "Green Tea"],
    },
    {
      id: "7",
      customerName: "Anna Kim",
      customerAvatar: "/avatars/anna.jpg",
      rating: 2,
      date: "2024-01-08",
      title: "Disappointed",
      content:
        "Unfortunately, this order didn't meet expectations. The sushi rice was too dry and the fish didn't taste fresh. The delivery was also delayed by 45 minutes without notification.",
      verified: true,
      helpful: 3,
      orderItems: ["Salmon Sashimi", "California Roll", "Wasabi"],
    },
    {
      id: "8",
      customerName: "Robert Lee",
      rating: 5,
      date: "2024-01-05",
      title: "Exceptional Quality",
      content:
        "This is what authentic Japanese cuisine should taste like. The chef clearly knows what they're doing. Every element of the meal was perfect, from the appetizers to the main course.",
      verified: true,
      helpful: 15,
      orderItems: ["Kaiseki Tasting Menu", "Sake Pairing", "Matcha Ice Cream"],
    },
  ]);

  const ratingDistribution = {
    5: 4,
    4: 2,
    3: 1,
    2: 1,
    1: 0,
  };

  const overallRating = 4.3;
  const totalReviews = 8;

  const handleLoadMore = () => {
    console.log("Loading more reviews...");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ReviewsSection
        reviews={reviews}
        overallRating={overallRating}
        totalReviews={totalReviews}
        ratingDistribution={ratingDistribution}
        showPhotos={true}
        showHelpful={true}
        maxReviews={5}
        onLoadMore={handleLoadMore}
        isLoading={false}
      />
    </div>
  );
}
