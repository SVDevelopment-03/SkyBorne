import { Button } from "@/components/ui/button";
import Heading, { BannerHeading, Typography } from "@/components/ui/heading";
import MotionDiv from "@/components/ui/MotionDiv";
import Image from "next/image";
import React from "react";

const OurServices = () => {
  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 lg:gap-[142px] items-end">
        <MotionDiv position="left">
          <div className="flex flex-col items-start gap-5 md:gap-10">
            <BannerHeading
              title="We Don’t Just Teach Wellness, We Empower Lives Full of Balance and Growth"
              cssClass="!text-[25px] md:!text-[40px] lg:!text-[50px] !text-black"
            />
            <div className="md:mt-[60px] grid grid-cols-2 md:flex items-end justify-start gap-6 md:gap-12.5 max-md:pt-6">
              <div className="max-md:col-span-2 h-[255px] w-full rounded-2xl bg-[#B95E82]/25 md:hidden">
                <Image
                  src={"/images/our-service-3.jpg"}
                  alt="our-service-3"
                  width={384}
                  height={255}
                  className="object-cover rounded-2xl size-full"
                />
              </div>
              <div className="h-[130px] md:h-[177px] w-full rounded-xl bg-[#B95E82]/25">
                <Image
                  src={"/images/our-service-1.jpg"}
                  alt="our-service-1"
                  width={192}
                  height={177}
                  className="object-cover rounded-xl size-full"
                />
              </div>
              <div className="h-[155px] md:h-[231px] w-full rounded-xl bg-[#B95E82]/25">
                <Image
                  src={"/images/our-service-2.jpg"}
                  alt="our-service-2"
                  width={286}
                  height={231}
                  className="object-cover rounded-xl size-full"
                />
              </div>
            </div>
            <div className="md:hidden max-md:pt-2">
              <Typography
                title="Skyborne was born from a simple idea: Wellbeing should never be solo. Our founders practitioners, coaches, and techies—shared one goal: to make modern, science-backed wellness accessible, non-intimidating, and full of real human connection. Over 2,000 members have found not just results, but a sense of “team” on their own health journey"
                cssClass=""
              />
            </div>
            <Button variant={"theme"} className="max-w-56">
              Explore services
            </Button>
          </div>
        </MotionDiv>
        <MotionDiv>
          <div className="flex flex-col items-center gap-8 max-md:hidden">
            <div className="h-[386px] w-full rounded-2xl bg-[#B95E82]/25">
              <Image
                src={"/images/our-service-3.jpg"}
                alt="our-service-3"
                width={594}
                height={386}
                className="object-cover rounded-2xl size-full"
              />
            </div>
            <div>
              <Typography
                title="Skyborne was born from a simple idea: Wellbeing should never be solo. Our founders practitioners, coaches, and techies—shared one goal: to make modern, science-backed wellness accessible, non-intimidating, and full of real human connection.
  Over 2,000 members have found not just results, but a sense of “team” on their own health journey"
                cssClass=""
              />
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default OurServices;
