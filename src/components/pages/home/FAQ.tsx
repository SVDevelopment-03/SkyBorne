import React from "react";
import AccordionUi from "@/components/ui/accordion-ui";
import { contentData } from "@/constants/home.constant";

const FAQ = () => {
  return (
    <div className="max-w-full 2xl:max-w-[1440px] mx-auto p-2 md:p-16">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex flex-col items-start justify-center text-left gap-3.5 md:gap-6 font-satoshi-500  text-[#494949]">
            <h2 className="text-[30px] max-md:leading-tight md:text-5xl lg:max-w-[440px]">
              Frequently asked questions
            </h2>
            <p className="text-sm md:text-lg text-[#1D1D1D]/80 max-w-[492px]">
              Everything you need to know about classes, membership, and
              personal wellness at Skyborne
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-3 md:gap-5 font-satoshi-500">
          {contentData?.map((content, i) => (
            <AccordionUi
              key={i}
              index={i}
              trigger={content?.question}
              content={content?.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
