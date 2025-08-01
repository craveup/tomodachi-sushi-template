"use client";

import * as React from "react";

interface IPhoneMockupProps {
  children: React.ReactNode;
  variant?: string;
  color?: string;
}

export function IPhoneMockup({ children, variant, color }: IPhoneMockupProps) {
  return (
    <div className="relative mx-auto flex justify-center items-center">
      <div className="relative">
        {/* iPhone Frame */}
        <div className="relative h-[700px] w-[350px] rounded-[2rem] bg-gradient-to-b from-gray-800 to-gray-900 p-2 shadow-2xl">
          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-2 z-10 h-6 w-20 -translate-x-1/2 rounded-full bg-black"></div>

            {/* Content Area */}
            <div className="h-full w-full overflow-auto pt-10 pb-8">
              <div className="min-h-full">{children}</div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-3 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-gray-800 dark:bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
