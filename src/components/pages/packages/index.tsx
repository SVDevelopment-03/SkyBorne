import BannerUi from "@/components/ui/banner-ui";
import React from "react";
import FAQ from "../home/FAQ";
import CenterCard from "@/components/ui/CardWithCenterText";
import SubscriptionPlan from "./SubscriptionPlan";

const Packages = () => {
  return (
    <div className="flex flex-col gap-[130px]">
      <div className="p-6 w-full rounded-4xl">
        <BannerUi
          src="/images/package-banner.jpg"
          badge="Packages"
          cssClass="min-w-[652px]"
          heading="Flexible Plans for Every Journey"
        />
      </div>
      <div className="p-2 md:p-6 xl:p-0">
        <SubscriptionPlan />
      </div>
      <div className="p-2 md:p-6">
        <CenterCard
          heading="Why sign-up required for pricing?"
          description="We personalize and secure each journey signing up helps us show you the right options, safely "
          buttonText="Unlock My Plan"
          src="/images/yoga-detail-1.jpg"
        />
      </div>
      <div className="p-2 md:p-6">
        <FAQ />
      </div>
    </div>
  );
};

export default Packages;
