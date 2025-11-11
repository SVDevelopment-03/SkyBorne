import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionUi = ({
  trigger,
  content,
  index,
}: {
  trigger: string;
  content: string;
  index?: number;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-[#FFFBF7]"
      defaultValue={`${index}`}
    >
      <AccordionItem value="0">
        <AccordionTrigger className="cursor-pointer items-center bg-[#FFFBF7] rounded-2xl px-3 md:px-5 py-2.5 md:py-5 text-xs md:text-base lg:text-[22px] font-medium leading-normal no-underline [&_.lucide-arrow-up]:size-6 [&_.lucide-arrow-up]:md:size-[45px] [&_.lucide-arrow-up]:rounded-full [&_.lucide-arrow-up]:bg-[#494949] [&_.lucide-arrow-up]:text-white [&_.lucide-arrow-up]:cursor-pointer hover:no-underline focus:no-underline">
          {trigger}
        </AccordionTrigger>
        <AccordionContent className="bg-[#FFFBF7] px-3 md:px-5 py-2.5 md:py-7 text-xs md:text-sm lg:text-lg font-normal font-montserrat text-left">
          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionUi;
