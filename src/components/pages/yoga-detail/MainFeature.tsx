import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/heading";
import HeadingDiv from "@/components/ui/HeadingDiv";
import Image from "next/image";
import React from "react";

const MainFeature = () => {
  return (
    <div className="max-w-[1068px] mx-auto w-full">
      <div className="flex flex-col items-center justify-center rounded-xl md:rounded-[30px] px-8">
        <Typography
          title="What’s Included With Skyborne Yoga"
          type="xl"
          cssClass="!text-[#494949] mb-[67px] max-w-[687px] text-center"
        />
        <div className="flex items-stretch justify-center gap-7.5 mb-[22px] w-full">
          <div className="relative shrink-0 bg-[#B95E82]/25 md:w-[404px] rounded-2xl lg:min-h-[593px]">
            <Image
              src={"/images/main-feature-1.jpg"}
              alt="main-feature-1"
              width={404}
              height={593}
              className="object-cover rounded-2xl size-full"
            />
            <div className="absolute inset-0 p-9.5 flex flex-col items-center justify-end gap-32 h-full text-white">
              <div className="flex items-center justify-center bg-white/30 backdrop-blur-lg rounded-xl size-30">
                <h4 className="text-[33px] font-satoshi-500 text-white">83%</h4>
              </div>
              <div className="text-center">
                <h6 className="font-satoshi-500 text-3xl">
                  Personal Progress Achieved
                </h6>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start min-h-[593px] bg-[#FBEFD8] rounded-xl p-9 flex-1">
            <div className="flex flex-col gap-3">
              <Badge variant={"black"}>Main feature</Badge>
              <Typography
                title="Live and On-Demand Yoga Classes"
                type="xl2"
                cssClass="max-w-[336px] md:text-3xl"
              />
            </div>
            <Typography
              cssClass="max-w-[464px] mt-auto"
              title="Enjoy daily gentle to challenging flows, guided breathwork, and meditations, led by certified experts whenever you want"
            />
          </div>
        </div>

        <div className="flex items-stretch justify-center gap-7.5 w-full">
          <div className="flex flex-col items-start min-h-[314px] bg-[#FBEFD8] rounded-xl p-9 flex-1">
            <div className="flex-1 flex flex-col gap-3">
              <Badge variant={"black"}>Sleep benefit</Badge>
              <Typography
                title="Better Rest and Recovery"
                type="xl2"
                cssClass="max-w-[397px] !text-[25px]"
              />
            </div>
            <Typography
              cssClass="max-w-[397px] mt-auto"
              title="Experience improved sleep, relaxation, and muscle recovery after each session essential wellness for busy lives"
            />
          </div>
          <div className="shrink-0 bg-[#B95E82]/25 md:w-[404px] rounded-2xl ">
            <Image
              src={"/images/main-feature-2.jpg"}
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
