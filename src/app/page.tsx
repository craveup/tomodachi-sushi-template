"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";
import { Navbar } from "./components/navbar";
import SideCard from "./components/side-card";
import RoundedEdge from "./components/rounded-edge";

const TomodachiFrontpage = () => {
  const socialIcons = [
    { icon: Instagram, label: "Instagram" },
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
  ];

  const sideCards = [
    {
      backgroundImage: "bg-[url(/images/sushi/menu-card.jpg)]",
      label: "MENU",
      href: "/menu",
    },
    {
      backgroundImage: "bg-[url(/images/sushi/reservation-card.jpg)]",
      label: "RESERVATION",
      href: "/reservation",
    },
    {
      backgroundImage: "bg-[url(/images/sushi/restaurant-card.jpg)]",
      label: "OUR RESTAURANT",
      href: "/about",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-backgrounddefault">
      {/* Mobile and Desktop Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen p-3 lg:p-6 gap-3 lg:gap-4">
        {/* Hero Section */}
        <div className="bg-black rounded-xl lg:rounded-2xl relative flex-1 overflow-hidden">
          <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[1032px] bg-[url(/images/sushi/hero-background.png)] bg-cover bg-center">
            {/* Header - Responsive positioning */}
            <header className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-12 lg:left-12 z-10">
              <Navbar />
            </header>

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]">
              {/* Social Icons - Mobile optimized */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-auto lg:right-0 lg:bottom-[77px] lg:transform lg:-translate-y-full">
                <div className="flex lg:flex-col items-center gap-2 lg:gap-4 p-3 lg:pl-6 lg:pr-4 lg:pt-6 lg:pb-4 bg-backgrounddefault/90 backdrop-blur-sm lg:bg-backgrounddefault rounded-xl lg:rounded-[24px_0px_0px_0px]">
                  <div className="hidden lg:block">
                    <RoundedEdge className="!top-[52px] !-left-6 !absolute" />
                    <RoundedEdge className="!-top-6 !left-[140px] !absolute" />
                  </div>
                  <div className="flex lg:inline-flex items-center gap-2 lg:gap-2">
                    {socialIcons.map((social, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 lg:w-9 lg:h-9 bg-backgroundmuted rounded-full border-borderdefault hover:bg-backgroundprimary hover:text-textinverse transition-colors"
                      >
                        <social.icon className="w-4 h-4 lg:w-[18px] lg:h-[18px] text-icondefault" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Japanese Title - Responsive sizing and positioning */}
              <h1
                className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-[77px] lg:left-12 
                           font-wdxl-jp text-textdefault 
                           text-2xl sm:text-4xl md:text-5xl lg:text-[96px] 
                           tracking-wide lg:tracking-[2px] 
                           leading-tight lg:leading-none
                           max-w-[calc(100%-2rem)] lg:max-w-[1091px]
                           break-words"
              >
                日本橋蛎殻町友達寿司
              </h1>
            </div>
          </div>
        </div>

        {/* Side Cards - Mobile: Stack below hero, Desktop: Side panel */}
        <aside className="flex flex-col lg:w-[420px] gap-3 lg:gap-[15px]">
          {/* Mobile: Show as horizontal scroll on very small screens */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-[15px] sm:overflow-x-auto lg:overflow-x-visible">
            {sideCards.map((card, index) => (
              <div key={index} className="min-w-0 sm:min-w-[200px] lg:min-w-0">
                <SideCard
                  backgroundImage={card.backgroundImage}
                  label={card.label}
                  href={card.href}
                />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TomodachiFrontpage;
