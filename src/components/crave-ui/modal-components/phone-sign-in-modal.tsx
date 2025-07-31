"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface PhoneSigninModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (phoneData: { countryCode: string; phoneNumber: string }) => void;
}

const countryOptions = [
  { value: "US", label: "+1 (US)", code: "+1" },
  { value: "CA", label: "+1 (CA)", code: "+1" },
  { value: "AU", label: "+61 (AU)", code: "+61" },
  { value: "MX", label: "+52 (MX)", code: "+52" },
  { value: "JP", label: "+81 (JP)", code: "+81" },
  { value: "DE", label: "+49 (DE)", code: "+49" },
  { value: "NZ", label: "+64 (NZ)", code: "+64" },
];

export default function PhoneSigninModal({
  isOpen,
  onClose,
  onContinue,
}: PhoneSigninModalProps) {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleContinue = () => {
    if (phoneNumber.trim()) {
      const selectedCountryData = countryOptions.find(
        (country) => country.value === selectedCountry
      );
      onContinue({
        countryCode: selectedCountryData?.code || "+1",
        phoneNumber: phoneNumber.trim(),
      });
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format as (xxx) xxx-xxxx for US/CA
    if (selectedCountry === "US" || selectedCountry === "CA") {
      if (digits.length <= 3) {
        return digits;
      } else if (digits.length <= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }

    // For other countries, just return the digits
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const getPlaceholder = () => {
    if (selectedCountry === "US" || selectedCountry === "CA") {
      return "(xxx) xxx-xxxx";
    }
    return "Enter phone number";
  };

  // Handle escape key and body scroll
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-signin-title"
      data-testid="OtpModal"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden border">
        {/* Hidden title for accessibility */}
        <span id="phone-signin-title" className="sr-only" aria-hidden="false">
          Sign in or join modal
        </span>

        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Back"
              data-testid="close-button"
              className="h-8 w-8"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Sign in or join
            </h2>
            <p className="text-muted-foreground">
              Enjoy faster checkout and easier reordering.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6" data-testid="enter-phone-modal">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Enter your phone number
              </h3>

              <div className="flex gap-3">
                {/* Country Code Select */}
                <div className="w-32">
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger className="h-12" aria-label="Country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {countryOptions.map((country) => (
                        <SelectItem
                          key={country.value}
                          value={country.value}
                          className="cursor-pointer p-2 hover:bg-gray-500 dark:bg-gray-700 hover:dark:bg-gray-600"
                        >
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone Number Input */}
                <div className="flex-1">
                  <Input
                    type="tel"
                    aria-label="Phone Number"
                    required
                    autoComplete="tel"
                    placeholder={getPlaceholder()}
                    maxLength={15}
                    name="phone"
                    data-testid="login-phone-field"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              We'll text you a security code to sign in, or create a new account
              with this number.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6 pt-0 border-t"
          data-testid="in-content-modal-footer-container"
        >
          <Button
            onClick={handleContinue}
            disabled={!phoneNumber.trim()}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
