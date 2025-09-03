"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";

const ThankYouContent = () => {
  const searchParams = useSearchParams();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const displayName = searchParams.get("displayName") || "Tomodachi Sushi";
  const locationId = searchParams.get("locationId");
  const cartId = searchParams.get("cartId");

  useEffect(() => {
    // Clear cart from localStorage since order is complete
    if (typeof window !== "undefined") {
      localStorage.removeItem("tomodachi-cart-items");
      localStorage.removeItem("tomodachi-cart-id");
      localStorage.removeItem("crave_cart_data");
    }
  }, []);

  const handleRatingClick = (value: number) => {
    setRating(value);
    // Here you would send the rating to your API
    console.log(`Rating submitted: ${value} stars`);
  };

  return (
    <div className="min-h-screen bg-backgrounddefault">
      <main className="py-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="space-y-8">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            {/* Thank You Message */}
            <div>
              <h1 className="font-heading-h1 text-textdefault text-3xl lg:text-4xl tracking-wider mb-4">
                ありがとうございます
              </h1>

              <h2 className="font-heading-h3 text-textdefault text-2xl tracking-wider mb-4">
                THANK YOU FOR YOUR ORDER!
              </h2>

              <p className="font-text-meta text-textmuted text-lg tracking-wider mb-2">
                Your order from {displayName} has been confirmed.
              </p>

              <p className="font-text-meta text-textmuted tracking-wider">
                We&apos;ll send you updates about your order via email and SMS.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-backgroundmuted rounded-2xl p-6 border border-borderdefault">
              <h2 className="font-heading-h4 text-textdefault text-xl tracking-wider mb-4">
                ORDER DETAILS
              </h2>

              <div className="space-y-3 font-text-meta text-sm tracking-wider">
                <div className="flex justify-between">
                  <span className="text-textmuted">Order ID:</span>
                  <span className="font-mono text-textdefault">
                    {cartId?.slice(-8).toUpperCase() ||
                      "TD-" +
                        Math.random().toString(36).substr(2, 6).toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-textmuted">Restaurant:</span>
                  <span className="text-textdefault">{displayName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-textmuted">Estimated Time:</span>
                  <span className="text-textdefault">25-30 minutes</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-textmuted">Order Type:</span>
                  <span className="text-textdefault">Pickup</span>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-backgrounddefault border border-borderdefault rounded-2xl p-6">
              <h2 className="font-heading-h4 text-textdefault text-xl tracking-wider mb-4">
                RATE YOUR EXPERIENCE
              </h2>

              <p className="font-text-meta text-textmuted tracking-wider mb-4">
                How was your ordering experience?
              </p>

              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-colors"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-textmuted"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <p className="font-text-meta text-sm text-green-600 tracking-wider">
                  Thank you for your {rating}-star rating!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="w-full">
                <Button
                  size="lg"
                  className="w-full h-14 font-heading-h6 tracking-wider bg-backgroundprimary hover:bg-backgroundprimary/90 text-textinverse rounded-2xl"
                >
                  PLACE ANOTHER ORDER
                </Button>
              </Link>

              <Link href="/menu" className="w-full">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 font-heading-h6 tracking-wider border-borderdefault text-textdefault hover:bg-backgroundmuted rounded-2xl"
                >
                  BROWSE MENU
                </Button>
              </Link>
            </div>

            {/* Footer Message */}
            <div className="text-center pt-8 border-t border-borderdefault">
              <p className="font-text-meta text-sm text-textmuted tracking-wider">
                Questions about your order? Contact us at{" "}
                <a
                  href="mailto:support@tomodachi.com"
                  className="text-backgroundprimary hover:underline"
                >
                  support@tomodachi.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ThankYouPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
};

export default ThankYouPage;
