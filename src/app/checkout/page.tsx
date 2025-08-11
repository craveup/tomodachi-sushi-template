"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../providers/cart-provider";
import { useThemeClasses } from "../hooks/use-restaurant-theme";
import { ClientIcon } from "../components/client-icon";
import { AddressFlow, DeliveryOption } from "../components/address-flow";
import { StripePaymentElement } from "../components/stripe-payment-element";
import { useAddress } from "../providers/address-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TomodachiCheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { getThemeClass } = useThemeClasses();
  const { setDeliveryData } = useAddress();
  const [orderType, setOrderType] = useState("delivery");
  const [selectedTime, setSelectedTime] = useState("");
  const [isAddressFlowOpen, setIsAddressFlowOpen] = useState(false);

  // Redirect to menu if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-backgrounddefault flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-backgroundmuted flex items-center justify-center">
            <ClientIcon
              name="ShoppingCart"
              className="w-8 h-8 text-textmuted"
            />
          </div>
          <div>
            <h2 className="font-heading-h4 text-textdefault text-2xl tracking-wider mb-2">
              YOUR CART IS EMPTY
            </h2>
            <p className="font-text-meta text-textmuted tracking-wider">
              Add some delicious sushi to your cart before checking out
            </p>
          </div>
          <Button
            onClick={() => router.push("/menu")}
            className="bg-backgroundprimary text-textinverse hover:bg-backgroundprimary/90 font-text-meta tracking-wider rounded-xl px-8 py-3"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  const deliveryFee = orderType === "delivery" && subtotal < 50 ? 5.99 : 0;
  const finalTotal = total + deliveryFee;

  const handleAddressFlowComplete = (data: {
    deliveryOption: DeliveryOption;
    address?: { street: string; apartment?: string };
  }) => {
    setDeliveryData(data);
    setIsAddressFlowOpen(false);
  };

  const handlePaymentSuccess = async (paymentIntentId?: string) => {
    try {
      // With the cart-based API, orders are automatically created via Stripe webhook
      // We just need to clear the cart and redirect to confirmation
      // Payment successful: ${paymentIntentId}

      clearCart();
      router.push(`/confirmation?paymentIntentId=${paymentIntentId}`);
    } catch (error) {
      // Still clear cart and redirect, but show error
      clearCart();
      router.push("/confirmation");
    }
  };

  const handlePaymentError = (error: string) => {
    // You could show a toast notification here
  };

  // Generate time slots like real delivery apps
  const generateTimeSlots = useCallback(() => {
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
  }, [orderType]);

  // Regenerate time slots when order type changes
  const timeSlots = useMemo(() => generateTimeSlots(), [generateTimeSlots]);

  // Clear selected time when switching order types
  const handleOrderTypeChange = (newType: string) => {
    setOrderType(newType);
    setSelectedTime(""); // Clear selection since times are different
  };

  return (
    <div className="min-h-screen bg-backgrounddefault">
      {/* Header */}
      <header className="bg-backgrounddefault border-b border-borderdefault sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-backgrounddefault/60">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              className="flex items-center gap-3 text-textmuted hover:text-textdefault transition-colors"
            >
              <ClientIcon name="ArrowLeft" className="h-5 w-5" />
              <span className="font-text-meta text-sm tracking-wider">
                Back to Menu
              </span>
            </Link>
            <h1 className="font-heading-h3 text-textdefault text-2xl tracking-wider">
              CHECKOUT
            </h1>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main checkout form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Type */}
            <Card className="bg-backgrounddefault border-borderdefault rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="font-heading-h4 text-textdefault text-xl tracking-wider">
                  ORDER TYPE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={orderType}
                  onValueChange={handleOrderTypeChange}
                  className="space-y-4"
                >
                  <div
                    className={`group relative flex items-center space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      orderType === "delivery"
                        ? "border-backgroundprimary bg-backgroundprimary/10 shadow-lg"
                        : "border-borderdefault hover:border-backgroundprimary/50 hover:bg-backgroundmuted/50 hover:shadow-md"
                    }`}
                  >
                    <RadioGroupItem
                      value="delivery"
                      id="delivery"
                      className="border-2 data-[state=checked]:border-backgroundprimary data-[state=checked]:bg-backgroundprimary"
                    />
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`p-3 rounded-xl transition-colors ${
                          orderType === "delivery"
                            ? "bg-backgroundprimary/20 text-backgroundprimary"
                            : "bg-backgroundmuted text-textmuted group-hover:bg-backgroundprimary/10 group-hover:text-backgroundprimary"
                        }`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </div>
                      <Label
                        htmlFor="delivery"
                        className="flex-1 cursor-pointer"
                      >
                        <div
                          className={`font-heading-h6 text-lg tracking-wider transition-colors ${
                            orderType === "delivery"
                              ? "text-backgroundprimary"
                              : "text-textdefault group-hover:text-backgroundprimary"
                          }`}
                        >
                          Delivery
                        </div>
                        <div className="font-text-meta text-sm text-textmuted tracking-wider">
                          25-40 min • Free over $50
                        </div>
                      </Label>
                    </div>
                    {orderType === "delivery" && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-backgroundprimary rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`group relative flex items-center space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      orderType === "pickup"
                        ? "border-backgroundprimary bg-backgroundprimary/10 shadow-lg"
                        : "border-borderdefault hover:border-backgroundprimary/50 hover:bg-backgroundmuted/50 hover:shadow-md"
                    }`}
                  >
                    <RadioGroupItem
                      value="pickup"
                      id="pickup"
                      className="border-2 data-[state=checked]:border-backgroundprimary data-[state=checked]:bg-backgroundprimary"
                    />
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`p-3 rounded-xl transition-colors ${
                          orderType === "pickup"
                            ? "bg-backgroundprimary/20 text-backgroundprimary"
                            : "bg-backgroundmuted text-textmuted group-hover:bg-backgroundprimary/10 group-hover:text-backgroundprimary"
                        }`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div
                          className={`font-heading-h6 text-lg tracking-wider transition-colors ${
                            orderType === "pickup"
                              ? "text-backgroundprimary"
                              : "text-textdefault group-hover:text-backgroundprimary"
                          }`}
                        >
                          Pickup
                        </div>
                        <div className="font-text-meta text-sm text-textmuted tracking-wider">
                          Ready in 15-20 min
                        </div>
                      </Label>
                    </div>
                    {orderType === "pickup" && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-backgroundprimary rounded-full"></div>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery/Pickup Details */}
            <Card className="bg-backgrounddefault border-borderdefault rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="font-heading-h4 text-textdefault text-xl tracking-wider">
                  {orderType === "delivery"
                    ? "DELIVERY DETAILS"
                    : "PICKUP LOCATION"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {orderType === "delivery" ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="font-text-meta text-textdefault text-sm tracking-wider font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="mt-2 bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="lastName"
                          className="font-text-meta text-textdefault text-sm tracking-wider font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="mt-2 bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="font-text-meta text-textdefault text-sm tracking-wider font-medium"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="mt-2 bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="address"
                        className="font-text-meta text-textdefault text-sm tracking-wider font-medium"
                      >
                        Delivery Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        className="mt-2 bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="apt"
                          className="font-text-meta text-textdefault text-sm tracking-wider font-medium"
                        >
                          Apt/Suite
                        </Label>
                        <Input
                          id="apt"
                          placeholder="Apt 4B"
                          className="mt-2 bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="zip"
                          className="font-text-meta text-textdefault text-sm tracking-wider font-medium"
                        >
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          placeholder="10001"
                          className="mt-2 bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="instructions"
                        className="font-text-meta text-textdefault text-sm tracking-wider font-medium"
                      >
                        Delivery Instructions
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="Leave at door, ring bell, etc."
                        rows={3}
                        className="mt-2 bg-backgroundmuted border-borderdefault rounded-xl px-4 py-3 text-textdefault placeholder:text-textmuted"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-6 border border-borderdefault rounded-2xl bg-backgroundmuted/30">
                      <ClientIcon
                        name="MapPin"
                        className="h-6 w-6 mt-1 text-textmuted"
                      />
                      <div>
                        <div className="font-heading-h6 text-textdefault text-lg tracking-wider">
                          Tomodachi Sushi
                        </div>
                        <div className="font-text-meta text-sm text-textmuted tracking-wider">
                          123 Nihonbashi Street, New York, NY 10001
                        </div>
                        <div className="font-text-meta text-sm text-textmuted tracking-wider mt-1">
                          Open until 10:00 PM
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-2 border-borderdefault text-textdefault rounded-xl py-3 font-text-meta tracking-wider hover:bg-backgroundprimary/10 hover:border-backgroundprimary/30 hover:text-textdefault transition-all duration-200"
                      onClick={() => setIsAddressFlowOpen(true)}
                    >
                      Choose Different Location
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card className="bg-backgrounddefault border-borderdefault rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 font-heading-h4 text-textdefault text-xl tracking-wider">
                  <ClientIcon name="Clock" className="h-6 w-6" />
                  {orderType === "delivery" ? "DELIVERY TIME" : "PICKUP TIME"}
                </CardTitle>
                <p className="font-text-meta text-sm text-textmuted tracking-wider mt-2">
                  Select your preferred {orderType} time from available slots
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                  {timeSlots.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <ClientIcon
                        name="Clock"
                        className="h-12 w-12 mx-auto mb-3 opacity-50"
                      />
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
                                            ? "ring-2 ring-offset-2 scale-105"
                                            : "hover:scale-102 hover:shadow-md"
                                        }
                                      `}
                                        style={
                                          isSelected
                                            ? ({
                                                "--ring-color":
                                                  "hsl(var(--brand-accent))",
                                              } as React.CSSProperties)
                                            : {}
                                        }
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
                                              <ClientIcon
                                                name="Check"
                                                className="h-3 w-3 text-green-600"
                                              />
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

            {/* Payment */}
            {selectedTime ? (
              <StripePaymentElement
                amount={finalTotal}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            ) : (
              <Card className="bg-backgrounddefault border-borderdefault rounded-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 font-heading-h4 text-textdefault text-xl tracking-wider">
                    <ClientIcon name="CreditCard" className="h-6 w-6" />
                    PAYMENT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ClientIcon
                      name="Clock"
                      className="h-16 w-16 mx-auto mb-4 text-textmuted opacity-50"
                    />
                    <p className="font-text-meta text-textmuted tracking-wider">
                      Please select a {orderType} time to continue with payment
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-backgrounddefault border-borderdefault rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="font-heading-h4 text-textdefault text-xl tracking-wider">
                  YOUR ORDER
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.cartId}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="font-heading-h6 text-textdefault text-base tracking-wider">
                          {item.quantity}x {item.name}
                        </div>
                        {item.options.warming === "warmed" && (
                          <div className="font-text-meta text-sm text-textmuted tracking-wider">
                            Warmed
                          </div>
                        )}
                        {item.options.giftBox && (
                          <div className="font-text-meta text-sm text-textmuted tracking-wider">
                            Gift Box
                          </div>
                        )}
                      </div>
                      <div className="font-heading-h6 text-textdefault text-base tracking-wider">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-borderdefault" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between font-text-meta text-sm tracking-wider">
                    <span className="text-textdefault">Subtotal</span>
                    <span className="text-textdefault">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between font-text-meta text-sm tracking-wider">
                      <span className="text-textdefault">Delivery Fee</span>
                      <span className="text-textdefault">
                        ${deliveryFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-text-meta text-sm tracking-wider">
                    <span className="text-textdefault">Tax</span>
                    <span className="text-textdefault">${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-borderdefault" />
                  <div className="flex justify-between font-heading-h5 text-lg tracking-wider">
                    <span className="text-textdefault">Total</span>
                    <span className="text-textdefault">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Instructions */}
                {!selectedTime ? (
                  <div className="text-center p-6 rounded-2xl bg-backgroundmuted/50">
                    <ClientIcon
                      name="Clock"
                      className="h-6 w-6 mx-auto mb-3 text-textmuted"
                    />
                    <p className="font-text-meta text-sm text-textmuted tracking-wider">
                      Please select a {orderType} time to continue with payment
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-6 rounded-2xl bg-backgroundmuted/30">
                    <ClientIcon
                      name="Shield"
                      className="h-6 w-6 mx-auto mb-3 text-textdefault"
                    />
                    <p className="font-text-meta text-sm text-textdefault tracking-wider">
                      Complete your payment securely below
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Flow Modal */}
      <AddressFlow
        isOpen={isAddressFlowOpen}
        onClose={() => setIsAddressFlowOpen(false)}
        onComplete={handleAddressFlowComplete}
      />
    </div>
  );
}
