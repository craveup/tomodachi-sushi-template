"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Leaf, Plus } from "lucide-react";
import React from "react";
import { Navbar } from "../components/navbar";
import { useCart } from "../providers/cart-provider";
import { MenuItem, ItemOptions } from "../types";

const menuCategories = [
  { id: "maki", label: "MAKI" },
  { id: "uramaki", label: "URAMAKI" },
  { id: "special", label: "SPECIAL ROLLS" },
];

const makiItems: MenuItem[] = [
  {
    id: "spicy-tuna-maki",
    name: "SPICY TUNA MAKI",
    price: 5.0,
    description:
      "A tantalizing blend of spicy tuna, cucumber, and avocado, harmoniously rolled in nori and seasoned rice.",
    image: "/images/sushi/menu-items/spicy-tuna-maki.jpg",
    category: "signature",
    calories: 280,
    isGlutenFree: false,
  },
  {
    id: "mango-maki",
    name: "MANGO MAKI",
    price: 5.0,
    description:
      "Tempura-fried shrimp, cucumber, and cream cheese embrace a center of fresh avocado, delivering a satisfying contrast of textures.",
    image: "/images/sushi/menu-items/mango-maki.jpg",
    category: "signature",
    calories: 320,
    isGlutenFree: false,
  },
  {
    id: "salmon-maki",
    name: "SALMON MAKI",
    price: 5.0,
    description:
      "Shiitake mushrooms, avocado, and pickled daikon radish nestle within a roll of seasoned rice, coated with nutty sesame seeds.",
    image: "/images/sushi/menu-items/salmon-maki.jpg",
    category: "signature",
    calories: 260,
    isGlutenFree: false,
  },
  {
    id: "tuna-maki",
    name: "TUNA MAKI",
    price: 5.0,
    description:
      "A vibrant assortment of julienned carrots, bell peppers, and cucumber, tightly encased in a nori-wrapped rice roll.",
    image: "/images/sushi/menu-items/tuna-maki.jpg",
    category: "signature",
    calories: 240,
    isGlutenFree: false,
  },
];

const uramakiItems: MenuItem[] = [
  {
    id: "volcano-delight",
    name: "VOLCANO DELIGHT",
    price: 12.0,
    description:
      "Creamy crab salad, avocado, and cucumber rolled inside, topped with spicy tuna and drizzled with fiery sriracha sauce.",
    image: "/images/sushi/menu-items/volcano-delight.jpg",
    category: "signature",
    calories: 450,
    isGlutenFree: false,
  },
  {
    id: "rainbow-fusion",
    name: "RAINBOW FUSION",
    price: 12.0,
    description:
      "A colorful blend of fresh tuna, salmon, yellowtail, and avocado, enveloping a core of cucumber and crab stick.",
    image: "/images/sushi/menu-items/rainbow-fusion.jpg",
    category: "signature",
    calories: 420,
    isGlutenFree: false,
  },
  {
    id: "dragon-elegance",
    name: "DRAGON ELEGANCE",
    price: 12.0,
    description:
      "Grilled eel and avocado nestled within the roll, draped with slices of ripe avocado resembling dragon scales.",
    image: "/images/sushi/menu-items/dragon-elegance.jpg",
    category: "signature",
    calories: 480,
    isGlutenFree: false,
  },
  {
    id: "sunset-serenity",
    name: "SUNSET SERENITY",
    price: 12.0,
    description:
      "Tempura shrimp, cucumber, and spicy mayo embraced by a roll of soy paper, crowned with slices of creamy mango.",
    image: "/images/sushi/menu-items/sunset-serenity.jpg",
    category: "signature",
    calories: 390,
    isGlutenFree: false,
  },
  {
    id: "mystic-garden",
    name: "MYSTIC GARDEN",
    price: 12.0,
    description:
      "Shiitake mushrooms, asparagus, and cucumber intermingle with crispy tempura bits, blanketed by a layer of sesame seeds.",
    image: "/images/sushi/menu-items/mystic-garden.jpg",
    category: "signature",
    calories: 350,
    isGlutenFree: true,
  },
  {
    id: "ocean-breeze",
    name: "OCEAN BREEZE",
    price: 12.0,
    description:
      "A medley of fresh shrimp, crab stick, and avocado, laced with a gentle touch of zesty yuzu-infused tobiko.",
    image: "/images/sushi/menu-items/ocean-breeze.jpg",
    category: "signature",
    calories: 380,
    isGlutenFree: false,
  },
  {
    id: "tokyo-blossom",
    name: "TOKYO BLOSSOM",
    price: 12.0,
    description:
      "Delicate pink soy paper envelopes a blend of tuna, crab stick, and cucumber, embellished with edible flower petals.",
    image: "/images/sushi/menu-items/tokyo-blossom.jpg",
    category: "signature",
    calories: 360,
    isGlutenFree: false,
  },
];

