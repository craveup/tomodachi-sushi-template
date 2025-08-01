"use client";

import { useState } from "react";
import { Button } from "../button";
import { MapPin } from "lucide-react";
import AddressPickerModal from "../location/address-picker";

export default function AddressPickerModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState<{
    street: string;
    apartment?: string;
  } | null>(null);

  const handleAddressSubmit = (address: {
    street: string;
    apartment?: string;
  }) => {
    setSavedAddress(address);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-fit"
      >
        <MapPin className="mr-2 h-4 w-4" />
        Enter Delivery Address
      </Button>

      {savedAddress && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <p className="text-sm font-medium">Delivery Address:</p>
          <p className="text-sm text-muted-foreground">
            {savedAddress.street}
            {savedAddress.apartment && `, ${savedAddress.apartment}`}
          </p>
        </div>
      )}

      <AddressPickerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNext={handleAddressSubmit}
      />
    </div>
  );
}
