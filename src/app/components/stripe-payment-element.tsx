"use client";

import { useState, useEffect, useRef } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientIcon } from "./client-icon";
import { useThemeClasses } from "../hooks/use-restaurant-theme";
import { location_Id as LOCATION_ID } from "@/constants";

// Initialize Stripe with publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_your_publishable_key_here"
);

interface StripePaymentFormProps {
  amount: number;
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId?: string) => void;
  onPaymentError: (error: string) => void;
}

function StripePaymentForm({
  amount,
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { getThemeClass } = useThemeClasses();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setMessage("Payment system not ready. Please wait.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // Check if payment element is ready
    const paymentElement = elements.getElement("payment");
    if (!paymentElement) {
      setMessage("Payment form not ready. Please wait and try again.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Return URL after payment completion
          return_url: `${window.location.origin}/examples/leclerc-bakery/confirmation`,
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "An error occurred during payment");
          onPaymentError(error.message || "Payment failed");
        } else {
          setMessage("An unexpected error occurred.");
          onPaymentError("An unexpected error occurred");
        }
      } else {
        // Payment succeeded - extract payment intent ID from URL or client secret
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentId =
          urlParams.get("payment_intent") || clientSecret?.split("_secret_")[0];

        // Check if this is demo mode
        if (clientSecret?.includes("_secret_demo")) {
          // Demo payment completed - simulating success
          onPaymentSuccess("demo_payment_intent_" + Date.now());
        } else {
          onPaymentSuccess(paymentIntentId);
        }
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setMessage("Payment confirmation failed. Please try again.");
      onPaymentError("Payment confirmation failed");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: any = {
    layout: "tabs",
    business: {
      name: "Leclerc Bakery",
    },
  };

  // Listen for PaymentElement ready event
  useEffect(() => {
    if (!elements) return;

    const paymentElement = elements.getElement("payment");
    if (paymentElement) {
      paymentElement.on("ready", () => {
        setIsPaymentElementReady(true);
      });
    }
  }, [elements]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions}
          onReady={() => setIsPaymentElementReady(true)}
        />
      </div>

      {message && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <ClientIcon name="AlertCircle" className="h-4 w-4" />
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements || !isPaymentElementReady}
        className="w-full text-white dark:text-white"
        style={{
          backgroundColor: "hsl(var(--brand-accent))",
        }}
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <ClientIcon name="Loader2" className="h-4 w-4 animate-spin" />
            Processing Payment...
          </div>
        ) : !isPaymentElementReady ? (
          <div className="flex items-center gap-2">
            <ClientIcon name="Loader2" className="h-4 w-4 animate-spin" />
            Loading Payment Form...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ClientIcon name="CreditCard" className="h-4 w-4" />
            Pay ${amount.toFixed(2)}
          </div>
        )}
      </Button>
    </form>
  );
}

interface StripePaymentElementProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId?: string) => void;
  onPaymentError: (error: string) => void;
}

export function StripePaymentElement({
  amount,
  onPaymentSuccess,
  onPaymentError,
}: StripePaymentElementProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isCreatingPayment, setIsCreatingPayment] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    createPaymentIntent();
  }, [amount]);

  const createPaymentIntent = async () => {
    setIsCreatingPayment(true);
    setError(null);

    try {
      // For demo purposes, we'll simulate the backend integration
      // In production, this would use real location and cart IDs from your backend

      // Attempting to integrate with backend payment system

      // Try to create cart with backend first
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const API_KEY = process.env.NEXT_PUBLIC_CRAVE_API_KEY;

      const locationId = LOCATION_ID;

      if (!API_KEY) {
        // No API key configured, falling back to demo payment mode
        throw new Error("API key required for backend integration");
      }

      const cartResponse = await fetch(
        `${API_BASE_URL}/api/v1/locations/${locationId}/carts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
          },
          body: JSON.stringify({
            marketplaceId: null,
            searchParams: "fulfillmentMethod=delivery",
            currentCartId: null,
          }),
        }
      );

      if (cartResponse.ok) {
        // Backend integration successful
        const cartData = await cartResponse.json();
        const cartId = cartData.cartId;

        // Create payment intent using backend API
        const response = await fetch(
          `${API_BASE_URL}/api/v1/stripe/payment-intent?locationId=${locationId}&cartId=${cartId}`,
          {
            method: "GET",
            headers: {
              "X-API-Key": API_KEY,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            return;
          }
        }
      }

      // Fallback to demo payment mode for UI testing

      const demoResponse = await fetch("/api/demo-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }),
      });

      if (demoResponse.ok) {
        const demoData = await demoResponse.json();
        setClientSecret(demoData.client_secret);
        return;
      }

      // Final fallback - show error
      setError(
        "Payment system temporarily unavailable. Please check that your backend is running with valid location data."
      );
    } catch (err) {
      // Try demo mode as final fallback
      try {
        const demoResponse = await fetch("/api/demo-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: amount }),
        });

        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          setClientSecret(demoData.client_secret);
          return;
        }
      } catch (demoErr) {
        // Demo mode fallback failed
      }

      setError(
        "Unable to connect to payment system. Please ensure your backend is running on localhost:8000."
      );
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "hsl(var(--brand-accent))",
        colorBackground: "hsl(var(--background))",
        colorText: "hsl(var(--foreground))",
        colorDanger: "hsl(var(--destructive))",
        fontFamily: "var(--font-leclerc-primary)",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
      rules: {
        ".Tab": {
          border: "1px solid hsl(var(--border))",
          backgroundColor: "hsl(var(--background))",
        },
        ".Tab:hover": {
          backgroundColor: "hsl(var(--muted))",
        },
        ".Tab--selected": {
          borderColor: "hsl(var(--brand-accent))",
          backgroundColor: "hsl(var(--background))",
        },
        ".Input": {
          backgroundColor: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
        },
        ".Input:focus": {
          borderColor: "hsl(var(--brand-accent))",
        },
      },
    },
  };

  if (isCreatingPayment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClientIcon name="CreditCard" className="h-5 w-5" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ClientIcon name="Loader2" className="h-4 w-4 animate-spin" />
              Initializing secure payment...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClientIcon name="CreditCard" className="h-5 w-5" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <ClientIcon name="AlertCircle" className="h-4 w-4" />
            {error}
          </div>
          <Button
            onClick={createPaymentIntent}
            variant="outline"
            className="w-full mt-4"
          >
            <ClientIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClientIcon name="CreditCard" className="h-5 w-5" />
          Payment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your payment information is secure and encrypted
        </p>
      </CardHeader>
      <CardContent>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <StripePaymentForm
              amount={amount}
              clientSecret={clientSecret}
              onPaymentSuccess={onPaymentSuccess}
              onPaymentError={onPaymentError}
            />
          </Elements>
        )}
      </CardContent>
    </Card>
  );
}
