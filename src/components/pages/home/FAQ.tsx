import React from "react";
import AccordionUi from "@/components/ui/accordion-ui";
import { contentData } from "@/constants/home.constant";
import CustomButtons from "@/components/ui/CustomButtons";

const FAQ = ({ isFaq }: { isFaq?: boolean }) => {
  const tabDetail = ["General", "Membership & Payments", "Classes & Sessions"];
  return (
    <div className="max-w-full 2xl:max-w-[1440px] mx-auto p-2 md:p-16">
      <div className="grid md:grid-cols-2 xl:grid-cols-[1fr_716px] gap-6">
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
        <div className="flex flex-col items-start gap-9">
          {isFaq && (
            <div className="flex items-center flex-wrap gap-4 md:gap-x-9.5 md:gap-y-4">
              {tabDetail?.map((tab, i) => (
                <CustomButtons
                  key={i}
                  text={tab}
                  variant={i == 0 ? "theme" : "themeOutline"}
                  cssClass={`px-5.5! py-[13px]! font-montserrat max-h-12 lg:min-w-[150px] ${i==0? '':'text-[#B95E82]' }`}
                />
              ))}
            </div>
          )}
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
    </div>
  );
};

export default FAQ;
