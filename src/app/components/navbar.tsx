"use client";

import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useCart } from "../providers/cart-provider";

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

export const Navbar = () => {
  const { itemCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="relative bg-backgrounddefault rounded-xl overflow-hidden w-full max-w-none md:max-w-fit md:w-auto">
        {/* Mobile & Desktop Layout */}
        <div className="flex items-center justify-between p-3 md:p-2 gap-2 md:gap-3">
          {/* Mobile Menu Button (visible on mobile only) */}
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

          {/* Brand/Logo */}
          <div className="flex items-center justify-center flex-1 md:flex-initial px-2">
            <Link
              href="/"
              className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="font-heading-h4 text-textdefault tracking-wider text-xl md:text-xl font-bold">
                TOMODACHI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button
                  variant="ghost"
                  className={`inline-flex items-center justify-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    item.isActive
                      ? "bg-backgroundmuted border border-borderdefault"
                      : "hover:bg-backgroundmuted/50"
                  }`}
                >
                  <span className="font-text-meta text-textdefault text-xs tracking-wider leading-tight whitespace-nowrap font-normal">
                    {item.label}
                  </span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Cart Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={openCart}
            className="flex items-center justify-center w-[44px] h-[44px] bg-backgroundmuted rounded-lg border border-borderdefault hover:bg-backgroundmuted flex-shrink-0"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-icondefault" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-backgroundprimary text-textinverse text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-backgrounddefault rounded-xl border border-borderdefault shadow-xl z-50 overflow-hidden">
            <div className="flex flex-col p-2 gap-1">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start px-4 py-3 rounded-lg transition-colors ${
                      item.isActive
                        ? "bg-backgroundmuted border border-borderdefault"
                        : "hover:bg-backgroundmuted/50"
                    }`}
                  >
                    <span className="font-text-meta text-textdefault text-sm tracking-wider font-normal">
                      {item.label}
                    </span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
