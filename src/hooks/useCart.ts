// src/hooks/useCart.ts
import { useParams } from "next/navigation";
import { useApiResource } from "./useApiResource";
import { CartResponse } from "@/types/cart-types";
import {
  location_Id as LOCATION_ID,
} from "@/constants";

type UseCartOptions = {
  locationId?: string;
  cartId?: string;
  shouldFetch?: boolean;
};

export function useCart(options: UseCartOptions = {}) {
  const routeParams = useParams<{ locationId?: string; cartId?: string }>();

  const locationId =
    options.locationId ?? routeParams?.locationId ?? LOCATION_ID;
  const cartId = options.cartId ?? routeParams?.cartId;

  // default true, but auto disables if IDs are missing
  const shouldFetch = options.shouldFetch ?? true;
  const effectiveShouldFetch = shouldFetch && Boolean(locationId && cartId);

  const { data, error, errorMessage, isLoading, isValidating, mutate } =
    useApiResource<CartResponse>(
      effectiveShouldFetch && locationId && cartId
        ? `/api/v1/locations/${locationId}/carts/${cartId}`
        : null
    );

  return {
    cart: data,
    error,
    errorMessage,
    isLoading,
    isValidating,
    mutate,
    shouldFetch: effectiveShouldFetch,
  };
}
