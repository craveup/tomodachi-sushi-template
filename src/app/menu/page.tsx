"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/navbar";
import { TomodachiMenuSection } from "../components/tomodachi-menu-section";
import { useSushiMenuData } from "./useSushiMenuData";
import { getLocationById } from "@/lib/api/location";

const Menu = () => {
  const [title, setTitle] = useState("Tomodachi Sushii");

  const locationId = process.env.NEXT_PUBLIC_LOCATION_ID!;
  const { sections, loading, error } = useSushiMenuData(locationId);

  useEffect(() => {
    getLocationById(locationId)
      .then((d) => setTitle(d?.restaurantDisplayName ?? "Tomodachi Sushii"))
      .catch(() => setTitle("Tomodachi Sushii"));
  }, [locationId]);

  const menuCategories = sections.map((s) => ({ id: s.id, label: s.label }));

  const [activeSection, setActiveSection] = useState<string>(
    menuCategories[0]?.id ?? ""
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const sectionTop = section.offsetTop - container.offsetTop;
      container.scrollTo({ top: sectionTop - 20, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const scrollTop = container.scrollTop;

      let current = menuCategories[0]?.id ?? "";
      let closest = Infinity;

      for (const id of menuCategories.map((c) => c.id)) {
        const el = sectionRefs.current[id];
        if (!el) continue;
        const distance = Math.abs(scrollTop - el.offsetTop);
        if (distance < closest) {
          closest = distance;
          current = id;
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

  return (
    <div className="flex flex-col lg:flex-row items-start p-3 md:p-6 relative bg-backgrounddefault min-h-screen lg:h-screen lg:overflow-hidden">
      {/* Hero Section (unchanged) */}
      <div className="relative w-full lg:flex-1 lg:grow h-[40vh] sm:h-[50vh] lg:h-full bg-black rounded-2xl overflow-hidden mb-4 lg:mb-0 lg:mr-4">
        <div className="relative w-full h-full bg-[url(/images/sushi/hero-background.png)] bg-cover bg-center">
          <div className="absolute w-full h-[60%] lg:h-[381px] bottom-0 left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]">
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-8 lg:left-16 font-heading-large text-textdefault text-4xl sm:text-6xl lg:text-[112px] tracking-[1px] sm:tracking-[1.5px] lg:tracking-[2px] leading-none">
              MENU
            </div>
          </div>
          <header className="absolute top-3 sm:top-6 lg:top-12 left-3 sm:left-6 lg:left-12 right-3 sm:right-6 lg:right-auto">
            <Navbar location={title} />
          </header>
        </div>
      </div>

      {/* Menu Content */}
      <div className="flex flex-col items-start relative w-full lg:flex-1 lg:grow h-auto lg:h-full lg:min-h-0">
        <Card className="flex flex-col items-start gap-4 lg:gap-6 pt-4 sm:pt-6 lg:pt-8 pb-0 px-4 sm:px-6 lg:px-12 relative self-stretch w-full h-auto lg:h-full rounded-2xl border border-solid border-borderdefault bg-backgrounddefault overflow-hidden">
          <CardContent className="flex flex-col items-start gap-4 lg:gap-8 relative self-stretch w-full p-0">
            {/* Category Tabs */}
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

          {/* Scrollable Menu Sections*/}
          <div
            ref={scrollContainerRef}
            className="flex flex-col items-start gap-6 lg:gap-8 relative self-stretch w-full flex-1 overflow-y-scroll px-0 pb-6 lg:pb-8 min-h-0 scrollbar-hide"
            style={{ scrollbarGutter: "stable" }}
          >
            {/* Loading / errors as simple placeholders — or plug your own skeleton */}
            {loading && (
              <div className="px-4 py-8 opacity-60">Loading menu…</div>
            )}
            {error && !loading && (
              <div className="px-4 py-8 text-red-500">Failed to load menu.</div>
            )}

            {!loading &&
              !error &&
              sections.map((section) => (
                <TomodachiMenuSection
                  key={section.id}
                  title={section.label}
                  items={section.items}
                  sectionId={section.id}
                  onSectionMount={(id, el) => {
                    sectionRefs.current[id] = el;
                  }}
                />
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Menu;
