// src/lib/api/ordering-session.ts
import { apiPost } from "@/lib/api/fetcher";

export type StartOrderingSessionRequest = {
  existingCartId?: string | null;
  marketplaceId?: string | null;
  fulfillmentMethod: string;
  redirectURL?: string;
};

export type StartOrderingSessionResponse = {
  cartId: string;
  errorMessage?: string;
};

export function startOrderingSession(
  locationId: string,
  payload: StartOrderingSessionRequest,
) {
  return apiPost<StartOrderingSessionResponse>(
    `/api/v1/locations/${locationId}/ordering-sessions`,
    payload,
  );
}