const specialRollsItems: MenuItem[] = [
  {
    id: "sunrise-bliss",
    name: "SUNRISE BLISS",
    price: 16.0,
    description:
      "A delicate combination of fresh salmon, cream cheese, and asparagus, rolled in orange-hued tobiko for a burst of sunrise-inspired flavors.",
    image: "/images/sushi/menu-items/sunrise-bliss.jpg",
    category: "signature",
    calories: 520,
    isGlutenFree: false,
  },
  {
    id: "mango-tango-fusion",
    name: "MANGO TANGO FUSION",
    price: 16.0,
    description:
      "Tempura shrimp, cucumber, and avocado dance alongside sweet mango slices, drizzled with a tangy mango sauce.",
    image: "/images/sushi/menu-items/mango-tango-fusion.jpg",
    category: "signature",
    calories: 490,
    isGlutenFree: false,
  },
  {
    id: "truffle-indulgence",
    name: "TRUFFLE INDULGENCE",
    price: 16.0,
    description:
      "Decadent slices of black truffle grace a roll of succulent wagyu beef, cucumber, and microgreens, culminating in an exquisite umami symphony.",
    image: "/images/sushi/menu-items/truffle-indulgence.jpg",
    category: "signature",
    calories: 580,
    isGlutenFree: false,
  },
  {
    id: "pacific-firecracker",
    name: "PACIFIC FIRECRACKER",
    price: 16.0,
    description:
      "Spicy crab salad, tempura shrimp, and jalapeño peppers combine in a fiery ensemble, accented with a chili-infused aioli.",
    image: "/images/sushi/menu-items/pacific-firecracker.jpg",
    category: "signature",
    calories: 510,
    isGlutenFree: false,
  },
  {
    id: "eternal-eel-enchantment",
    name: "ETERNAL EEL ENCHANTMENT",
    price: 16.0,
    description:
      "An enchanting blend of eel tempura, foie gras, and cucumber, elegantly layered with truffle oil and gold leaf for a touch of opulence.",
    image: "/images/sushi/menu-items/eternal-eel-enchantment.jpg",
    category: "signature",
    calories: 620,
    isGlutenFree: false,
  },
];

