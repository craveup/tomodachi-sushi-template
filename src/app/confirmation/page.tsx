"use client";

import { CheckCircle, Clock, MapPin, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TomodachiConfirmationPage() {
  const orderNumber = `TS${Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")}`;
  const estimatedTime = "35-45 minutes";
  const accentColor = "var(--backgroundprimary)";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <h1 className="text-2xl font-bold tracking-[0.6em] text-textdefault">
              TOMODACHI SUSHI
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="mb-8 text-center">
            <CheckCircle
              className="mx-auto mb-4 h-16 w-16"
              style={{ color: accentColor }}
            />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Thank you for dining with Tomodachi Sushi. Our chefs are now
              preparing your order with the freshest ingredients.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Order #{orderNumber}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleString()}
                  </p>
                </div>
                <Package className="h-8 w-8" style={{ color: accentColor }} />
              </div>

              <Separator className="mb-6" />

              {/* Delivery Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      Estimated Delivery
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {estimatedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      Delivery Address
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      123 Main St, Apt 4B
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Order Summary */}
              <div>
                <h3 className="font-medium mb-3 text-foreground">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-foreground">
                    <span>2x Bluefin Toro Nigiri</span>
                    <span>$24.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground">
                    <span>1x Miso Black Cod</span>
                    <span>$18.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground">
                    <span>1x Spicy Tuna Roll</span>
                    <span>$14.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>$56.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>$4.76</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span style={{ color: accentColor }}>$60.76</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Track Order Card */}
          <Card className="mb-8 bg-muted/30">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2 text-foreground">
                Track Your Order
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We&apos;ll send you updates via text message
              </p>
              <Button
                className="text-textinverse hover:opacity-90"
                style={{ backgroundColor: accentColor, borderColor: accentColor }}
              >
                Track Order Status
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button variant="outline" className="w-full sm:w-auto">
                Explore Menu
              </Button>
            </Link>
            <Button
              className="w-full sm:w-auto"
              style={{ backgroundColor: accentColor, color: "var(--textinverse)" }}
            >
              View Receipt
            </Button>
          </div>

          {/* Support */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>Need help with your order?</p>
            <p className="font-medium" style={{ color: accentColor }}>
              Call us at (212) 555-0112 or email reservations@tomodachisushi.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
