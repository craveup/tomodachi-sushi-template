"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, CreditCard, Lock, ChevronLeft } from "lucide-react";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: {
    type: "card" | "paypal" | "venmo";
    cardData?: {
      number: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
      name: string;
      zipCode: string;
    };
    saveForFuture: boolean;
  }) => void;
  initialPaymentType?: "card" | "paypal" | "venmo";
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSave,
  initialPaymentType = "card",
}: PaymentMethodModalProps) {
  const [currentStep, setCurrentStep] = useState<
    "selection" | "card-details" | "paypal" | "venmo"
  >("selection");
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    "card" | "paypal" | "venmo"
  >(initialPaymentType);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(true);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 5) {
      setZipCode(value);
    }
  };

  const handlePaymentTypeSelect = (type: "card" | "paypal" | "venmo") => {
    setSelectedPaymentType(type);
    if (type === "card") {
      setCurrentStep("card-details");
    } else if (type === "paypal") {
      setCurrentStep("paypal");
    } else if (type === "venmo") {
      setCurrentStep("venmo");
    }
  };

  const handleBack = () => {
    if (
      currentStep === "card-details" ||
      currentStep === "paypal" ||
      currentStep === "venmo"
    ) {
      setCurrentStep("selection");
    }
  };

  const handleSave = () => {
    if (selectedPaymentType === "card") {
      onSave({
        type: "card",
        cardData: {
          number: cardNumber,
          expiryMonth,
          expiryYear,
          cvv,
          name: cardholderName,
          zipCode,
        },
        saveForFuture,
      });
    } else {
      onSave({
        type: selectedPaymentType,
        saveForFuture,
      });
    }
  };

  const isCardFormValid = () => {
    return (
      cardNumber.replace(/\s/g, "").length >= 13 &&
      expiryMonth &&
      expiryYear &&
      cvv.length >= 3 &&
      cardholderName.trim() &&
      zipCode.length === 5
    );
  };

  // Handle escape key and reset state
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("selection");
      setSelectedPaymentType(initialPaymentType);
      setCardNumber("");
      setExpiryMonth("");
      setExpiryYear("");
      setCvv("");
      setCardholderName("");
      setZipCode("");
      setSaveForFuture(true);
    }
  }, [isOpen, initialPaymentType]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden border flex flex-col">
        {/* Header */}
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            {currentStep !== "selection" ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                aria-label="Back"
                className="h-8 w-8"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <div className="w-8" />
            )}

            <h2
              id="payment-modal-title"
              className="text-lg font-semibold text-foreground"
            >
              {currentStep === "selection" && "Add Payment Method"}
              {currentStep === "card-details" && "Add Card"}
              {currentStep === "paypal" && "PayPal"}
              {currentStep === "venmo" && "Venmo"}
            </h2>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === "selection" && (
            <div className="p-4 space-y-4">
              <RadioGroup
                value={selectedPaymentType}
                onValueChange={(value: "card" | "paypal" | "venmo") =>
                  setSelectedPaymentType(value)
                }
              >
                <div
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handlePaymentTypeSelect("card")}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card-option" />
                    <Label
                      htmlFor="card-option"
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </Label>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handlePaymentTypeSelect("paypal")}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="paypal" id="paypal-option" />
                    <Label
                      htmlFor="paypal-option"
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                      <span className="font-medium">PayPal</span>
                    </Label>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handlePaymentTypeSelect("venmo")}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="venmo" id="venmo-option" />
                    <Label
                      htmlFor="venmo-option"
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        V
                      </div>
                      <span className="font-medium">Venmo</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === "card-details" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Security Notice */}
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-800 dark:text-green-400">
                  Your payment information is secure and encrypted
                </span>
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="card-number" className="text-sm font-medium">
                  Card Number
                </Label>
                <Input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="text-base tracking-wide text-gray-700"
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-month" className="text-sm font-medium">
                    Month
                  </Label>
                  <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 w-full p-2">
                      {months.map((month) => (
                        <SelectItem
                          key={month.label}
                          value={month.label}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1"
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry-year" className="text-sm font-medium">
                    Year
                  </Label>
                  <Select value={expiryYear} onValueChange={setExpiryYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 p-1">
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year.toString()}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 py-1 px-2"
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-medium">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="text-sm text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="cardholder-name"
                  className="text-sm font-medium"
                >
                  Cardholder Name
                </Label>
                <Input
                  id="cardholder-name"
                  type="text"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="text-base text-gray-700"
                  required
                />
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="zip-code" className="text-sm font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zip-code"
                  type="text"
                  placeholder="12345"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  className="w-32 text-base text-gray-700"
                  required
                />
              </div>

              {/* Save for Future */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="save-card"
                  checked={saveForFuture}
                  onCheckedChange={(checked) =>
                    setSaveForFuture(checked as boolean)
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="save-card" className="text-sm font-medium">
                    Save this card for future orders
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Your card will be securely saved for faster checkout
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === "paypal" && (
            <div className="p-4 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  P
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Connect PayPal
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll be redirected to PayPal to complete your payment
                    securely.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="save-paypal"
                  checked={saveForFuture}
                  onCheckedChange={(checked) =>
                    setSaveForFuture(checked as boolean)
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="save-paypal" className="text-sm font-medium">
                    Save PayPal for future orders
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Skip the redirect next time for faster checkout
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === "venmo" && (
            <div className="p-4 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  V
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Connect Venmo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll be redirected to Venmo to complete your payment
                    securely.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="save-venmo"
                  checked={saveForFuture}
                  onCheckedChange={(checked) =>
                    setSaveForFuture(checked as boolean)
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="save-venmo" className="text-sm font-medium">
                    Save Venmo for future orders
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Skip the redirect next time for faster checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep !== "selection" && (
          <div className="p-4 border-t">
            <Button
              onClick={handleSave}
              disabled={currentStep === "card-details" && !isCardFormValid()}
              className="w-full"
              size="lg"
            >
              {currentStep === "card-details" && "Add Card"}
              {currentStep === "paypal" && "Continue with PayPal"}
              {currentStep === "venmo" && "Continue with Venmo"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
