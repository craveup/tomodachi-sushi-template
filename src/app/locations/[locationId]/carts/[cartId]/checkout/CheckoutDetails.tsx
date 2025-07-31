"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft, MapPin, Clock, Check, Shield } from "lucide-react";
import { updateOrderTime, applyPromoCode } from "@/lib/api/cart";
import useCartData from "@/app/hooks/use-cart-data";

const CheckoutDetails = () => {
  const router = useRouter();
  const { locationId, cartId } = useParams();
  const { data, isLoading } = useCartData();
  const [orderType, setOrderType] = useState("delivery");
  const [selectedTime, setSelectedTime] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  useEffect(() => {
    if (data?.fulfillmentMethod) {
      setOrderType(
        data.fulfillmentMethod === "takeout" ? "pickup" : data.fulfillmentMethod
      );
    }
  }, [data?.fulfillmentMethod]);

  // Generate time slots like real delivery apps
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();

    // Store hours: 9 AM to 9 PM
    const storeOpenHour = 9;
    const storeCloseHour = 21;

    // Minimum preparation time (30 minutes for delivery, 15 for pickup)
    const prepTime = orderType === "delivery" ? 30 : 15;
    const earliestTime = new Date(now.getTime() + prepTime * 60000);

    // Generate slots for today and next 6 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(now);
      date.setDate(date.getDate() + dayOffset);

      let startHour = storeOpenHour;
      let startMinute = 0;

      // For today, start from the earliest available time
      if (dayOffset === 0) {
        if (earliestTime.getHours() >= storeCloseHour) {
          continue; // Skip today if store is closed
        }
        startHour = Math.max(storeOpenHour, earliestTime.getHours());
        startMinute =
          earliestTime.getHours() === startHour
            ? Math.ceil(earliestTime.getMinutes() / 15) * 15
            : 0;
      }

      // Generate 15-minute intervals
      for (let hour = startHour; hour < storeCloseHour; hour++) {
        const startMin = hour === startHour ? startMinute : 0;

        for (let minute = startMin; minute < 60; minute += 15) {
          const slotTime = new Date(date);
          slotTime.setHours(hour, minute, 0, 0);

          // Only add if it's in the future
          if (slotTime > now) {
            const isToday = dayOffset === 0;
            const isTomorrow = dayOffset === 1;

            let dayLabel = "";
            if (isToday) {
              dayLabel = "Today";
            } else if (isTomorrow) {
              dayLabel = "Tomorrow";
            } else {
              dayLabel = slotTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              });
            }

            slots.push({
              value: slotTime.toISOString(),
              label: `${dayLabel}, ${slotTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}`,
              date: slotTime.toDateString(),
              time: slotTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              dayOffset,
            });
          }
        }
      }
    }

    return slots.slice(0, 20); // Show next 20 available slots
  };

  // Regenerate time slots when order type changes
  const timeSlots = useMemo(() => generateTimeSlots(), [orderType]);

  // Clear selected time when switching order types
  const handleOrderTypeChange = (newType: string) => {
    setOrderType(newType);
    setSelectedTime(""); // Clear selection since times are different
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    try {
      await applyPromoCode(locationId as string, cartId as string, promoCode);
      // The cart data should be refetched automatically by SWR
    } catch (error) {
      console.error("Failed to apply promo code:", error);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleContinueToPayment = () => {
    if (selectedTime) {
      // Update order time in backend if needed
      router.push(
        `/examples/leclerc-bakery/locations/${locationId}/carts/${cartId}/checkout?pageView=1`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="w-24" />
              <h1
                className="text-xl font-semibold"
                style={{ color: "hsl(var(--brand-accent))" }}
              >
                Loading...
              </h1>
              <div className="w-24" />
            </div>
          </div>
        </header>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/examples/leclerc-bakery"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Menu</span>
              </Link>
              <h1 className="text-xl font-semibold text-red-600">Error</h1>
              <div className="w-24" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">Failed to load checkout data</p>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = parseFloat(data.subTotal) || 0;
  const deliveryFee = orderType === "delivery" && subtotal < 50 ? 5.99 : 0;
  const tax = parseFloat(data.taxTotal) || 0;
  const orderTotal = parseFloat(data.orderTotal) || 0;
  // Calculate total manually to include delivery fee
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/examples/leclerc-bakery/locations/${locationId}/carts/${cartId}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Cart</span>
            </Link>
            <h1
              className="text-xl font-semibold"
              style={{ color: "hsl(var(--brand-accent))" }}
            >
              Checkout
            </h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <Card>
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={orderType}
                  onValueChange={handleOrderTypeChange}
                >
                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="font-medium text-foreground">
                        Delivery
                      </div>
                      <div className="text-sm text-muted-foreground">
                        25-40 min • Free over $50
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors mt-3">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="font-medium text-foreground">Pickup</div>
                      <div className="text-sm text-muted-foreground">
                        Ready in 15-20 min
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery/Pickup Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {orderType === "delivery"
                    ? "Delivery Details"
                    : "Pickup Location"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderType === "delivery" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input id="address" placeholder="123 Main St" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="apt">Apt/Suite</Label>
                        <Input id="apt" placeholder="Apt 4B" />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="10001" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions">
                        Delivery Instructions
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="Leave at door, ring bell, etc."
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-muted/30">
                      <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">
                          Upper West Side
                        </div>
                        <div className="text-sm text-muted-foreground">
                          167 W 74th St, New York, NY 10023
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Open until 10:00 PM
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {orderType === "delivery" ? "Delivery Time" : "Pickup Time"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your preferred {orderType} time from available slots
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                  {timeSlots.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">
                        No {orderType} slots available today
                      </p>
                      <p className="text-sm">
                        Please try again tomorrow or choose a different order
                        type.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Group slots by day */}
                      {(() => {
                        const groupedSlots = timeSlots.reduce(
                          (groups, slot) => {
                            const day = slot.date;
                            if (!groups[day]) groups[day] = [];
                            groups[day].push(slot);
                            return groups;
                          },
                          {} as Record<string, typeof timeSlots>
                        );

                        return Object.entries(groupedSlots).map(
                          ([date, daySlots]) => {
                            const isToday = daySlots[0].dayOffset === 0;
                            const isTomorrow = daySlots[0].dayOffset === 1;

                            return (
                              <div key={date} className="space-y-3">
                                {/* Day Header */}
                                <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground">
                                      {isToday
                                        ? "Today"
                                        : isTomorrow
                                        ? "Tomorrow"
                                        : new Date(date).toLocaleDateString(
                                            "en-US",
                                            {
                                              weekday: "long",
                                            }
                                          )}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(date).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "long",
                                          day: "numeric",
                                          year:
                                            new Date(date).getFullYear() !==
                                            new Date().getFullYear()
                                              ? "numeric"
                                              : undefined,
                                        }
                                      )}
                                    </p>
                                  </div>
                                  {isToday && (
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                      Available Now
                                    </span>
                                  )}
                                  {isTomorrow && (
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                      Next Day
                                    </span>
                                  )}
                                </div>

                                {/* Time Slots Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                  {daySlots.map((slot) => {
                                    const isSelected =
                                      selectedTime === slot.value;
                                    return (
                                      <label
                                        key={slot.value}
                                        htmlFor={slot.value}
                                        className={`
                                        relative cursor-pointer group transition-all duration-200 ease-in-out
                                        ${
                                          isSelected
                                            ? "scale-105"
                                            : "hover:scale-102 hover:shadow-md"
                                        }
                                      `}
                                      >
                                        <input
                                          type="radio"
                                          id={slot.value}
                                          name="deliveryTime"
                                          value={slot.value}
                                          checked={isSelected}
                                          onChange={(e) =>
                                            setSelectedTime(e.target.value)
                                          }
                                          className="sr-only"
                                        />
                                        <div
                                          className={`
                                          p-3 rounded-lg border-2 text-center transition-all duration-200
                                          ${
                                            isSelected
                                              ? "text-white dark:text-white shadow-md transform"
                                              : "border-border hover:border-muted-foreground bg-background hover:bg-muted/50"
                                          }
                                        `}
                                          style={{
                                            backgroundColor: isSelected
                                              ? "hsl(var(--brand-accent))"
                                              : undefined,
                                            borderColor: isSelected
                                              ? "hsl(var(--brand-accent))"
                                              : undefined,
                                          }}
                                        >
                                          <div
                                            className={`font-medium text-sm ${
                                              isSelected
                                                ? "text-white dark:text-white"
                                                : "text-foreground"
                                            }`}
                                          >
                                            {slot.time}
                                          </div>
                                          {isSelected && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                              <Check className="h-3 w-3 text-green-600" />
                                            </div>
                                          )}
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>

                                {/* Separator between days */}
                                {Object.keys(groupedSlots).indexOf(date) <
                                  Object.keys(groupedSlots).length - 1 && (
                                  <div className="border-t border-border/50 pt-2"></div>
                                )}
                              </div>
                            );
                          }
                        );
                      })()}

                      {timeSlots.length >= 20 && (
                        <div className="text-center py-4 border-t border-border/50">
                          <p className="text-sm text-muted-foreground">
                            Showing next 20 available slots
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            More times available after selection
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle>Promo Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromoCode}
                    disabled={isApplyingPromo || !promoCode.trim()}
                  >
                    {isApplyingPromo ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {data.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium text-foreground">
                          {item.quantity}x {item.name}
                        </div>
                        {item.specialInstructions && (
                          <div className="text-muted-foreground">
                            {item.specialInstructions}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">${item.total}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span style={{ color: "hsl(var(--brand-accent))" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  className="w-full bg-[hsl(var(--brand-accent))] hover:bg-[hsl(var(--brand-accent))]/90 text-white"
                  disabled={!selectedTime}
                  onClick={handleContinueToPayment}
                >
                  {selectedTime
                    ? "Continue to Payment"
                    : "Select a time to continue"}
                </Button>

                {/* Payment Instructions */}
                {!selectedTime ? (
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Please select a {orderType} time to continue with payment
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <Shield className="h-5 w-5 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-green-800 dark:text-green-400">
                      Click continue to proceed with payment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetails;
