import { createStorefrontClient } from "@craveup/storefront-sdk";
import { getAuthToken } from "@/lib/local-storage";

export const storefrontClient = createStorefrontClient({
  getAuthToken,
});
