"use client";

import { Clock, MapPin, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FulfillmentMethodHandlerProps {
  fulfillmentMethod: string;
  cartId: string;
  locationData: any;
}

const FulfillmentMethodHandler = ({
  fulfillmentMethod,
  cartId,
  locationData,
}: FulfillmentMethodHandlerProps) => {
  const getMethodIcon = () => {
    switch (fulfillmentMethod?.toLowerCase()) {
      case "delivery":
        return <MapPin className="h-4 w-4" />;
      case "pickup":
        return <Store className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getMethodLabel = () => {
    switch (fulfillmentMethod?.toLowerCase()) {
      case "delivery":
        return "Delivery";
      case "pickup":
        return "Pickup";
      default:
        return fulfillmentMethod || "Unknown";
    }
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2 mb-2">
        {getMethodIcon()}
        <span className="font-medium">{getMethodLabel()}</span>
        <Badge variant="secondary" className="text-xs">
          {fulfillmentMethod || "Unknown"}
        </Badge>
      </div>

      {locationData && (
        <div className="text-sm text-muted-foreground">
          <p>{locationData.displayName || locationData.name}</p>
          {locationData.address && <p>{locationData.address}</p>}
        </div>
      )}

      <div className="mt-2 text-sm text-muted-foreground">
        <p>Order will be ready in 15-20 minutes</p>
      </div>
    </div>
  );
};

export default FulfillmentMethodHandler;
