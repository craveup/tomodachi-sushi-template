// src/hooks/use-ordering-session.ts
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCartId, setCartId } from "@/lib/local-storage";
import { startOrderingSession } from "@/lib/api/ordering-session";
import { formatApiError } from "@/lib/format-api-error";

type UseOrderingSessionResult = {
  cartId: string | null;
  isLoading: boolean;
  error: string;
};

export function useOrderingSession(
  locationId: string
): UseOrderingSessionResult {
  const params = useSearchParams();
  const [cartId, setCartIdState] = useState<string | null>(() =>
    getCartId(locationId)
  );
  const [isLoading, setIsLoading] = useState<boolean>(() => !cartId);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // if we already have a cart, nothing to do
      if (cartId) {
        setIsLoading(false);
        return;
      }

      try {
        const payload = {
          searchParams: params.toString(),
          existingCartId: getCartId(locationId),
        };

        const { cartId: newCartId } = await startOrderingSession(
          locationId,
          payload
        );

        if (cancelled) return;
        setCartId(locationId, newCartId);
        setCartIdState(newCartId);
      } catch (e) {
        if (cancelled) return;
        const { message } = formatApiError(e);
        setError(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [locationId, params]);

  return { cartId, isLoading, error };
}
