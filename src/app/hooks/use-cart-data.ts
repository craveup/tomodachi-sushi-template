import { useCart } from "@/hooks/useCart";
import type { CartResponse } from "@/lib/api/types";

type UseCartDataParams = {
  locationId?: string;
  cartId?: string | null;
};

const useCartData = (params?: UseCartDataParams) => {
  const { cart, error, isLoading, mutate } = useCart({
    locationId: params?.locationId,
    cartId: params?.cartId ?? null,
  });

  return {
    data: cart as CartResponse | undefined,
    error,
    isLoading,
    mutate,
  };
};

export default useCartData;
