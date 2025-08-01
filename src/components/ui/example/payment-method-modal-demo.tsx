"use client";

import { useState } from "react";
import { Button } from "../button";
import { Card } from "../card";
import { CreditCard, Check } from "lucide-react";
import PaymentMethodModal from "@/components/crave-ui/modal-components/payment-method-modal";

export default function PaymentMethodModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [savedPayment, setSavedPayment] = useState<any>(null);
  const [lastAction, setLastAction] = useState<string>("");

  const handleSave = (paymentData: any) => {
    setSavedPayment(paymentData);
    setLastAction("saved");
    setIsOpen(false);

    // Reset the action after 3 seconds
    setTimeout(() => setLastAction(""), 3000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setLastAction("cancelled");

    // Reset the action after 3 seconds
    setTimeout(() => setLastAction(""), 3000);
  };

  const formatCardNumber = (number: string) => {
    if (!number) return "";
    const last4 = number.replace(/\s/g, "").slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Demo Controls */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Demo Controls</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              Last Action:{" "}
              <span className="font-mono">{lastAction || "None"}</span>
            </div>
            {savedPayment && (
              <div>
                Payment Type:{" "}
                <span className="font-mono">{savedPayment.type}</span>
              </div>
            )}
            {savedPayment?.cardData && (
              <div>
                Card Number:{" "}
                <span className="font-mono">
                  {formatCardNumber(savedPayment.cardData.number)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Trigger Buttons */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Payment Method Modal</h3>
          <p className="text-sm text-muted-foreground">
            A comprehensive modal for adding payment methods including credit
            cards, PayPal, and Venmo.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Add Payment Method
          </Button>
        </div>

        {/* Saved Payment Display */}
        {savedPayment && (
          <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-400">
                Payment Method Added
              </span>
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <div>Type: {savedPayment.type}</div>
              {savedPayment.cardData && (
                <>
                  <div>
                    Card: {formatCardNumber(savedPayment.cardData.number)}
                  </div>
                  <div>Name: {savedPayment.cardData.name}</div>
                  <div>
                    Expires: {savedPayment.cardData.expiryMonth}/
                    {savedPayment.cardData.expiryYear}
                  </div>
                </>
              )}
              <div>
                Save for future: {savedPayment.saveForFuture ? "Yes" : "No"}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Features */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">Features</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Multi-step payment method selection</li>
          <li>• Credit/debit card form with validation</li>
          <li>• PayPal and Venmo integration</li>
          <li>• Automatic card number formatting</li>
          <li>• Security indicators and encryption notice</li>
          <li>• Save for future orders option</li>
          <li>• Full keyboard navigation and accessibility</li>
          <li>• Dark mode support</li>
        </ul>
      </Card>

      {/* Usage Example */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">Usage Example</h3>
        <div className="bg-muted rounded p-3 text-xs font-mono whitespace-pre-wrap">
          {`<PaymentMethodModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSave={(paymentData) => {
    console.log('Payment method saved:', paymentData)
    setIsOpen(false)
  }}
  initialPaymentType="card"
/>`}
        </div>
      </Card>

      {/* Modal */}
      <PaymentMethodModal
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        initialPaymentType="card"
      />
    </div>
  );
}
