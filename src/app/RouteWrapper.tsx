"use client";

import Footer from "@/components/layout/footer";
import { usePathname } from "next/navigation";
import React from "react";

export default function RouteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  console.log("path", pathname);

  return (
    <div className="relative min-h-screen flex flex-col w-full before:content-[''] before:size-full before:absolute before:inset-x-0 before:top-0 before:bg-[linear-gradient(144.01deg,#FFF7DD_8.33%,rgba(255,207,189,0.08)_40.26%,rgba(255,207,189,0)_52.55%,rgba(255,207,189,0.61)_78.3%,#FFFFFF_115.58%)] before:rotate-180 before:opacity-60">
      <main className="z-10"> {children}</main>
      <div className="px-2 md:p-6 mt-15 md:mt-24 z-10">
        <Footer />
      </div>
    </div>
  );
}
