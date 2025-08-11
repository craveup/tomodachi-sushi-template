import React from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./navbar";
import RoundedEdge from "./rounded-edge";

const socialIcons = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
];

export default function TomodachiHero() {
  return (
    <div className="relative w-full max-w-[1436px] h-[1032px] bg-black rounded-2xl overflow-hidden mx-auto">
      <div className="relative h-[1032px] bg-[url(/images/sushi/hero-background.png)] bg-cover bg-center">
        <header className="absolute top-12 left-12">
          <Navbar />
        </header>

        {/* Gradient overlay */}
        <div className="absolute w-full h-[534px] top-[498px] left-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]">
          {/* Social icons card */}
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

          {/* Main heading */}
          <h1 className="absolute w-[1091px] top-[201px] left-[77px] font-heading-xlarge text-textdefault text-[140px] tracking-[3px] leading-none">
            SUSHI
            <br />
            SENSATION
          </h1>
        </div>
      </div>
    </div>
  );
}
