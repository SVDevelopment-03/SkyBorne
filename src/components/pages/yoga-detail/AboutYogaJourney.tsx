import { Button } from "@/components/ui/button";
import { BannerHeading, Typography } from "@/components/ui/heading";
import MotionDiv from "@/components/ui/MotionDiv";
import Image from "next/image";
import React from "react";

const AboutYogaJourney = () => {
  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 lg:gap-[142px] items-between">
        <div className="flex flex-col items-start gap-5 md:gap-10 md:min-h-[386px] md:py-3.5">
          <div className="flex flex-col gap-5 md:gap-10">
            <BannerHeading
              title="What to Expect Your Yoga Journey, Up Close"
              cssClass="!text-[25px] md:!text-[50px] !text-black"
            />

            <div className="flex flex-col gap-2 items-start h-[303px] md:h-[516px] md:hidden">
              {/* <MotionDiv position="right"> */}
              <Image
                src={"/images/yoga-journey.jpg"}
                alt="our-service-3"
                width={574}
                height={516}
                className="object-cover rounded-xl size-full"
              />
              {/* </MotionDiv> */}
            </div>

            <Typography
              type="theme"
              title="Discover how your yoga journey with Skyborne Drop can fit seamlessly into your life every step, every session, every win"
              cssClass="!text-[13px] md:!text-lg"
            />
          </div>

          <Button variant={"theme"} className="max-w-56 mt-auto max-md:hidden">
            Sign up & Claim
          </Button>
        </div>
        <div className="flex flex-col gap-2 items-start h-[303px] md:h-[516px] max-md:hidden">
          <Image
            src={"/images/yoga-journey.jpg"}
            alt="our-service-3"
            width={574}
            height={516}
            className="object-cover rounded-xl size-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutYogaJourney;
