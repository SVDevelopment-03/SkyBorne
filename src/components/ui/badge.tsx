import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-5 md:px-[32px] py-2 md:py-3 text-xs md:text-base font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#FFE8E8] text-[#B95E82] [a&]:hover:bg-primary/90 font-montserrat backdrop-blur-[20px] font-semibold",
        secondary:
          "bg-white/20 text-[#494949] [a&]:hover:bg-white/90 font-montserrat backdrop-blur-[20px] border-[#494949] font-semibold",
        themeOutline:
          "bg-white/20 text-[#B95E82] [a&]:hover:bg-white/90 font-montserrat backdrop-blur-[20px] border-[#F0CCC4] font-normal font-satoshi-400 px-[11px] py-[2px]!",
        black:
          "border-transparent bg-[#494949] text-white [a&]:hover:bg-white/90 font-montserrat backdrop-blur-[20px] border-[#494949] font-semibold",
        blur: "border-transparent bg-white/20 text-white [a&]:hover:bg-white/90 font-montserrat backdrop-blur-[20px]",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-white [a&]:hover:bg-accent [a&]:hover:text-accent-foreground text-white",
        filled:
          "border-[#B95E82] bg-[#B95E82] text-white [a&]:hover:bg-white/90",
        yellow:
          "border-[#FFF7DD] bg-[#FFF7DD] text-[#B95E82] [a&]:hover:bg-white/90 font-montserrat",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