const MenuSection = ({
  title,
  items,
}: {
  title: string;
  items: MenuItem[];
}) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async (item: MenuItem) => {
    const defaultOptions: ItemOptions = {
      warming: "room-temp",
      packaging: "standard",
      giftBox: false,
    };

    try {
      await addToCart({ ...item, options: defaultOptions });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <section className="flex flex-col items-start gap-12 relative self-stretch w-full">
      <div className="flex items-center justify-center gap-4 relative self-stretch w-full">
        <div className="inline-flex items-center justify-center px-0 py-[7px] relative">
          <div className="relative w-2 h-2 border border-solid border-borderdefault -rotate-45" />
          <Separator className="relative w-[50px] h-px bg-borderdefault" />
        </div>
        <h2 className="font-heading-h3 text-textdefault text-[32px] tracking-[1px] leading-tight whitespace-nowrap">
          {title}
        </h2>
        <div className="inline-flex items-center justify-center px-0 py-[7px] relative">
          <Separator className="relative w-[50px] h-px bg-borderdefault" />
          <div className="relative w-2 h-2 border border-solid border-borderdefault -rotate-45" />
        </div>
      </div>
      <div className="flex flex-col items-start gap-8 relative self-stretch w-full">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-6 relative self-stretch w-full"
          >
            <div className="relative w-[150px] h-[100px] bg-backgrounddefault rounded-xl overflow-hidden">
              <img
                className="absolute w-[150px] h-[100px] top-0 left-0 object-cover"
                alt={item.name}
                src={item.image || "/images/sushi/menu-items/sushi-plate.jpg"}
              />
            </div>
            <div className="flex flex-col items-start gap-1 relative flex-1 grow">
              <div className="flex items-end gap-4 relative self-stretch w-full">
                <div className="inline-flex items-center gap-3 relative">
                  <h3 className="relative w-fit font-heading-h5 text-textdefault text-[22px] tracking-[1px] leading-tight whitespace-nowrap">
                    {item.name}
                  </h3>
                  {item.isGlutenFree && (
                    <Leaf className="relative w-4 h-4 text-icondefault" />
                  )}
                </div>
                <div className="flex flex-col items-end gap-2.5 px-0 py-1 relative flex-1 grow">
                  <Separator className="relative self-stretch w-full h-px border border-dashed border-borderdefault" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="relative w-fit font-heading-h5 text-textdefault text-[22px] tracking-[1px] leading-tight whitespace-nowrap">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isLoading}
                    className="flex items-center justify-center w-8 h-8 bg-backgroundprimary text-textinverse rounded-full hover:bg-backgroundprimary/80 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="relative self-stretch font-text-small text-textmuted text-[14px] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Menu = () => {
  return (
    <div className="flex flex-col items-start p-6 relative bg-backgrounddefault min-h-screen">
      <div className="flex items-start gap-4 relative self-stretch w-full flex-1 rounded-[0px_48px_48px_0px]">
        <div className="relative flex-1 grow h-[1032px] bg-black rounded-2xl overflow-hidden">
          <div className="relative w-full h-[1032px] bg-[url(/images/sushi/hero-background.png)] bg-cover bg-center">
            <div className="absolute w-full h-[381px] top-[651px] left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]">
              <div className="absolute w-[667px] top-[212px] left-[66px] font-heading-large text-textdefault text-[112px] tracking-[2px] leading-none">
                MENU
              </div>
            </div>

            <header className="absolute top-12 left-12">
              <Navbar />
            </header>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 relative flex-1 grow">
          <Card className="flex flex-col items-start gap-16 pt-8 pb-20 px-24 relative self-stretch w-full rounded-2xl border border-solid border-borderdefault bg-backgrounddefault">
            <CardContent className="flex flex-col items-start gap-8 relative self-stretch w-full p-0">
              <div className="flex gap-2 relative self-stretch w-full items-center justify-center p-2 rounded-xl">
                <div className="flex items-center justify-center gap-1 relative flex-1 grow">
                  {menuCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="px-3 py-2 inline-flex items-center justify-center gap-2.5 relative rounded-lg overflow-hidden border border-solid border-borderdefault bg-backgroundmuted text-textdefault"
                    >
                      <span className="font-text-meta text-xs tracking-wider leading-tight whitespace-nowrap">
                        {category.label}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <div className="flex flex-col items-start gap-24 relative self-stretch w-full">
              <MenuSection title="MAKI" items={makiItems} />
              <MenuSection title="URAMAKI" items={uramakiItems} />
              <MenuSection title="SPECIAL ROLLS" items={specialRollsItems} />
            </div>
          </Card>

          <footer className="flex items-center justify-around gap-20 pl-6 pr-5 py-5 relative self-stretch w-full bg-transparent rounded-2xl border border-solid border-borderdefault">
            <div className="inline-flex items-center gap-4 relative">
              <span className="relative w-fit font-text-small text-textdefault text-[14px] leading-relaxed whitespace-nowrap">
                By Pawel Gola
              </span>

              <div className="relative w-2 h-2 border border-solid border-borderdefault -rotate-45" />

              <span className="relative w-fit font-text-small text-textdefault text-[14px] leading-relaxed whitespace-nowrap">
                Licensing
              </span>

              <div className="relative w-2 h-2 border border-solid border-borderdefault -rotate-45" />

              <span className="relative w-fit font-text-small text-textdefault text-[14px] leading-relaxed whitespace-nowrap">
                Styleguide
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Menu;
