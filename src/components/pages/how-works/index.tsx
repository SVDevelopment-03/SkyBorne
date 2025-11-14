import React from "react";
import BannerUi from "@/components/ui/banner-ui";
import OurFeatures from "./OurFeatures";
import FAQ from "../home/FAQ";

const HowWorks = () => {
  return (
    <div className="flex flex-col gap-17.5 md:gap-24 lg:gap-32">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/how-works.jpg"
          badge="How it works"
          heading="We’re here for your wellness every step."
          cssClass="max-w-[716px]"
        />
      </div>
      <div className="px-4 md:px-8 lg:px-16">
        <OurFeatures />
      </div>
      <div className="px-0 md:px-8 lg:px-16">
        <FAQ />
      </div>
    </div>
  );
};

export default HowWorks;
