import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import FAQ from "../home/FAQ";
import Consultation from "../home/Consultation";

const FAQComponent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/faq.jpg"
          badge="FAQ"
          heading="Skyborne Questions Answered Here"
        />
      </div>
      <div className="p-2 md:px-6 xl:p-0">
        <FAQ isFaq />
      </div>
      <div className="p-2 md:px-6 xl:py-9">
        <Consultation />
      </div>
    </div>
  );
};

export default FAQComponent;
