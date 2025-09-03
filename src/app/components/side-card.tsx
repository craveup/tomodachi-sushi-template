import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

interface SideCardProps {
  backgroundImage: string;
  label: string;
  href?: string;
}

export default function SideCard({
  backgroundImage,
  label,
  href,
}: SideCardProps) {
  return (
    <Card className="w-full relative flex-1 overflow-hidden border-0 bg-transparent rounded-[8px_24px_8px_24px] group hover:shadow-xl transition-all duration-300">
      <CardContent className="p-0">
        <div
          className={`w-full h-[200px] sm:h-[250px] lg:w-[420px] lg:h-[334px] ${backgroundImage} bg-cover bg-center relative rounded-[8px_24px_8px_24px]`}
        >
          {/* Mobile: Full overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-none rounded-[8px_24px_8px_24px]" />

          {/* Content Container - Responsive positioning */}
          <div
            className="absolute bottom-0 right-0 left-0 lg:left-auto 
                         p-4 lg:pl-6 lg:pr-3 lg:pt-3 lg:pb-0 
                         flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start 
                         gap-3 lg:gap-8 
                         bg-backgrounddefault/95 lg:bg-backgrounddefault 
                         backdrop-blur-sm lg:backdrop-blur-none
                         rounded-b-[8px] lg:rounded-b-none lg:rounded-tl-[24px]"
          >
            <div className="flex items-center gap-3">
              <span
                className="font-heading-h6 font-normal text-textdefault 
                             text-sm sm:text-base lg:text-base 
                             tracking-wide lg:tracking-[1.00px] 
                             leading-4 whitespace-nowrap"
              >
                {label}
              </span>

              {href ? (
                <Link href={href}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-backgroundmuted cursor-pointer rounded-full border-borderdefault hover:bg-white transition-colors group flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4 text-icondefault group-hover:text-gray-600 transition-colors" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-backgroundmuted cursor-pointer rounded-full border-borderdefault hover:bg-white transition-colors group flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4 text-icondefault group-hover:text-gray-600 transition-colors" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
