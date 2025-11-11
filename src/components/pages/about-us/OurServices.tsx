import { Button } from "@/components/ui/button";
import Heading, { BannerHeading, Typography } from "@/components/ui/heading";
import Image from "next/image";
import React from "react";

const OurServices = () => {
  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="grid grid-cols-2 gap-6 sm:gap-12 lg:gap-[142px] items-end">
        <div className="flex flex-col items-start gap-10">
          <BannerHeading
            title="We Don’t Just Teach Wellness, We Empower Lives Full of Balance and Growth"
            cssClass="!text-[50px] !text-black"
          />
          <div className="mt-[60px] flex items-end justify-start gap-[50px]">
            <Image
              src={"/images/our-service-1.jpg"}
              alt="our-service-1"
              width={192}
              height={177}
              className="object-contain rounded-xl"
            />
            <Image
              src={"/images/our-service-2.jpg"}
              alt="our-service-2"
              width={286}
              height={231}
              className="object-contain rounded-xl"
            />
          </div>
          <Button variant={"theme"} className="max-w-56">
            Explore services
          </Button>
        </div>
        <div className="flex flex-col items-center gap-8">
          <Image
            src={"/images/our-service-3.jpg"}
            alt="our-service-3"
            width={594}
            height={386}
            className="object-contain rounded-2xl w-full"
          />
          <Typography
            title="Skyborne was born from a simple idea: Wellbeing should never be solo. Our founders practitioners, coaches, and techies—shared one goal: to make modern, science-backed wellness accessible, non-intimidating, and full of real human connection.
  Over 2,000 members have found not just results, but a sense of “team” on their own health journey"
            cssClass=""
          />
        </div>
      </div>
    </div>
  );
};

export default OurServices;
