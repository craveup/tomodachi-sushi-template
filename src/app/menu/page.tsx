"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
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
  const [activeSection, setActiveSection] = useState("maki");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({
    maki: null,
    uramaki: null,
    special: null,
  });

  // Scroll to section when tab is clicked
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const sectionTop = section.offsetTop - container.offsetTop;
      container.scrollTo({
        top: sectionTop - 20, // Small offset
        behavior: "smooth",
      });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;

      let currentSection = "maki";
      let closestDistance = Infinity;

      Object.entries(sectionRefs.current).forEach(
        ([sectionId, sectionElement]) => {
          if (sectionElement) {
            // Get the position of the section relative to the container
            const sectionTop = sectionElement.offsetTop;
            // Calculate distance from current scroll position
            const distance = Math.abs(scrollTop - sectionTop);

            if (distance < closestDistance) {
              closestDistance = distance;
              currentSection = sectionId;
            }
          }
        }
      );

      setActiveSection(currentSection);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Call once to set initial state
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

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
          <Card className="flex flex-col items-start gap-6 pt-8 pb-0 px-24 relative self-stretch w-full h-full rounded-2xl border border-solid border-borderdefault bg-backgrounddefault overflow-hidden">
            <CardContent className="flex flex-col items-start gap-8 relative self-stretch w-full p-0">
              <div className="flex gap-2 relative self-stretch w-full items-center justify-center p-2 rounded-xl">
                <div className="flex items-center justify-center gap-1 relative flex-1 grow">
                  {menuCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => scrollToSection(category.id)}
                      className={`px-3 py-2 inline-flex items-center justify-center gap-2.5 relative rounded-lg overflow-hidden border border-solid transition-colors cursor-pointer ${
                        activeSection === category.id
                          ? "border-backgroundprimary bg-backgroundprimary text-textinverse"
                          : "border-borderdefault bg-backgroundmuted text-textdefault hover:bg-backgroundprimary/10"
                      }`}
                    >
                      <span className="font-text-meta text-xs tracking-wider leading-tight whitespace-nowrap">
                        {category.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>

            <div
              ref={scrollContainerRef}
              className="flex flex-col items-start gap-8 relative self-stretch w-full flex-1 overflow-y-scroll px-0 pb-8 min-h-0 scrollbar-hide"
              style={{ scrollbarGutter: "stable" }}
            >
              <TomodachiMenuSection
                title="MAKI"
                items={makiItems}
                sectionId="maki"
                onSectionMount={(id, element) => {
                  sectionRefs.current[id] = element;
                }}
              />
              <TomodachiMenuSection
                title="URAMAKI"
                items={uramakiItems}
                sectionId="uramaki"
                onSectionMount={(id, element) => {
                  sectionRefs.current[id] = element;
                }}
              />
              <TomodachiMenuSection
                title="SPECIAL ROLLS"
                items={specialRollsItems}
                sectionId="special"
                onSectionMount={(id, element) => {
                  sectionRefs.current[id] = element;
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Menu;
