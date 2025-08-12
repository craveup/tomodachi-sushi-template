"use client";

import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useCart } from "../providers/cart-provider";

const navigationItems = [
  { label: "MENU", isActive: false, href: "/menu" },
  { label: "ABOUT", isActive: false, href: "/about" },
  { label: "BOOK A TABLE", isActive: true, href: "/reservation" },
];

export const Navbar = () => {
  const { itemCount, openCart } = useCart();

  return (
    <nav className="inline-flex items-center justify-center gap-3 p-2 relative bg-backgrounddefault rounded-xl overflow-hidden">
      <Button
        variant="outline"
        size="icon"
        className="flex items-center justify-center w-[41px] h-[41px] relative z-[2] bg-backgroundmuted rounded-lg overflow-hidden border border-solid border-borderdefault hover:bg-backgroundmuted"
      >
        <Menu className="w-5 h-5 text-icondefault" />
      </Button>

      <div className="inline-flex items-center justify-center relative flex-[0_0_auto] z-[1]">
        <Link
          href="/"
          className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="font-heading-h4 text-textdefault tracking-wider text-xl font-bold">
            TOMODACHI
          </span>
        </Link>
      </div>

      <div className="inline-flex items-center justify-center gap-1 relative flex-[0_0_auto] z-0">
        {navigationItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Button
              variant="ghost"
              className={`inline-flex items-center justify-center gap-2.5 p-3 relative flex-[0_0_auto] rounded-lg overflow-hidden ${
                item.isActive
                  ? "bg-backgroundmuted border border-solid border-borderdefault"
                  : "hover:bg-backgroundmuted/50"
              }`}
            >
              <span className="relative w-fit font-text-meta text-textdefault text-xs tracking-wider leading-tight whitespace-nowrap font-normal">
                {item.label}
              </span>
            </Button>
          </Link>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={openCart}
        className="flex flex-col w-[41px] h-[41px] items-center justify-center gap-[5px] relative z-[2] bg-backgroundmuted rounded-lg overflow-hidden border border-solid border-borderdefault hover:bg-backgroundmuted"
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
    </nav>
  );
};

export default Navbar;
