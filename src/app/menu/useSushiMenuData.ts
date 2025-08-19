"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "../types";
import { useOrderingSession } from "@/hooks/use-ordering-session";
import useMenus from "@/hooks/useMenus";
import useMenuProducts from "@/hooks/useMenuProducts";

type Section = {
  id: string; // stable id for scroll + tab
  label: string; // what you render on the tab
  productIds: string[];
  items: MenuItem[]; // sushi card-ready items
  isActive: boolean;
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Adapter: map your product object → MenuItem (what TomodachiMenuSection needs)
function toMenuItem(p: any, fallbackCategory: string): MenuItem {
  // try multiple common fields; keep it defensive
  const priceNumber =
    typeof p?.price === "number"
      ? p.price
      : p?.priceCents
      ? p.priceCents / 100
      : p?.priceDecimal
      ? parseFloat(p.priceDecimal)
      : parseFloat(p?.price ?? "0");

  const image =
    p?.image ??
    p?.imageUrl ??
    p?.images?.[0]?.url ??
    p?.images?.[0] ??
    "/images/sushi/menu-items/sushi-plate.jpg";

  return {
    id: p?.id,
    name: p?.name ?? "Unnamed",
    description: p?.description ?? p?.shortDescription ?? "",
    price: Number.isFinite(priceNumber) ? priceNumber : 0,
    image,
    category: p?.categorySlug ?? p?.category?.slug ?? fallbackCategory,
    // you can add other optional flags if your UI uses them:
    isPopular: !!p?.isPopular,
    isNew: !!p?.isNew,
    calories: p?.calories,
  } as MenuItem;
}

export function useSushiMenuData(locationId: string) {
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

  // 1) ordering session → get cartId so “Add” works with real API
  const {
    cartId,
    isLoading: sessionLoading,
    error: sessionError,
  } = useOrderingSession(locationId);

  // 2) menus (e.g., Lunch / Dinner) with categories
  const {
    data: menus,
    isLoading: menusLoading,
    error: menusError,
    mutate: refetchMenus,
  } = useMenus(locationId);

  // 3) all products for the current menus
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useMenuProducts(locationId, menus);

  const productMap = useMemo(
    () => new Map((products ?? []).map((p: any) => [p.id, p])),
    [products]
  );

  // Build “sections” your sushi page expects
  const sections: Section[] = useMemo(() => {
    if (!menus || !menus.length) return [];
    const menu = menus[selectedMenuIndex]!;
    const { categories = [], isActive } = menu;

    return categories.map((cat: any) => {
      const catSlug = cat.slug ?? toSlug(cat.name ?? "category");
      const items: MenuItem[] = (cat.productIds ?? [])
        .map((pid: string) => productMap.get(pid))
        .filter(Boolean)
        .map((p: any) => toMenuItem(p, catSlug));

      return {
        id: catSlug, // used for tabs/scroll anchors
        label: cat.name ?? catSlug, // what you render in the tab
        productIds: cat.productIds ?? [],
        items,
        isActive: !!isActive,
      };
    });
  }, [menus, selectedMenuIndex, productMap]);

  return {
    // session/cart
    cartId,
    sessionError,

    // menu data
    menus,
    sections,
    selectedMenuIndex,
    setSelectedMenuIndex,

    // status
    loading: sessionLoading || menusLoading || productsLoading,
    error: sessionError || menusError || productsError,
    refetchMenus,
  };
}
