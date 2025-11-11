"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowUp, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>div>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <div className="flex items-center justify-center size-6 md:size-11 rounded-full bg-[#494949] transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0">
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-1.5 md:w-2.5 h-2 md:h-4"
          >
            <path
              d="M5.24575 0.190282C4.99191 -0.0635586 4.58035 -0.0635586 4.32651 0.190282L0.189939 4.32686C-0.0639019 4.5807 -0.0639019 4.99225 0.189939 5.2461C0.443779 5.49994 0.855337 5.49994 1.10918 5.2461L4.78613 1.56914L8.46309 5.2461C8.71693 5.49994 9.12849 5.49994 9.38233 5.2461C9.63617 4.99225 9.63617 4.5807 9.38233 4.32686L5.24575 0.190282ZM4.78613 15.6499H5.43613L5.43613 0.649901H4.78613H4.13613L4.13613 15.6499H4.78613Z"
              fill="#fff"
              className="transition-transform duration-200"

              // className="lucide lucide-arrow-up text-muted-foreground pointer-events-none h-3.5 w-2.5 shrink-0 translate-y-0.5 transition-transform duration-200"
            />
          </svg>
        </div>

        {/* <ArrowUp strokeWidth={1}
        width={10}
        height={14}
         className="text-muted-foreground pointer-events-none h-3.5 w-2.5 shrink-0 translate-y-0.5 transition-transform duration-200" /> */}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
