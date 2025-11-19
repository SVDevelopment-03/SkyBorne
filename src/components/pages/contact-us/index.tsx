import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import FAQ from "../home/FAQ";
import Consultation from "../home/Consultation";
import Help from "./Help";

const ContactUs = () => {
  return (
    <div className="flex flex-col gap-17.5 md:gap-24 lg:32.5">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/about-us.jpg"
          badge="Contact us"
          heading="Your Journey Starts Here"
        />
      </div>
      <div className="px-4 md:px-6 xl:p-0">
        <Consultation />
      </div>
      <div className="px-4 md:px-6 xl:p-0">
        <Help />
      </div>
      <div className="px-4 md:px-6 xl:p-0">
        <FAQ />
      </div>
    </div>
  );
};

export default ContactUs;
