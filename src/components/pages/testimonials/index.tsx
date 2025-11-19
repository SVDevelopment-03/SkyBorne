import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import Testimonials from "../home/Testimonials";
import Members from "./Members";

const TestimonialsComponent = () => {
  return (
    <div className="flex flex-col gap-17.5 md:gap-24 lg:gap-32.5">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/about-us.jpg"
          badge="Testimonials"
          heading="Your Journey Starts Here"
        />
      </div>
      <div className="px-2 md:px-6 xl:p-0">
        <Testimonials />
      </div>
      <div className="px-2 md:px-6 xl:pt-0">
        <Members />
      </div>
    </div>
  );
};

export default TestimonialsComponent;
