import { getCartId } from "@/lib/local-storage";
import { useCart } from "@/hooks/useCart";
import { useApiResource } from "@/hooks/useApiResource";
import { BundleMenu } from "@/types/menus";

const useMenus = (locationId: string, isEnabled = true) => {
  const cartId = getCartId(locationId);

  const { cart: cartData } = useCart({
    locationId: locationId,
    cartId: cartId!,
  });

  const shouldFetch = Boolean(
    isEnabled && cartData?.orderDate && cartData?.orderTime
  );

  return useApiResource<BundleMenu[]>(
    `/api/v1/locations/${locationId}/menus?orderDate=${cartData?.orderDate}&orderTime=${cartData?.orderTime}`,
    { shouldFetch }
  );
};

export default useMenus;
