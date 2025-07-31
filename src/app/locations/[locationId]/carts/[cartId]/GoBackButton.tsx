"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </div>
  );
};

export default GoBackButton;
