import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import AboutDiet from "./AboutDiet";
import MainFeature from "./MainFeature";
import AboutDietJourney from "./AboutDietJourney";
import KeyFeatures from "./KeyFeatures";
import CenterCard from "@/components/ui/CardWithCenterText";
import Testimonials from "../home/Testimonials";
import FAQ from "../home/FAQ";

const DietDetail = () => {
  return (
    <div className="flex flex-col gap-17.5 md:gap-24 lg:gap-32.5">
      <div className="p-2 md:p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/diet-detail.jpg"
          badge="Diet & Nutrition"
          cssClass="md:min-w-[652px]"
          heading="Nutrition: Nourish. Balance. Thrive."
        />
      </div>
      <div className="px-2 md:px-6 xl:px-0">
        <AboutDiet />
      </div>
      <div className="px-4 md:px-6 xl:px-0">
        <MainFeature />
      </div>
      <div className="flex flex-col gap-15 md:gap-32.5 px-4 md:px-6 xl:px-0">
        <div className="flex flex-col gap-7 md:gap-12 lg:gap-16 max-w-[1268px] mx-auto w-full">
          <AboutDietJourney />
          <KeyFeatures />
        </div>
        <div className="px-0 md:px-6">
          <CenterCard
            heading="Who Can Join Skyborne Nutrition Programs?"
            description="Skyborne Nutrition was designed for everyone: those wanting to manage weight, optimize energy, address allergies, or simply eat better. Our plans adapt to all backgrounds and needs"
            buttonText="Find Your First Class"
            src="/images/diet-6.jpg"
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

export default DietDetail;
