"use client"
import { Button } from "@/components/ui/button";
import { BannerHeading, Typography } from "@/components/ui/heading";
import MotionDiv from "@/components/ui/MotionDiv";
import useGetUser from "@/hooks/useGetUser";
import useRedirectUser from "@/hooks/useRedirectUser";
import Image from "next/image";
import React from "react";

const AboutFitnessJourney = () => {
  const {user} = useGetUser();
  const {redirectUser} = useRedirectUser()
  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 lg:gap-[142px] items-between">
        <div className="flex flex-col items-start gap-5 md:gap-10 md:min-h-[386px] md:py-3.5">
          <div className="flex flex-col gap-5 md:gap-10">
            <BannerHeading
              title="What to Expect From Your Fitness Journey"
              cssClass="!text-[25px] md:!text-[50px] !text-black"
            />

            <div className="flex flex-col gap-2 items-start h-[303px] md:h-[516px] md:hidden">
              {/* <MotionDiv position="right"> */}
              <Image
                src={"/images/fitness-.jpg"}
                alt="our-service-3"
                width={574}
                height={516}
                className="object-cover rounded-xl size-full"
              />
              {/* </MotionDiv> */}
            </div>

            <Typography
              type="theme"
              title="See how Skyborne Fitness fits into your daily routine. Every workout is designed to be clear, achievable, and motivating so you can build strength and stamina step by step"
              cssClass="!text-[13px] md:!text-lg"
            />
          </div>

          {!user && <Button variant={"theme"} className="max-w-56 mt-auto max-md:hidden"
          onClick={()=>redirectUser('/signup')}>
            Sign up & Claim
          </Button>}
        </div>
        <div className="flex flex-col gap-2 items-start h-[303px] md:h-[516px] max-md:hidden">
          <Image
            src={"/images/fitness-6.jpg"}
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

export default AboutFitnessJourney;
