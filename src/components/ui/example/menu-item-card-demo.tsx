"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { ChevronDown } from "lucide-react";
import {
  MenuItemCardHorizontal,
  MenuItemCardVertical,
} from "@/components/crave-ui/menu-components/menu-item-card";

export default function MenuItemCardDemo() {
  const [variant, setVariant] = useState("horizontal");

  return (
    <div className="w-full space-y-6">
      {/* Variant Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Variant:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-32 justify-between">
              {variant === "horizontal" ? "Horizontal" : "Vertical"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuItem onClick={() => setVariant("horizontal")}>
              Horizontal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVariant("vertical")}>
              Vertical
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Component Preview */}
      <div className="flex justify-center">
        {variant === "horizontal" ? (
          <div className="w-full max-w-lg">
            <MenuItemCardHorizontal
              name="Karaage Chicken Katsu Sando"
              description="Crispy Japanese-style fried chicken thigh glazed with spicy miso-honey sauce, served on buttery brioche with pickled cabbage slaw, kewpie mayo, and shichimi togarashi. Inspired by Nashville heat with Japanese technique."
              price={18.0}
              rating="97%"
              reviewCount="89"
              imageUrl="/images/food/karaage-chicken-katsu-sando.jpg"
              imageAlt="Karaage Chicken Katsu Sando"
              badge="Chef's Fusion"
              onClick={() => console.log("Clicked Karaage Chicken Katsu Sando")}
            />
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <MenuItemCardVertical
              name="Karaage Chicken Katsu Sando"
              description="Crispy Japanese-style fried chicken thigh glazed with spicy miso-honey sauce, served on buttery brioche with pickled cabbage slaw, kewpie mayo, and shichimi togarashi. Inspired by Nashville heat with Japanese technique."
              price={18.0}
              rating="97%"
              reviewCount="89"
              imageUrl="/images/food/karaage-chicken-katsu-sando.jpg"
              imageAlt="Karaage Chicken Katsu Sando"
              badge="Chef's Fusion"
              onClick={() => console.log("Clicked Karaage Chicken Katsu Sando")}
              onAddToCart={() =>
                console.log("Added Karaage Chicken Katsu Sando to cart")
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
