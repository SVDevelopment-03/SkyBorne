import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import AboutYoga from "./AboutYoga";
import MainFeature from "./MainFeature";
import AboutYogaJourney from "./AboutYogaJourney";
import KeyFeatures from "./KeyFeatures";
import CenterCard from "@/components/ui/CardWithCenterText";
import Testimonials from "../home/Testimonials";
import FAQ from "../home/FAQ";

const YogaDetail = () => {
  return (
    <div className="flex flex-col gap-17.5 md:gap-24 lg:gap-32.5">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/yoga-detail.jpg"
          badge="Yoga Service"
          cssClass="md:min-w-[652px]"
          heading="Yoga: Calm. Focus. Rejuvenate"
        />
      </div>
      <div className="px-2 md:px-6 xl:px-0">
        <AboutYoga />
      </div>
      <div className="px-4 md:px-6 xl:px-0">
        <MainFeature />
      </div>
      <div className="flex flex-col gap-15 md:gap-32.5 px-4 md:px-6 xl:px-0">
        <div className="flex flex-col gap-7 md:gap-12 lg:gap-16 max-w-[1268px] mx-auto w-full">
          <AboutYogaJourney />
          <KeyFeatures />
        </div>
        <div className="px-0 md:px-6">
          <CenterCard
            heading="Who Can Join Skyborne Yoga Classes?"
            description="Skyborne Drop yoga sessions are open to everyone whether you’re a total beginner, occasional practitioner, or seasoned yogi. No prior experience or fitness level required. All you need is a willingness to move, breathe, and grow!"
            buttonText="Find Your First Class"
            src="/images/yoga-detail-1.jpg"
          />
        </div>  
      </div>
      <div className="p-2 md:p-6">
        <Testimonials />
      </div>
      <div className="p-2 md:p-6">
        <FAQ />
      </div>
    </div>
  );
};

export default YogaDetail;
