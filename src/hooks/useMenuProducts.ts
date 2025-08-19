import { Menu, Product } from "@/types/menu-types";
import { useApiResource } from "./useApiResource";

const useMenuProducts = (locationId: string, menus?: Menu[]) => {
  const productIds = menus?.flatMap((menu) =>
    menu.categories.flatMap((category) => category.productIds)
  );
  const uniqueProductIds = [...new Set(productIds)];

  return useApiResource<Product[]>(
    `/api/v1/locations/${locationId}/products?productIds=${uniqueProductIds.join(
      ","
    )}`,
    { shouldFetch: menus && menus.length > 0 }
  );
};

export default useMenuProducts;
