"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import ErrorMessage from "@/components/ui/ErrorMessage";

import {
  ArrowLeft,
  MapPin,
  Clock,
  Check,
  Shield,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  updateOrderTime,
  applyPromoCode,
  removePromoCode,
} from "@/lib/api/cart";
import useCartData from "@/app/hooks/use-cart-data";
import { useApiResource } from "@/hooks/useApiResource";
import { cn } from "@/lib/utils";
import type { TimeIntervalsResponse, OrderDay } from "@/lib/api/types";

const CheckoutDetails = () => {
  const router = useRouter();
  const { locationId, cartId } = useParams();
  const { data, isLoading } = useCartData();
  const [orderType, setOrderType] = useState("delivery");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedInterval, setSelectedInterval] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Fetch time intervals from API
  const {
    data: timeIntervalsData,
    error: timeIntervalsError,
    isLoading: timeIntervalsLoading,
  } = useApiResource<TimeIntervalsResponse>(
    `/api/v1/locations/${locationId}/time-intervals`,
    { shouldFetch: Boolean(locationId) }
  );

  useEffect(() => {
    if (data?.fulfillmentMethod) {
      setOrderType(
        data.fulfillmentMethod === "takeout" ? "pickup" : data.fulfillmentMethod
      );
    }
  }, [data?.fulfillmentMethod]);

  // Initialize selected day and time from API data
  useEffect(() => {
    if (timeIntervalsData?.orderDays && data) {
      const foundOrderDay = timeIntervalsData.orderDays.find(
        (orderDay: OrderDay) => orderDay.value === data.orderDate
      );

      if (foundOrderDay) {
        setSelectedDay(foundOrderDay.value);
      } else if (timeIntervalsData.orderDays[0]) {
        setSelectedDay(timeIntervalsData.orderDays[0].value);
      }

      if (data.orderTime) {
        setSelectedInterval(data.orderTime);
        setSelectedTime(data.orderTime);
      }
    }
  }, [timeIntervalsData, data]);

  // Handle order time update
  const handleUpdateOrderTime = async ({
    pickupType,
    orderDate,
    orderTime,
  }: {
    pickupType: string;
    orderDate: string;
    orderTime: string;
  }) => {
    try {
      await updateOrderTime(locationId as string, cartId as string, {
        pickupType,
        orderDate,
        orderTime,
      });

      setSelectedDay(orderDate);
      setSelectedInterval(orderTime);
      setSelectedTime(orderTime);
    } catch (error) {
      console.error("Failed to update order time:", error);
    }
  };

  // Clear selected time when switching order types
  const handleOrderTypeChange = (newType: string) => {
    setOrderType(newType);
    setSelectedTime("");
    setSelectedDay("");
    setSelectedInterval("");
  };

  // Get current selected order day data
  const selectedOrderDay = timeIntervalsData?.orderDays?.find(
    (orderDay: OrderDay) => orderDay.value === selectedDay
  );

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    setPromoError(null);
    setPromoSuccess(null);

    try {
      await applyPromoCode(locationId as string, cartId as string, promoCode);
      setPromoSuccess("Promo code applied successfully!");
      setPromoCode(""); // Clear the input after successful application
      // The cart data should be refetched automatically by SWR
    } catch (error: any) {
      setPromoError(
        error?.message ||
          "Failed to apply promo code. Please check the code and try again."
      );
      console.error("Failed to apply promo code:", error);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromoCode = async () => {
    setIsApplyingPromo(true);
    setPromoError(null);
    setPromoSuccess(null);

    try {
      await removePromoCode(locationId as string, cartId as string);
      setPromoSuccess("Promo code removed successfully!");
      // The cart data should be refetched automatically by SWR
    } catch (error: any) {
      setPromoError(error?.message || "Failed to remove promo code.");
      console.error("Failed to remove promo code:", error);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleContinueToPayment = () => {
    if (selectedTime) {
      // Update order time in backend if needed
      router.push(
        `/locations/${locationId}/carts/${cartId}/checkout?pageView=1`
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
                href="/menu"
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
  const discount = parseFloat(data.discountTotal) || 0;
  const orderTotal = parseFloat(data.orderTotal) || 0;
  // Calculate total manually to include delivery fee and discount
  const total = subtotal + tax + deliveryFee - discount;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href={"/menu"}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Menu</span>
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
                {timeIntervalsLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="flex gap-4">
                      <div className="h-16 w-24 rounded bg-slate-200"></div>
                      <div className="h-16 w-24 rounded bg-slate-200"></div>
                      <div className="h-16 w-24 rounded bg-slate-200"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-12 w-full bg-slate-200 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                ) : timeIntervalsError ? (
                  <ErrorMessage message="Failed to load available time slots. Please try again later." />
                ) : timeIntervalsData?.orderDays ? (
                  <div className="space-y-6 max-h-96 overflow-y-auto scrollbar-hide pr-2">
                    {/* Flatten all intervals from all days into time slots */}
                    {(() => {
                      const allTimeSlots: Array<{
                        value: string;
                        label: string;
                        date: string;
                        time: string;
                        dayOffset: number;
                        dayLabel: string;
                      }> = [];

                      timeIntervalsData.orderDays.forEach(
                        (orderDay, dayIndex) => {
                          orderDay.intervals.forEach((interval) => {
                            allTimeSlots.push({
                              value: interval,
                              label: `${orderDay.label}, ${interval}`,
                              date: orderDay.value,
                              time: interval,
                              dayOffset: dayIndex,
                              dayLabel: orderDay.label,
                            });
                          });
                        }
                      );

                      if (allTimeSlots.length === 0) {
                        return (
                          <div className="text-center text-muted-foreground py-8">
                            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium">
                              No {orderType} slots available today
                            </p>
                            <p className="text-sm">
                              Please try again tomorrow or choose a different
                              order type.
                            </p>
                          </div>
                        );
                      }

                      // Group slots by day for display
                      const groupedSlots = allTimeSlots.reduce(
                        (groups, slot) => {
                          const day = slot.date;
                          if (!groups[day]) groups[day] = [];
                          groups[day].push(slot);
                          return groups;
                        },
                        {} as Record<string, typeof allTimeSlots>
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
                                      : daySlots[0].dayLabel}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {date}
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

                              {/* Time Slots Grid - Original Design */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {daySlots.slice(0, 20).map((slot) => {
                                  const isSelected =
                                    selectedTime === slot.value;
                                  return (
                                    <label
                                      key={`${slot.date}-${slot.value}`}
                                      htmlFor={`${slot.date}-${slot.value}`}
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
                                        id={`${slot.date}-${slot.value}`}
                                        name="deliveryTime"
                                        value={slot.value}
                                        checked={isSelected}
                                        onChange={(e) => {
                                          const selectedValue = e.target.value;
                                          setSelectedTime(selectedValue);
                                          setSelectedInterval(selectedValue);
                                          setSelectedDay(slot.date);
                                          handleUpdateOrderTime({
                                            pickupType: "LATER",
                                            orderDate: slot.date,
                                            orderTime: selectedValue,
                                          });
                                        }}
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
                                <div className="border-t border-border/50"></div>
                              )}
                            </div>
                          );
                        }
                      );
                    })()}

                    {/* Show total available slots count */}
                    {timeIntervalsData.orderDays.reduce(
                      (total, day) => total + day.intervals.length,
                      0
                    ) >= 20 && (
                      <div className="text-center py-2 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                          Showing next{" "}
                          {Math.min(
                            20,
                            timeIntervalsData.orderDays.reduce(
                              (total, day) => total + day.intervals.length,
                              0
                            )
                          )}{" "}
                          available slots
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          More times available after selection
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">
                      No {orderType} slots available
                    </p>
                    <p className="text-sm">
                      Please try again later or choose a different order type.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data?.discountCode ? (
                  /* Applied Promo Code Display */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-400">
                            {data.discountCode}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-500">
                            Promo code applied successfully!
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePromoCode}
                        disabled={isApplyingPromo}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>

                    {data.discountTotal &&
                      parseFloat(data.discountTotal) > 0 && (
                        <div className="text-center p-2 rounded-lg bg-green-100 dark:bg-green-950/30">
                          <p className="text-sm font-medium text-green-800 dark:text-green-400">
                            You saved $
                            {parseFloat(data.discountTotal).toFixed(2)}!
                          </p>
                        </div>
                      )}
                  </div>
                ) : (
                  /* Apply Promo Code Form */
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoError(null);
                          setPromoSuccess(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && promoCode.trim()) {
                            e.preventDefault();
                            handleApplyPromoCode();
                          }
                        }}
                        className={
                          promoError
                            ? "border-red-300 focus:border-red-500"
                            : ""
                        }
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyPromoCode}
                        disabled={isApplyingPromo || !promoCode.trim()}
                      >
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </Button>
                    </div>

                    {/* Success Message */}
                    {promoSuccess && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-green-800 dark:text-green-400">
                          {promoSuccess}
                        </p>
                      </div>
                    )}

                    {/* Error Message */}
                    {promoError && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-800 dark:text-red-400">
                          {promoError}
                        </p>
                      </div>
                    )}

                    {/* Help Text */}
                    <p className="text-xs text-muted-foreground">
                      Enter your promo code to get special discounts on your
                      order.
                    </p>
                  </div>
                )}
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
                  {data?.discountTotal &&
                    parseFloat(data.discountTotal) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({data.discountCode})</span>
                        <span>
                          -${parseFloat(data.discountTotal).toFixed(2)}
                        </span>
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
                  disabled={!selectedTime || !selectedInterval}
                  onClick={handleContinueToPayment}
                >
                  {selectedTime && selectedInterval
                    ? "Continue to Payment"
                    : "Select a time to continue"}
                </Button>

                {/* Payment Instructions */}
                {!selectedTime || !selectedInterval ? (
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
                      {selectedDay && selectedInterval && (
                        <span className="block mb-1 font-medium">
                          {selectedDay} at {selectedInterval}
                        </span>
                      )}
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
