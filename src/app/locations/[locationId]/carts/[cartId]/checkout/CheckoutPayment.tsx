"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import useCartData from "@/app/hooks/use-cart-data";
import { ArrowLeft, Shield } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getPaymentIntent, updateCustomerInfo } from "@/lib/api/cart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { locationId, cartId } = useParams();
  const { data, isLoading } = useCartData();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [usePhone, setUsePhone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("Payment system not ready. Please refresh and try again.");
      return;
    }

    // Validate form fields
    if (!customerInfo.name) {
      alert("Please enter your name");
      return;
    }

    if (!usePhone && !customerInfo.email) {
      alert("Please enter your email address");
      return;
    }

    if (usePhone && !customerInfo.phone) {
      alert("Please enter your phone number");
      return;
    }

    setIsProcessing(true);

    try {
      // Skip customer update - let Stripe handle everything

      // Update customer info before payment
      try {
        await updateCustomerInfo(locationId as string, cartId as string, {
          customerName: customerInfo.name, // Use customerName instead of name
          ...(usePhone
            ? { phoneNumber: customerInfo.phone }
            : { emailAddress: customerInfo.email }),
        });
      } catch (error) {
        // Customer update failed, continuing with payment anyway
      }

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${
            window.location.origin
          }/examples/leclerc-bakery/thank-you?displayName=${encodeURIComponent(
            data.restaurantDisplayName
          )}&locationId=${locationId}&cartId=${cartId}`,
          payment_method_data: {
            billing_details: {
              name: customerInfo.name,
              email: usePhone ? undefined : customerInfo.email,
              phone: usePhone ? customerInfo.phone : undefined,
            },
          },
        },
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
      }
      // If no error, Stripe will automatically redirect to the return_url
    } catch (error) {
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
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
            <p className="text-red-500">Failed to load payment data</p>
          </div>
        </div>
      </div>
    );
  }

  // Safer parsing with validation
  const safeParseFloat = (
    value: string | number | undefined | null
  ): number => {
    if (value === null || value === undefined || value === "") return 0;
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
  };

  const subtotal = safeParseFloat(data.subTotal);
  const tax = safeParseFloat(data.taxTotal);
  const tip = safeParseFloat(data.waiterTipTotal);
  const fees = safeParseFloat(data.serviceFeeTotal);
  const total = safeParseFloat(data.orderTotal);

  // Debug logging to identify issues
  if (process.env.NODE_ENV === "development") {
    console.log("Cart totals debug:", {
      raw: {
        subTotal: data.subTotal,
        taxTotal: data.taxTotal,
        waiterTipTotal: data.waiterTipTotal,
        serviceFeeTotal: data.serviceFeeTotal,
        orderTotal: data.orderTotal,
      },
      parsed: { subtotal, tax, tip, fees, total },
    });
  }

  // Always calculate total manually to ensure accuracy
  const calculatedTotal = subtotal + tax + tip + fees;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/examples/leclerc-bakery/locations/${locationId}/carts/${cartId}/checkout`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <h1
              className="text-xl font-semibold"
              style={{ color: "hsl(var(--brand-accent))" }}
            >
              Payment
            </h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main payment form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Your details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Need a receipt? Please enter your email below
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {usePhone ? (
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    By continue, you will receive relevant news and exclusive
                    offers, which you may opt-out of at any time. We are
                    committed to keeping your information confidential. We
                    respect your privacy and we do not sell, rent, or lease our
                    subscription lists to third parties. Please see our privacy
                    policy for more information.
                  </div>

                  <div className="flex items-center justify-center py-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setUsePhone(!usePhone)}
                      className="text-sm"
                    >
                      {usePhone ? "Use Email instead" : "Use Phone instead"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Enter your card details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your card details will collect securely and we use Stripe
                    for payment processing.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      This will appear on your statement as
                    </p>
                    <p className="font-medium">{data.restaurantDisplayName}</p>
                  </div>

                  <PaymentElement
                    options={{
                      layout: "accordion",
                      business: { name: data.restaurantDisplayName },
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {data.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
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
                        <div className="font-medium">
                          ${(parseFloat(item.total) || 0).toFixed(2)}
                        </div>
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
                    {tip > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Tip</span>
                        <span>${tip.toFixed(2)}</span>
                      </div>
                    )}
                    {(fees > 0 || tax > 0) && (
                      <div className="flex justify-between text-sm">
                        <span>Fees & Estimated Tax</span>
                        <span>${(fees + tax).toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span style={{ color: "hsl(var(--brand-accent))" }}>
                        ${calculatedTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full bg-[hsl(var(--brand-accent))] hover:bg-[hsl(var(--brand-accent))]/90 text-white"
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay with Debit or Credit`}
                  </Button>

                  {/* Security Note */}
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <Shield className="h-5 w-5 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-green-800 dark:text-green-400">
                      Your payment is secure and encrypted
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const CheckoutPayment = () => {
  const { locationId, cartId } = useParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateClientSecret = async () => {
      try {
        setIsLoading(true);
        const data = await getPaymentIntent(
          locationId as string,
          cartId as string
        );
        setClientSecret(data.clientSecret);
        setError(null);
      } catch (error) {
        console.error("Failed to generate payment intent:", error);
        setError(
          "Payment system temporarily unavailable. Please check that your backend is running with valid location data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (locationId && cartId) {
      generateClientSecret();
    }
  }, [locationId, cartId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link
                href={`/examples/leclerc-bakery/locations/${locationId}/carts/${cartId}/checkout`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
              <h1 className="text-xl font-semibold text-red-600">Error</h1>
              <div className="w-24" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !clientSecret) {
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
                Loading payment...
              </h1>
              <div className="w-24" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutPaymentForm />
    </Elements>
  );
};

export default CheckoutPayment;
