import React from "react";
import OurServices from "./OurServices";
import OurValues from "./OurValues";
import Coaches from "./Coaches";
import BannerUi from "@/components/ui/banner-ui";
import WhySkyborne from "./WhySkyborne";

const AboutUs = () => {
  return (
    <div className="flex flex-col gap-32">
      <div className="p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/about-us.jpg"
          badge="About Us"
          heading="Our Story,Your Wellness"
        />
      </div>
      <div className="px-16">
        <OurServices />
      </div>
      <div className="px-6">
        <OurValues />
      </div>
      <div className="p-6">
        <Coaches />
      </div>
      <div className="px-16">
        <WhySkyborne />
      </div>
    </div>
  );
};

export default AboutUs;
