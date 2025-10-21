// src/hooks/use-ordering-session.ts
"use client";

import { useEffect, useState } from "react";
import {
  startOrderingSession,
  type StartOrderingSessionRequest,
} from "@/lib/api/ordering-session";
import { getCartId, setCartId } from "@/lib/local-storage";
import { formatApiError } from "@/lib/format-api-error";
import { useCartStore } from "@/store/cart-store";
import { DEFAULT_FULFILLMENT_METHOD } from "@/constants";

type UseOrderingSessionResult = {
  cartId: string | null;
  isLoading: boolean;
  error: string;
  orderingError: string;
};

export function useOrderingSession(
  locationId: string,
): UseOrderingSessionResult {
  const { cartId, setCartIdState, isLoading, setIsLoading } = useCartStore();
  const [error, setError] = useState("");
  const [orderingError, setOrderingError] = useState("");

  useEffect(() => {
    if (!locationId) {
      return;
    }

    let cancelled = false;

    async function init() {
      if (cartId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");
      setOrderingError("");

      const existingCartId =
        getCartId(locationId, DEFAULT_FULFILLMENT_METHOD) || undefined;
      const redirectUrl =
        typeof window !== "undefined" ? window.location.origin : undefined;

      const payload: StartOrderingSessionRequest = {
        existingCartId,
        fulfillmentMethod: DEFAULT_FULFILLMENT_METHOD,
      };

      if (redirectUrl) {
        payload.redirectURL = redirectUrl;
      }

      try {
        const { cartId: newCartId, errorMessage } = await startOrderingSession(
          locationId,
          payload,
        );

        if (cancelled) return;

        const nextCartId = newCartId ?? existingCartId ?? null;
        if (nextCartId) {
          setCartId(locationId, nextCartId, DEFAULT_FULFILLMENT_METHOD);
          setCartIdState(nextCartId);
        }

        setOrderingError(errorMessage ?? "");
      } catch (e) {
        if (cancelled) return;
        const { message } = formatApiError(e);
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [cartId, locationId, setCartIdState, setIsLoading]);

  return { cartId, isLoading, error, orderingError };
}
