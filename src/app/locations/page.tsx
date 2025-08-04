import type { Metadata } from "next";
import LeclercLocationsPage from "./leclerc-location";

export const metadata: Metadata = {
  title: "Locations - Leclerc Bakery | Find Your Nearest French Bakery",
  description: "Find Leclerc Bakery locations near you. Visit our artisanal French bakery for fresh pastries, handcrafted cookies, and traditional baked goods. Store hours, directions, and contact information.",
};

export default function LeclercMenu() {
  return (
    <div>
      <LeclercLocationsPage />
    </div>
  );
}
