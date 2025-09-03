import { LocationType } from "@craveup/types";

export interface LocationTheme {
  background: string; // "0 0% 100%"
  foreground: string; // "222.2 84% 4.9%"
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  radius: string;
  fontFamily: string;
}

type PartialLocation = Pick<
  LocationType,
  | "id"
  | "restaurantSlug"
  | "restaurantDisplayName"
  | "restaurantBio"
  | "coverPhoto"
  | "restaurantLogo"
  | "addressString"
>;

export type GetLocationViaSlugType = PartialLocation & {
  isOrderingAllowed: boolean;
  isScheduledOrderAllowed: boolean;
  theme?: LocationTheme;
};

export interface LocationComponentProps {
  locationData: GetLocationViaSlugType;
  cartId: string | null;
  error: string;
}
