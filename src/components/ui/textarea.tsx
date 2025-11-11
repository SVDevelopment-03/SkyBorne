import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-black/50 focus-visible:border-b-2 focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-none font-normal border-0 border-b border-[rgba(0,0,0,0.52)] bg-transparent px-0 py-2 text-lg shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-lg font-arial",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
