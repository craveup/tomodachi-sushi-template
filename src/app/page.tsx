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
    <div className="flex flex-col min-h-screen items-start p-6 relative bg-backgrounddefault">
      <div className="flex items-start gap-4 relative flex-1 self-stretch w-full grow rounded-[0px_48px_48px_0px]">
        <div className="bg-black rounded-2xl relative flex-1 self-stretch grow overflow-hidden">
          <div className="relative w-full h-[1032px] bg-[url(/images/sushi/hero-background.png)] bg-cover bg-[50%_50%]">
            <header className="absolute top-12 left-12">
              <Navbar />
            </header>

            <div className="absolute w-full h-[534px] top-[498px] left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]">
              <div className="pl-6 pr-4 pt-6 pb-4 absolute top-[458px] right-0 inline-flex flex-col items-start gap-8 bg-backgrounddefault rounded-[24px_0px_0px_0px]">
                <RoundedEdge className="!top-[52px] !-left-6 !absolute" />
                <RoundedEdge className="!-top-6 !left-[140px] !absolute" />
                <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                  {socialIcons.map((social, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className="w-9 h-9 bg-backgroundmuted rounded-[500px] border-borderdefault hover:bg-backgroundprimary hover:text-textinverse transition-colors"
                    >
                      <social.icon className="w-[18px] h-[18px] text-icondefault" />
                    </Button>
                  ))}
                </div>
              </div>

              <h1 className="absolute w-[1091px] bottom-[77px] left-12 font-wdxl-jp text-textdefault text-[96px] tracking-[2px] leading-none">
                日本橋蛎殻町友達寿司
              </h1>
            </div>
          </div>
        </div>

        <aside className="flex flex-col w-[420px] items-start gap-[15px] relative self-stretch">
          {sideCards.map((card, index) => (
            <SideCard
              key={index}
              backgroundImage={card.backgroundImage}
              label={card.label}
              href={card.href}
            />
          ))}
        </aside>
      </div>
    </div>
  );
};

export default TomodachiFrontpage;
