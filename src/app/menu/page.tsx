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
  { id: "nigiri", label: "NIGIRI" },
  { id: "uramaki", label: "ROLLS" },
  { id: "special", label: "CHEF'S CREATIONS" },
];

// Import menu items from centralized data
const nigiriItems = menuData["nigiri-sashimi"] || [];
const uramakiItems = menuData["seasonal-rolls-handrolls"] || [];
const specialRollsItems = menuData["chefs-creations-warm-dishes"] || [];

// MenuSection component moved to ../components/tomodachi-menu-section.tsx

const Menu = () => {
  const [activeSection, setActiveSection] = useState("nigiri");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({
    nigiri: null,
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

      let currentSection = "nigiri";
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
    <div className="flex flex-col lg:flex-row items-start p-3 md:p-6 relative bg-backgrounddefault min-h-screen lg:h-screen lg:overflow-hidden">
      {/* Hero Section - Mobile: Reduced height, Desktop: Full side */}
      <div className="relative w-full lg:flex-1 lg:grow h-[40vh] sm:h-[50vh] lg:h-full bg-black rounded-2xl overflow-hidden mb-4 lg:mb-0 lg:mr-4">
        <div className="relative w-full h-full bg-[url(/images/sushi/hero-background.png)] bg-cover bg-center">
          {/* Gradient overlay */}
          <div className="absolute w-full h-[60%] lg:h-[381px] bottom-0 left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]">
            {/* Menu Title - Responsive sizing */}
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-8 lg:left-16 font-heading-large text-textdefault text-4xl sm:text-6xl lg:text-[112px] tracking-[1px] sm:tracking-[1.5px] lg:tracking-[2px] leading-none">
              MENU
            </div>
          </div>

          {/* Navbar - Responsive positioning */}
          <header className="absolute top-3 sm:top-6 lg:top-12 left-3 sm:left-6 lg:left-12 right-3 sm:right-6 lg:right-auto">
            <Navbar />
          </header>
        </div>
      </div>

      {/* Menu Content - Mobile: Full width, Desktop: Right side */}
      <div className="flex flex-col items-start relative w-full lg:flex-1 lg:grow h-auto lg:h-full lg:min-h-0">
        <Card className="flex flex-col items-start gap-4 lg:gap-6 pt-4 sm:pt-6 lg:pt-8 pb-0 px-4 sm:px-6 lg:px-12 relative self-stretch w-full h-auto lg:h-full rounded-2xl border border-solid border-borderdefault bg-backgrounddefault overflow-hidden">
          <CardContent className="flex flex-col items-start gap-4 lg:gap-8 relative self-stretch w-full p-0">
            {/* Category Tabs - Touch-friendly on mobile */}
            <div className="flex gap-1 sm:gap-2 relative self-stretch w-full items-center justify-center p-1 sm:p-2 rounded-xl">
              <div className="flex items-center justify-center gap-1 relative flex-1 grow">
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToSection(category.id)}
                    className={`px-2 sm:px-3 py-2 sm:py-2 inline-flex items-center justify-center gap-2.5 relative rounded-lg overflow-hidden border border-solid transition-colors cursor-pointer min-h-[44px] flex-1 sm:flex-initial ${
                      activeSection === category.id
                        ? "border-backgroundprimary bg-backgroundprimary text-textinverse"
                        : "border-borderdefault bg-backgroundmuted text-textdefault hover:bg-backgroundprimary/10"
                    }`}
                  >
                    <span className="font-text-meta text-xs sm:text-xs tracking-wider leading-tight whitespace-nowrap text-center">
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Scrollable Menu Sections */}
          <div
            ref={scrollContainerRef}
            className="flex flex-col items-start gap-6 lg:gap-8 relative self-stretch w-full flex-1 overflow-y-scroll px-0 pb-6 lg:pb-8 min-h-0 scrollbar-hide"
            style={{ scrollbarGutter: "stable" }}
          >
            <TomodachiMenuSection
              title="NIGIRI & SASHIMI"
              items={nigiriItems}
              sectionId="nigiri"
              onSectionMount={(id, element) => {
                sectionRefs.current[id] = element;
              }}
            />
            <TomodachiMenuSection
              title="SEASONAL ROLLS & HANDROLLS"
              items={uramakiItems}
              sectionId="uramaki"
              onSectionMount={(id, element) => {
                sectionRefs.current[id] = element;
              }}
            />
            <TomodachiMenuSection
              title="CHEF'S CREATIONS & WARM DISHES"
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
  );
};

export default Menu;
