"use client";

import {
  PromoCodeInput,
  type PromoCode,
} from "@/components/crave-ui/checkout-components/promo-code-input";
import * as React from "react";

export default function PromoCodeInputDemo() {
  const [appliedCode, setAppliedCode] = React.useState<PromoCode | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);

  const handleSubmit = async (code: string) => {
    setIsValidating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation logic
    const validCodes: Record<string, PromoCode> = {
      SAVE20: {
        id: "promo_1",
        code: "SAVE20",
        type: "percentage",
        value: 20,
        description: "20% off your order",
        discount: 8.4,
        usageCount: 45,
        maxUsage: 100,
      },
      FREESHIP: {
        id: "promo_2",
        code: "FREESHIP",
        type: "free-shipping",
        value: 0,
        description: "Free delivery",
        discount: 3.99,
        usageCount: 23,
        maxUsage: 50,
      },
      WELCOME10: {
        id: "promo_3",
        code: "WELCOME10",
        type: "fixed",
        value: 10,
        description: "$10 off your first order",
        discount: 10.0,
        usageCount: 12,
        isFirstTimeOnly: true,
      },
    };

    const promoCode = validCodes[code];

    if (!promoCode) {
      throw new Error("Invalid promo code");
    }

    if (code === "EXPIRED") {
      throw new Error("This promo code has expired");
    }

    if (code === "MINIMUM") {
      throw new Error("Minimum order of $25 required");
    }

    setAppliedCode(promoCode);
    setIsValidating(false);
  };

  const handleRemove = () => {
    setAppliedCode(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h3 className="mb-3 font-medium">Default Promo Code Input</h3>
        <PromoCodeInput
          onSubmit={handleSubmit}
          onRemove={handleRemove}
          appliedCode={appliedCode}
          isValidating={isValidating}
          placeholder="Enter promo code"
        />
      </div>

      <div>
        <h3 className="mb-3 font-medium">With Suggestions</h3>
        <PromoCodeInput
          onSubmit={handleSubmit}
          onRemove={handleRemove}
          showSuggestions={true}
          availableCodes={["SAVE20", "FREESHIP", "WELCOME10", "LOYALTY15"]}
          placeholder="Try typing 'SAVE' or 'FREE'"
        />
      </div>

      <div>
        <h3 className="mb-3 font-medium">Auto-Apply Variant</h3>
        <PromoCodeInput
          onSubmit={handleSubmit}
          onRemove={handleRemove}
          variant="auto-apply"
          autoApply={true}
          debounceMs={500}
          placeholder="Type a valid code"
        />
      </div>

      <div className="rounded-lg bg-muted p-4">
        <h4 className="mb-2 text-sm font-medium">Try these codes:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <code className="rounded bg-background px-1">SAVE20</code> - 20% off
          </li>
          <li>
            <code className="rounded bg-background px-1">FREESHIP</code> - Free
            delivery
          </li>
          <li>
            <code className="rounded bg-background px-1">WELCOME10</code> - $10
            off first order
          </li>
          <li>
            <code className="rounded bg-background px-1">EXPIRED</code> - Test
            expired code
          </li>
          <li>
            <code className="rounded bg-background px-1">MINIMUM</code> - Test
            minimum order error
          </li>
        </ul>
      </div>
    </div>
  );
}
