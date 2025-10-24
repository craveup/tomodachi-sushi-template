"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircularLoader } from "@/components/ui/CircularLoader";
import { useCart } from "@/hooks/useCart";
import useMenus from "@/hooks/useMenus";
import type { BundleCategory, BundleMenu } from "@/types/menus";
import { location_Id as LOCATION_ID } from "@/constants";
import { MenuSwitcher } from "@/app/components/menu/menu-switcher";
import ProductDescriptionDialog from "../components/product-description/ProductDescriptionDialog";
import { TomodachiMenuSection } from "../components/tomodachi-menu-section";
import {useCartStore} from "@/store/cart-store";

export const dynamic = "force-dynamic";

const MenuPageClient = () => {
  const { cartId, locationId: activeLocationId } = useCart();
  const locationId = activeLocationId ?? LOCATION_ID;

  const {
    data: menusData,
    isLoading: menusLoading,
    error: menusError,
  } = useMenus({ locationId });

  const rawMenus = menusData?.menus;
  const menus = useMemo(() => rawMenus ?? [], [rawMenus]);

  const [selectedMenuId, setSelectedMenuId] = useState<string>(
    () => menus[0]?.id ?? ""
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const openProduct = useCallback((id: string) => setSelectedProductId(id), []);
  const closeProduct = useCallback(() => setSelectedProductId(""), []);

  useEffect(() => {
    if (!menus.length) {
      setSelectedMenuId("");
      return;
    }

    const hasSelectedMenu = menus.some((menu) => menu.id === selectedMenuId);
    if (!hasSelectedMenu) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId]);

  const menu: BundleMenu | undefined = useMemo(
    () => menus.find((entry) => entry.id === selectedMenuId) ?? menus[0],
    [menus, selectedMenuId]
  );

  const menuCategories = useMemo(
    () => (menu?.categories ?? []) as BundleCategory[],
    [menu]
  );

  const getProductsForCategory = (category: BundleCategory) => {
    if (!category?.products?.length) return [];

    return category.products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price:
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price,
      image: product.images?.[0] || null,
      category: "signature" as const,
      calories: 0,
      isNew: false,
      isPopular: false,
      isGlutenFree: false,
    }));
  };

  const [activeSection, setActiveSection] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!menuCategories.length) {
      setActiveSection("");
      return;
    }

    const currentIsValid = menuCategories.some(
      (category) => category.id === activeSection
    );

    if (!currentIsValid) {
      setActiveSection(menuCategories[0].id);
    }
  }, [menuCategories, activeSection]);

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    const container = scrollContainerRef.current;
    if (section && container) {
      const sectionTop = section.offsetTop - container.offsetTop;
      container.scrollTo({ top: sectionTop - 20, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const scrollTop = container.scrollTop;

      let current = menuCategories[0]?.id ?? "";
      let closest = Infinity;

      for (const category of menuCategories) {
        const element = sectionRefs.current[category.id];
        if (!element) continue;

        const sectionTop = element.offsetTop - container.offsetTop;
        const distance = Math.abs(scrollTop - sectionTop);
        if (distance < closest) {
          closest = distance;
          current = category.id;
        }
      }

      setActiveSection(current);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [menuCategories]);

  const isInitialLoading = menusLoading && menus.length === 0;
  const hasMenuData = Boolean(menu && menuCategories.length);

  return (
    <>
      <div className="flex flex-col items-start relative w-full lg:flex-1 lg:grow h-auto lg:h-full lg:min-h-0">
        <Card className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-borderdefault bg-backgrounddefault shadow-lg">
          <CardContent className="relative flex h-full flex-col p-0">
            <div
              ref={scrollContainerRef}
              className="relative flex h-full flex-col overflow-y-auto"
              style={{ scrollbarGutter: "stable both-edges" }}
            >
              {isInitialLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <CircularLoader />
                </div>
              ) : (
                <>
                  {menus.length > 0 && (
                    <div className="px-4 pt-6 pb-4 sm:px-6 lg:px-8">
                      <MenuSwitcher
                        menus={menus}
                        activeMenuId={selectedMenuId}
                        onChange={(menuId) => setSelectedMenuId(menuId)}
                      />
                    </div>
                  )}

                  {menuCategories.length > 0 && (
                    <div className="sticky top-0 z-10 border-y border-borderdefault/40 bg-backgrounddefault/95 px-4 py-3 sm:px-6 lg:px-8 backdrop-blur-sm supports-[backdrop-filter]:bg-backgrounddefault/80">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {menuCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => scrollToSection(category.id)}
                            className={`px-3 py-2 inline-flex items-center justify-center gap-2 rounded-lg border border-solid transition-colors cursor-pointer min-h-[40px] ${
                              activeSection === category.id
                                ? "border-backgroundprimary bg-backgroundprimary text-textinverse"
                                : "border-borderdefault bg-backgroundmuted text-textdefault hover:bg-backgroundprimary/10"
                            }`}
                          >
                            <span className="font-text-meta text-xs uppercase tracking-[0.2em]">
                              {category.name.split("&")[0].trim()}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
                    {menusLoading && menus.length > 0 && (
                      <div className="flex w-full justify-center">
                        <CircularLoader />
                      </div>
                    )}

                    {menusError && !menusLoading && (
                      <div className="px-4 py-8 text-center text-red-500">
                        Failed to load menu.
                      </div>
                    )}

                    {!menusLoading && !menusError && !hasMenuData && (
                      <div className="px-4 py-8 text-center text-textmuted">
                        No menu is currently available.
                      </div>
                    )}

                    {!menusLoading &&
                      !menusError &&
                      menu?.categories?.map((category) => (
                        <TomodachiMenuSection
                          key={category.id}
                          title={category.name}
                          items={getProductsForCategory(category)}
                          sectionId={category.id}
                          locationId={locationId}
                          onSectionMount={(id, element) => {
                            sectionRefs.current[id] = element;
                          }}
                          onItemClick={(id: string) => openProduct(id)}
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedProductId && (
        <ProductDescriptionDialog
          productId={selectedProductId}
          locationId={locationId}
          cartId={cartId ?? ""}
          isAddToCartBlocked={!cartId}
          onClose={closeProduct}
        />
      )}
    </>
  );
};

export default MenuPageClient;
