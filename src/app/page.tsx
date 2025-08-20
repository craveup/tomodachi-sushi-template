import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";
import { Navbar } from "./components/navbar";
import SideCard from "./components/side-card";
import RoundedEdge from "./components/rounded-edge";
import { getLocationById } from "@/lib/api/location";
import { notFound } from "next/navigation";

export default async function TomodachiFrontpage() {
  try {
    const locationId = process.env.NEXT_PUBLIC_LOCATION_ID;
    if (!locationId) {
      throw new Error("NEXT_PUBLIC_LOCATION_ID is not defined");
    }

    const locationData = await getLocationById(locationId);
    console.log("locationData", locationData);
    if (!locationData) notFound();

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
      <div className="flex flex-col min-h-screen lg:h-screen bg-backgrounddefault lg:overflow-hidden">
        {/* Mobile and Desktop Layout */}
        <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-0 lg:h-full p-3 lg:p-6 gap-3 lg:gap-4">
          {/* Hero Section */}
          <div className="bg-black rounded-xl lg:rounded-2xl relative flex-1 overflow-hidden">
            <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-full bg-[url(/images/sushi/hero-background.png)] bg-cover bg-center">
              {/* Header - Responsive positioning */}
              <header className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 lg:top-12 lg:left-12 lg:right-auto z-10">
                <Navbar title={locationData.restaurantDisplayName} />
              </header>

              {/* Mobile: Japanese Title Overlay */}
              <h1
                className="lg:hidden absolute 
                         top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center
                         font-yuji-mai text-white
                         text-3xl sm:text-4xl md:text-6xl
                         tracking-wide
                         leading-tight
                         max-w-[90vw]
                         break-words
                         drop-shadow-2xl
                         z-20"
              >
                日本橋蛎殻町友達寿司
              </h1>

              {/* Desktop: Gradient overlay */}
              <div className="hidden lg:block absolute inset-x-0 bottom-0 h-[clamp(320px,45vh,534px)] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]" />

              {/* Social Icons - Desktop only */}
              <div className="hidden lg:block absolute right-0 bottom-0 z-30">
                <div className="flex flex-col items-center gap-4 pl-6 pr-4 pt-6 pb-4 bg-backgrounddefault rounded-[24px_0px_0px_0px]">
                  <div>
                    <RoundedEdge className="!top-[52px] !-left-6 !absolute" />
                    <RoundedEdge className="!-top-6 !left-[140px] !absolute" />
                  </div>
                  <div className="inline-flex items-center gap-2">
                    {socialIcons.map((social, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="icon"
                        className="w-9 h-9 bg-backgroundmuted rounded-full border-borderdefault hover:bg-backgroundprimary hover:text-textinverse transition-colors"
                      >
                        <social.icon className="w-[18px] h-[18px] text-icondefault" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Japanese Title */}
              <h1 className="hidden lg:block absolute bottom-[clamp(16px,6vh,77px)] left-12 right-12 w-auto font-yuji-mai text-textdefault text-[clamp(28px,4.2vw,72px)] tracking-normal leading-none whitespace-nowrap z-20">
                日本橋蛎殻町友達寿司
              </h1>

              {/* Mobile: Subtle gradient for text readability */}
              <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none"></div>
            </div>
          </div>

          {/* Side Cards - Mobile: Stack below hero, Desktop: Side panel */}
          <aside className="flex flex-col lg:w-[420px] lg:h-full lg:max-h-full lg:overflow-y-auto lg:pr-1 gap-3 lg:gap-[15px] overscroll-contain">
            {/* Mobile: Show as horizontal scroll on very small screens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-[15px] overflow-x-auto lg:overflow-x-visible pb-1">
              {sideCards.map((card, index) => (
                <div
                  key={index}
                  className="min-w-0 sm:min-w-[200px] lg:min-w-0"
                >
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
  } catch (e) {
    notFound();
  }
}
