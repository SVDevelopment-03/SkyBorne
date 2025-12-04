"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6 flex-col gap-4 pb-20">
      <h1 className="text-4xl! sm:text-6xl! text-[#B95E82] font-extrabold! tracking-tight! mb-4 font-satoshi-500">
        Coming Soon
      </h1>

      <p className="text-muted-foreground mb-6 text-lg! font-satoshi-500">
        Something exciting is on the way. Stay tuned!
      </p>

      <Button
        variant="theme"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-16! py-4! text-lg! font-bold font-satoshi-500"
      >
        <ArrowLeft size={16} />
        Go back
      </Button>
    </div>
  );
}
