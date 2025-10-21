import { createStorefrontClient } from "@craveup/storefront-sdk";
import { getAuthToken } from "@/lib/local-storage";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL must be defined to initialize the storefront SDK client.");
}

export const storefrontClient = createStorefrontClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  getAuthToken,
});
