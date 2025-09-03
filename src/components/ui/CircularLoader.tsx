import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const CircularLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className, "flex justify-center my-16")}>
      <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
    </div>
  );
};
