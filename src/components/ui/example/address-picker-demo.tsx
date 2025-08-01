"use client";

import { useState } from "react";
import { Button } from "../button";
import AddressPickerModal from "../location/address-picker";

interface Address {
  street: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export default function AddressPickerDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleAddressSubmit = (address: Address) => {
    setSelectedAddress(address);
    setIsOpen(false);
    console.log("Address submitted:", address);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 space-y-6 border rounded-lg bg-background">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Delivery Address
        </h3>
        <p className="text-sm text-muted-foreground">
          Click to open address picker modal
        </p>
        <Button onClick={() => setIsOpen(true)} className="w-full" size="lg">
          Enter Delivery Address
        </Button>
      </div>

      {selectedAddress && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Selected Address:
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            {selectedAddress.street}
          </p>
          {selectedAddress.apartment && (
            <p className="text-sm text-green-700 dark:text-green-300">
              Apt: {selectedAddress.apartment}
            </p>
          )}
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
