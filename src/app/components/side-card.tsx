import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import RoundedEdge from "./rounded-edge";

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
    <Card className="w-full rounded-[16px_16px_0px_16px] relative flex-1 self-stretch grow overflow-hidden border-0 bg-transparent">
      <CardContent className="p-0">
        <div
          className={`w-[420px] h-[334px] ${backgroundImage} bg-cover bg-[50%_50%]`}
        >
          <div
            className={`pl-6 pr-3 pt-3 pb-0 relative top-[290px] right-3 inline-flex flex-col items-end gap-8 bg-backgrounddefault rounded-[24px_0px_0px_0px]`}
          >
            <RoundedEdge className="!absolute !w-6 !h-6 !top-5 !-left-6" />
            <RoundedEdge className={`!-top-6 !right-0 !absolute !w-6 !h-6`} />

            <div className="inline-flex items-center justify-end gap-3 relative">
              <span className="relative w-fit font-heading-h6 font-normal text-textdefault text-base tracking-[1.00px] leading-4 whitespace-nowrap">
                {label}
              </span>
              {href ? (
                <Link href={href}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-backgroundmuted rounded-[500px] border-borderdefault hover:bg-white transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 text-icondefault group-hover:text-gray-600 transition-colors" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-backgroundmuted rounded-[500px] border-borderdefault hover:bg-white transition-colors group"
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
