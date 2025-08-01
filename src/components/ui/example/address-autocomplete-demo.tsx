"use client";

import { useState } from "react";
import {
  AddressAutocomplete,
  AddressInput,
  type Address,
} from "../location/address-autocomplete";
import { Badge } from "../badge";
import { Button } from "../button";
import { Separator } from "../separator";
import { MapPin, Trash2 } from "lucide-react";
import { Card } from "../card";

export default function AddressAutocompleteDemo() {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [fallbackAddress, setFallbackAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Demo Google Maps API key (replace with your own)
  const DEMO_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setError(null);
    console.log("Selected address:", address);
  };

  const handleFallbackAddressSelect = (address: Address) => {
    setFallbackAddress(address);
    console.log("Fallback address:", address);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.error("Address error:", errorMessage);
  };

  const clearAddress = () => {
    setSelectedAddress(null);
    setError(null);
  };

  const clearFallbackAddress = () => {
    setFallbackAddress(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Google Maps Address Autocomplete */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Google Maps Address Autocomplete
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Type an address to see suggestions powered by Google Maps Places
              API
            </p>
          </div>

          <AddressAutocomplete
            onAddressSelect={handleAddressSelect}
            onError={handleError}
            placeholder="Start typing your address..."
            googleMapsApiKey={DEMO_API_KEY}
            required
          />

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {selectedAddress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected Address</h4>
                <Button variant="ghost" size="sm" onClick={clearAddress}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-medium text-green-900">
                      {selectedAddress.formattedAddress}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Street:</span>
                        <span className="ml-1">
                          {selectedAddress.street || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">City:</span>
                        <span className="ml-1">
                          {selectedAddress.city || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">State:</span>
                        <span className="ml-1">
                          {selectedAddress.state || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ZIP:</span>
                        <span className="ml-1">
                          {selectedAddress.zipCode || "N/A"}
                        </span>
                      </div>
                    </div>
                    {selectedAddress.lat && selectedAddress.lng && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Coordinates:
                        </span>
                        <span className="ml-1 font-mono">
                          {selectedAddress.lat.toFixed(6)},{" "}
                          {selectedAddress.lng.toFixed(6)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>

      {/* Compact Variant */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Compact Variant</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Smaller size for forms with limited space
            </p>
          </div>

          <AddressAutocomplete
            onAddressSelect={(address) =>
              console.log("Compact address:", address)
            }
            placeholder="Enter delivery address..."
            googleMapsApiKey={DEMO_API_KEY}
            variant="compact"
          />
        </div>
      </Card>

      {/* Fallback Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Fallback Address Input
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manual address input when Google Maps API is not available
            </p>
          </div>

          <AddressInput
            onAddressSelect={handleFallbackAddressSelect}
            placeholder="Enter your address manually..."
          />

          {fallbackAddress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Manual Address</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFallbackAddress}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {fallbackAddress.formattedAddress}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Manual entry (no geocoding)
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>

      {/* Configuration Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Required</Badge>
              <span>Google Maps API Key with Places API enabled</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">Environment</Badge>
              <span>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span>
            </div>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">To use this component in production:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Get a Google Maps API key from Google Cloud Console</li>
              <li>Enable the Places API for your project</li>
              <li>Add the API key to your environment variables</li>
              <li>Configure appropriate usage limits and restrictions</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}
