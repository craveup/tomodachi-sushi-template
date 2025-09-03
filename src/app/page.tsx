import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";
import { Navbar } from "./components/navbar";
import RoundedEdge from "./components/rounded-edge";
import { getLocationById } from "@/lib/api/location";
import { notFound } from "next/navigation";
import { location_Id } from "@/constants";
import SideCards from "@/components/ui/SideCards";

export default async function TomodachiFrontpage() {
  try {
    const locationData = await getLocationById(location_Id);
    if (!locationData) notFound();

    const socialIcons = [
      { icon: Instagram, label: "Instagram" },
      { icon: Facebook, label: "Facebook" },
      { icon: Twitter, label: "Twitter" },
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
                         z-0"
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
                        className="w-9 h-9 bg-backgroundmuted rounded-full border-borderdefault hover:bg-blend-color-dodge hover:text-textinverse transition-colors"
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
          <SideCards />
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
