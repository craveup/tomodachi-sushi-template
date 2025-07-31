import { useParams } from "next/navigation";
import { CartResponse } from "@/lib/api/types";
import useApiData from "./use-api-data";

const useCartData = (params?: { locationId: string; cartId: string }) => {
  const urlParams = useParams();

  const locationId = params?.locationId ?? (urlParams?.locationId as string);
  const cartId = params?.cartId ?? (urlParams?.cartId as string);

  const { data, error, mutate } = useApiData<CartResponse>(
    `/api/v1/locations/${locationId}/carts/${cartId}`,
    Boolean(locationId && cartId)
  );

  return {
    data: data!,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export default useCartData;
