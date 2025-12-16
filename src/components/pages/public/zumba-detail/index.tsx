import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import AboutZumba from "./AboutZumba";
import MainFeature from "./MainFeature";
import AboutZumbaJourney from "./AboutZumbaJourney";
import KeyFeatures from "./KeyFeatures";
import CenterCard from "@/components/ui/CardWithCenterText";
import Testimonials from "../home/Testimonials";
import FAQ from "../home/FAQ";

const ZumbaDetail = () => {
  return (
    <div className="flex flex-col gap-17.5 md:gap-24 lg:gap-32.5">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/zumba-detail.jpg"
          badge="Zumba Dance"
          cssClass="md:min-w-[652px]"
          heading="Zumba: Dance. Joy. Sweat"
        />
      </div>
      <div className="px-2 md:px-6 xl:px-0">
        <AboutZumba />
      </div>
      <div className="px-4 md:px-6 xl:px-0">
        <MainFeature />
      </div>
      <div className="flex flex-col gap-15 md:gap-32.5 px-4 md:px-6 xl:px-0">
        <div className="flex flex-col gap-7 md:gap-12 lg:gap-16 max-w-[1268px] mx-auto w-full">
          <AboutZumbaJourney />
          <KeyFeatures />
        </div>
        <div className="px-0 md:px-6">
          <CenterCard
            heading="Who Can Join Skyborne Zumba Classes?"
            description="Everyone! Zumba is for all bodies and backgrounds—step in no matter your dance or fitness experience"
            buttonText="Find Your First Class"
            src="/images/zumba-6.jpg"
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

export default ZumbaDetail;
