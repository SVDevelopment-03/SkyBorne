import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-black/50 selection:bg-primary selection:text-primary-foreground font-arial",
        "dark:bg-input/30 h-9 w-full min-w-0 bg-transparent px-0 py-4.5 min-h-[51px] text-lg shadow-xs transition-[color,box-shadow] outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-lg file:font-normal",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-lg",
        "border-0 border-b border-[rgba(0,0,0,0.52)] rounded-none",
        "focus-visible:border-b-2 focus-visible:border-ring focus-visible:ring-0",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

function Input2({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#717182] selection:bg-primary selection:text-[#B95E82] dark:bg-input/30 border-white/20 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-lg text-[#0A0A0A99] font-satoshi-500",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input2, Input };
