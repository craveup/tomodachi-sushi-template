"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import React from "react";
import { Navbar } from "../components/navbar";
import { useCart } from "../providers/cart-provider";
import { MenuItem } from "../types";
import { menuData } from "../data/menu-data";
import { TomodachiMenuSection } from "../components/tomodachi-menu-section";

const menuCategories = [
  { id: "maki", label: "MAKI" },
  { id: "uramaki", label: "URAMAKI" },
  { id: "special", label: "SPECIAL ROLLS" },
];

// Import menu items from centralized data
const makiItems = menuData.maki;
const uramakiItems = menuData.uramaki;
const specialRollsItems = menuData.specialRolls;

// MenuSection component moved to ../components/tomodachi-menu-section.tsx

const Menu = () => {
  return (
    <div className="flex flex-col items-start p-6 relative bg-backgrounddefault h-screen overflow-hidden">
      <div className="flex items-start gap-4 relative self-stretch w-full flex-1 min-h-0">
        <div className="relative flex-1 grow h-full bg-black rounded-2xl overflow-hidden">
          <div className="relative w-full h-full bg-[url(/images/sushi/hero-background.png)] bg-cover bg-center">
            <div className="absolute w-full h-[381px] bottom-0 left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]">
              <div className="absolute bottom-8 left-16 font-heading-large text-textdefault text-[112px] tracking-[2px] leading-none">
                MENU
              </div>
            </div>

            <header className="absolute top-12 left-12">
              <Navbar />
            </header>
          </div>
        </div>

        <div className="flex flex-col items-start relative flex-1 grow h-full min-h-0">
          <Card className="flex flex-col items-start gap-6 pt-8 pb-8 px-24 relative self-stretch w-full h-full rounded-2xl border border-solid border-borderdefault bg-backgrounddefault overflow-hidden">
            <CardContent className="flex flex-col items-start gap-8 relative self-stretch w-full p-0">
              <Tabs
                defaultValue="maki"
                className="flex flex-col items-start relative self-stretch w-full h-full min-h-0"
              >
                <div className="flex gap-2 relative self-stretch w-full items-center justify-center p-2 rounded-xl">
                  <TabsList className="flex items-center justify-center gap-1 relative flex-1 grow bg-transparent h-auto p-0">
                    {menuCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="px-3 py-2 inline-flex items-center justify-center gap-2.5 relative rounded-lg overflow-hidden border border-solid border-borderdefault bg-backgroundmuted text-textdefault data-[state=active]:bg-backgroundprimary data-[state=active]:text-textinverse data-[state=active]:border-backgroundprimary hover:bg-backgroundprimary/10 transition-colors"
                      >
                        <span className="font-text-meta text-xs tracking-wider leading-tight whitespace-nowrap">
                          {category.label}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="flex flex-col items-start gap-12 relative self-stretch w-full flex-1 overflow-y-auto pr-4 pb-8 min-h-0">
                  <TabsContent value="maki" className="m-0 w-full">
                    <TomodachiMenuSection title="MAKI" items={makiItems} />
                  </TabsContent>
                  <TabsContent value="uramaki" className="m-0 w-full">
                    <TomodachiMenuSection
                      title="URAMAKI"
                      items={uramakiItems}
                    />
                  </TabsContent>
                  <TabsContent value="special" className="m-0 w-full">
                    <TomodachiMenuSection
                      title="SPECIAL ROLLS"
                      items={specialRollsItems}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Menu;
