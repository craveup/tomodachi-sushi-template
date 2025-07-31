"use client";

import * as React from "react";

interface DesktopMockupProps {
  children: React.ReactNode;
}

export function DesktopMockup({ children }: DesktopMockupProps) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center p-8">
      <div className="relative w-full max-w-4xl">
        {/* Browser Frame */}
        <div className="bg-gray-200 rounded-t-lg p-1 shadow-xl">
          {/* Browser Controls */}
          <div className="bg-gray-100 rounded-t-md px-4 py-2 flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white rounded mx-4 px-3 py-1 text-xs text-muted-foreground">
              localhost:3000
            </div>
          </div>
          {/* Screen */}
          <div className="bg-white h-[400px] w-full overflow-auto">
            <div className="p-6 min-h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}