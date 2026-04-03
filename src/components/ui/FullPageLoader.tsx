import React from "react";

type FullPageLoaderProps = {
  label?: string;
};

export default function FullPageLoader({ label = "Loading..." }: FullPageLoaderProps) {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-[#FBFAF9]">
      <div className="flex flex-col items-center gap-3 text-[#6B6B6B]">
        <span className="h-10 w-10 rounded-full border-4 border-[#EBD0DA] border-t-[#B95E82] animate-spin" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
