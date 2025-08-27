// src/hooks/use-ordering-session.ts
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { startOrderingSession } from "@/lib/api/ordering-session";
import { getCartId, setCartId } from "@/lib/local-storage";
import { formatApiError } from "@/lib/format-api-error";

type UseOrderingSessionResult = {
  cartId: string | null;
  isLoading: boolean;
  error: string;
  orderingError: string;
};

export function useOrderingSession(
  locationId: string
): UseOrderingSessionResult {
  const params = useSearchParams();
  const [cartId, setCartIdState] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(() => !cartId);
  const [error, setError] = useState("");
  const [orderingError, setOrderingError] = useState("");

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

        const response = await startOrderingSession(locationId, payload);
        const { cartId: newCartId, errorMessage } = response;

        if (cancelled) return;

        if (newCartId) {
          setCartId(locationId, newCartId);
          setCartIdState(newCartId);
        }

        setOrderingError(errorMessage);
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

  return { cartId, isLoading, error, orderingError };
}
