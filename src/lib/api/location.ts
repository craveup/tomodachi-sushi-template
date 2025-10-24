// /app/lib/api/location.ts
import { GetLocationViaSlugType } from "@/types/location-types";
import { apiFetch } from "./fetcher";

export async function getLocationById(
  locationId: string
): Promise<GetLocationViaSlugType> {
  return apiFetch(`/api/v1/locations/${locationId}`);
}
