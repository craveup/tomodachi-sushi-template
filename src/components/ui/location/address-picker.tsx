"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { AddressAutocomplete, type Address } from "./address-autocomplete";

interface AddressPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (address: { street: string; apartment?: string }) => void;
}

export default function AddressPickerModal({
  isOpen,
  onClose,
  onNext,
}: AddressPickerModalProps) {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [apartmentNumber, setApartmentNumber] = useState("");

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleNext = () => {
    if (selectedAddress) {
      onNext({
        street: selectedAddress.formattedAddress,
        apartment: apartmentNumber || undefined,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-xl font-semibold text-center">
            Enter your delivery address
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            This will help us confirm the store&apos;s availability and delivery
            fees
          </p>
        </DialogHeader>

        {/* Content */}
        <div className="px-4 pb-4 space-y-4">
          {/* Street Address Field with Google Maps Autocomplete */}
          <div className="space-y-2">
            <Label htmlFor="street-address" className="text-sm font-medium">
              Street Address
            </Label>
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              placeholder="Delivery address"
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              variant="default"
              onError={(error) =>
                console.error("Address autocomplete error:", error)
              }
            />
          </div>

          {/* Apartment Number Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="apartment-number" className="text-sm font-medium">
                Apartment Number or Suite
              </Label>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>
            <Input
              id="apartment-number"
              type="text"
              placeholder="Apartment Number or Suite"
              value={apartmentNumber}
              onChange={(e) => setApartmentNumber(e.target.value)}
            />
          </div>

          {/* Divider */}
          <hr className="border-border" />

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!selectedAddress}
            className="w-full"
            data-anchor-id="AddressNextButton"
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
