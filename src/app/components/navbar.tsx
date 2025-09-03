"use client";

import React from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import CartSidebar from "@/components/crave-ui/cart-component/cart-sidebar";
import { useCart } from "@/hooks/useCart";
import {
    location_Id,
} from "@/constants";
import CartCountBtn from "@/app/components/CartCountBtn";
import {useCartStore} from "@/store/cart-store";

const navigationItems = [
  { label: "MENU", shortLabel: "MENU", isActive: false, href: "/menu" },
  { label: "ABOUT", shortLabel: "ABOUT", isActive: false, href: "/about" },
  {
    label: "BOOK A TABLE",
    shortLabel: "RESERVE",
    isActive: true,
    href: "/reservation",
  },
];

const title = "Tomodachi Sushii"

export const Navbar = () => {
  const router = useRouter();
 const searchParams = useSearchParams();
 const {cartId} = useCartStore();
 const {cart, mutate} = useCart({locationId: location_Id, cartId: cartId || searchParams.get("cartId")});

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const openCart = async () => {
    await mutate();
    setIsCartOpen(true);
  };

  const closeCart = () => setIsCartOpen(false);

  const goToCheckout = () => {
    setIsCartOpen(false);
    router.push(`/locations/${location_Id}/carts/${cartId}/checkout`);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="relative bg-backgrounddefault rounded-xl w-full max-w-none md:max-w-fit md:w-auto md:overflow-hidden">
        <div className="flex items-center justify-between p-3 md:p-2 gap-2 md:gap-3">
          {/* Mobile menu toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMobileMenu}
            className="flex md:hidden items-center justify-center w-[44px] h-[44px] bg-backgroundmuted rounded-lg border border-borderdefault hover:bg-backgroundmuted flex-shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-icondefault" />
            ) : (
              <Menu className="w-5 h-5 text-icondefault" />
            )}
          </Button>

          {/* Brand */}
          <div className="flex items-center justify-center flex-1 md:flex-initial px-2">
            <Link
              href="/"
              className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="font-heading-h4 uppercase text-textdefault tracking-wider text-lg md:text-xl font-bold">
                {title}
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
                const isBook = item.label === "BOOK A TABLE";
                const isMenu = item.label === "MENU";

                let link = item.href;

                if(isMenu) {
                    link = `${item.href}?cartId=${cartId}`;
                }

              return (
                <Link key={item.label} href={link}>
                  <Button
                    variant="ghost"
                    className={`inline-flex cursor-pointer items-center justify-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                      isBook
                        ? "group bg-backgroundmuted border border-borderdefault hover:bg-backgroundprimary hover:text-textinverse"
                        : item.isActive
                        ? "bg-backgroundmuted border border-borderdefault"
                        : "hover:bg-backgroundmuted/50"
                    }`}
                  >
                    <span
                      className={`font-text-meta text-xs tracking-wider leading-tight whitespace-nowrap font-normal ${
                        isBook
                          ? "text-textdefault group-hover:text-textinverse"
                          : "text-textdefault"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Cart button with live badge */}
          <CartCountBtn openCart={openCart} isCartOpen={isCartOpen} itemCount={cart?.totalQuantity ?? 0} />
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-backgrounddefault rounded-xl border border-borderdefault shadow-xl z-50 overflow-hidden">
            <div className="flex flex-col p-2 gap-1">
              {navigationItems.map((item) => {
                const isBook = item.label === "BOOK A TABLE";
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start px-4 py-3 rounded-lg transition-colors ${
                        isBook
                          ? "group bg-backgroundmuted border border-borderdefault hover:bg-backgroundprimary hover:text-textinverse"
                          : item.isActive
                          ? "bg-backgroundmuted border border-borderdefault"
                          : "hover:bg-backgroundmuted/50"
                      }`}
                    >
                      <span
                        className={`font-text-meta text-sm tracking-wider font-normal ${
                          isBook
                            ? "text-textdefault group-hover:text-textinverse"
                            : "text-textdefault"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Cart sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={closeCart}
        onCheckout={goToCheckout}
      />
    </>
  );
};

export default Navbar;
