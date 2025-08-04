import type { Metadata } from "next";
import LeclercMenuPage from "./leclerc-menu";

export const metadata: Metadata = {
  title: "Menu - Leclerc Bakery | Artisanal Pastries, Cookies & French Baked Goods",
  description: "Browse our full menu of handcrafted French pastries, signature cookies, seasonal treats, and artisanal breads. Fresh baked daily with premium ingredients at Leclerc Bakery.",
};

export default function LeclercMenu() {
  return (
    <div>
      <LeclercMenuPage />
    </div>
  );
}
