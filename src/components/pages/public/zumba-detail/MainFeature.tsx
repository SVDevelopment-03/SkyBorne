import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/heading";
import HeadingDiv from "@/components/ui/HeadingDiv";
import Image from "next/image";
import React from "react";

const MainFeature = () => {
  return (
    <div className="max-w-[1068px] mx-auto w-full">
      <div className="flex flex-col items-center justify-center rounded-xl md:rounded-[30px]">
        <Typography
          title="What’s Included With Skyborne Zumba"
          type="xl"
          cssClass="!text-[#494949] mb-10 md:mb-16.5 max-w-[274px] md:max-w-[687px] text-center"
        />
        <div className="flex items-stretch justify-center max-md:flex-col gap-4 md:gap-7.5 mb-[22px] w-full">
          <div className="relative shrink-0 bg-[#B95E82]/25 md:w-[404px] overflow-hidden rounded-2xl min-h-[402px] lg:min-h-[593px]">
            <Image
              src={"/images/zumba-3.jpg"}
              alt="main-feature-1"
              fill
              // width={404}
              // height={593}
              className="object-cover rounded-2xl"
               sizes="(max-width: 768px) 100vw, 404px"
            />
            <div className="absolute inset-0 p-9.5 flex flex-col items-center justify-end gap-32 h-full text-white">
              <div className="flex items-center justify-center bg-white/30 backdrop-blur-lg rounded-xl size-20 md:size-30">
                <h4 className="text-[22px] md:text-[33px] font-satoshi-500 text-white">83%</h4>
              </div>
              <div className="text-center max-sm:max-w-[193px]">
                <h6 className="font-satoshi-500 text-lg md:text-xl lg:text-3xl">
                  Joyful Sessions Completed
                </h6>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start min-h-[250px] md:min-h-[593px] bg-[#FBEFD8] rounded-xl p-4 md:p-9 flex-1">
            <div className="flex flex-col gap-3">
              <Badge variant={"black"}>Main feature</Badge>
              <Typography
                title="Live and On-Demand Zumba Parties"
                type="xl2"
                cssClass="max-w-[336px] !text-lg md:!text-3xl"
              />
            </div>
            <Typography
              cssClass="max-w-[464px] mt-auto"
              title="Join high-energy dance workouts in real time or replay your favorite routines anytime you want a fun burst of cardio at home"
            />
          </div>
        </div>

        <div className="flex items-stretch justify-center max-md:flex-col gap-4 md:gap-7.5 w-full">
          <div className="flex flex-col items-start min-h-[197px] md:min-h-[314px] bg-[#FBEFD8] rounded-xl p-4 md:p-9 flex-1">
            <div className="flex-1 flex flex-col gap-3">
              <Badge variant={"black"}>Instructor Support</Badge>
              <Typography
                title="Easy-to-Follow Dance Coaching"
                type="xl2"
                cssClass="max-w-[397px] !text-lg md:!text-[25px]"
              />
            </div>
            <Typography
              cssClass="max-w-[397px] mt-auto"
              title="Follow clear cues and step-by-step guidance from certified Zumba instructors so you can enjoy the music, stay safe, and build confidence even if you are new to dancing"
            />
          </div>
          <div className="shrink-0 bg-[#B95E82]/25 md:w-[404px] rounded-2xl ">
            <Image
              src={"/images/zumba-4.jpg"}
              alt="main-feature-1"
              width={436}
              height={314}
              className="object-cover rounded-2xl size-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;
