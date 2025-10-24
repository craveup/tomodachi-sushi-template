"use client";

import { CheckCircle, Clock, MapPin, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LeclercConfirmationPage() {
  const orderNumber = `LB${Math.floor(Math.random() * 100000)}`;
  const estimatedTime = "25-35 minutes";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <h1
              className="text-2xl font-bold"
              style={{ color: "hsl(var(--brand-accent))" }}
            >
              LECLERC
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your order. Your cookies are being prepared with
              love.
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
                <Package
                  className="h-8 w-8"
                  style={{ color: "hsl(var(--brand-accent))" }}
                />
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
                    <span>2x Chocolate Chip Walnut</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground">
                    <span>1x Dark Chocolate Chocolate Chip</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground">
                    <span>1x Pumpkin Spice (Warmed)</span>
                    <span>$5.50</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>$20.50</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>$1.82</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span style={{ color: "hsl(var(--brand-accent))" }}>
                      $22.32
                    </span>
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
                className="text-white dark:text-white hover:opacity-90"
                style={{
                  backgroundColor: "hsl(var(--brand-accent))",
                  borderColor: "hsl(var(--brand-accent))",
                }}
              >
                Track Order Status
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/examples/leclerc-bakery">
              <Button variant="outline" className="w-full sm:w-auto">
                Order More Cookies
              </Button>
            </Link>
            <Button className="w-full sm:w-auto">View Receipt</Button>
          </div>

          {/* Support */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>Need help with your order?</p>
            <p
              className="font-medium"
              style={{ color: "hsl(var(--brand-accent))" }}
            >
              Call us at (212) 874-6080 or email support@leclercbakery.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
