"use client";

import React, { Suspense } from "react";
import { useOrderingSession } from "@/hooks/use-ordering-session";
import { GetLocationViaSlugType } from "@/types/location-types";

type Props = { location: GetLocationViaSlugType };

function GetOrderingSessionContent({ location }: Props) {
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

export default function GetOrderingSession(props: Props) {
  return (
    <Suspense fallback={<div><p>Loading...</p></div>}>
      <GetOrderingSessionContent {...props} />
    </Suspense>
  );
}
