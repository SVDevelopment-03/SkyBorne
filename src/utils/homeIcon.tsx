"use client";
import { House } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const HomeIcon = () => {
  const router = useRouter();
  return (
    <House
      className="h-8 w-8 cursor-pointer text-[#494949]"
      onClick={() => router.push("/")}
    />
  );
};

export default HomeIcon;
