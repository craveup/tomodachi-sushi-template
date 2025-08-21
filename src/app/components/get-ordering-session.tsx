"use client";

import React from "react";
import { useOrderingSession } from "@/hooks/use-ordering-session";
import { GetLocationViaSlugType } from "@/types/location-types";

type Props = { location: GetLocationViaSlugType };

export default function GetOrderingSession({ location }: Props) {
  const { cartId, isLoading, error } = useOrderingSession(location.id);
  console.log("Cart ID:", cartId);

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <p>{cartId}</p>
    </div>
  );
}
