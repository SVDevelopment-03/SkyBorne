"use client"
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import MotionDiv from "@/components/ui/MotionDiv";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const WhySkyborne = () => {
  const router = useRouter();
  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7.5 md:gap-12 lg:gap-16">
        <div className="flex flex-col max-md:order-1">
          <MotionDiv position="left">
            <Typography
              title="Why Skyborne Exists For You"
              type="xl"
              cssClass="max-w-[440px]"
            />
          </MotionDiv>
        </div>
        <MotionDiv position="right">
          <div className="flex flex-col gap-4 md:gap-7 max-md:order-3">
            <Typography
              title="We’re here to open the door to real wellness—where support, progress, and celebration are part of every journey"
              type="lgBlack"
              cssClass="max-w-[492px] max-md:text-sm"
            />
            <Button variant={"theme"} className="max-w-56" onClick={()=>router.push("/signup")}>
              Start Your Journey
            </Button>
          </div>
        </MotionDiv>
        <MotionDiv position="left">
          <div className="flex flex-col items-center justify-center -space-y-8 w-fit  max-md:order-4">
            <div>
              <Button
                variant={"outline"}
                className="min-h px-10 lg:px-8 xl:px-4 py-4.5! lg:py-6! xl:min-w-[249px] text-black font-satoshi-700 text-sm lg:text-base xl:text-xl leading-tight cursor-default border border-dashed border-[#494949] hover:text-black hover:border-[#494949] hover:bg-transparent rotate-[5.12deg]"
              >
                Mindfulness
              </Button>
            </div>
            <div className="mt-10 mr-[200px]">
              <Button
                variant={"outline"}
                className="px-10 lg:px-8 xl:px-4 py-4.5! lg:py-6! xl:min-w-[249px] text-black font-satoshi-700 text-sm lg:text-base xl:text-xl leading-tight cursor-default border border-dashed border-[#494949] hover:text-black hover:border-[#494949] hover:bg-transparent rotate-[5.12deg]"
              >
                Authenticity
              </Button>
            </div>
            <div className="mt-12 lg:mt-20">
              <Button
                variant={"outline"}
                className="px-4 lg:px-5 xl:px-4 py-4.5! lg:py-6! xl:min-w-[249px] text-black font-satoshi-700 text-sm lg:text-base xl:text-xl leading-tight cursor-default border border-dashed border-[#494949] hover:text-black hover:border-[#494949] hover:bg-transparent rotate-[-4.48deg]"
              >
                Healthy Nourishment{" "}
              </Button>
              <Button
                variant={"outline"}
                className="px-10 lg:px-8 xl:px-4 py-4.5! lg:py-6! xl:min-w-[249px] text-black font-satoshi-700 text-sm lg:text-base xl:text-xl leading-tight cursor-default border border-dashed border-[#494949] hover:text-black hover:border-[#494949] hover:bg-transparent rotate-[38.61deg]"
              >
                Transformation
              </Button>
            </div>
            <div className="mt-10">
              <Button className="px-10 lg:px-8 xl:px-4 py-4.5! lg:py-6! xl:min-w-[249px] text-[#FFF7DD] font-satoshi-700 text-sm lg:text-base xl:text-xl leading-tight cursor-default border border-[#494949] bg-[#494949] hover:text-[#FFF7DD] hover:border-[#494949] hover:bg-[#494949] rotate-[3.5deg]">
                Sincerity
              </Button>
            </div>
          </div>
        </MotionDiv>
        <MotionDiv position="right">
          <div className="flex flex-col gap-16 max-md:order-2">
            <div className="relative min-h-[415px] md:min-h-[550px] bg-[##FFD4D4] rounded-[20px] overflow-hidden before:content-[''] before:bg-[linear-gradient(180deg,rgba(0,0,0,0)0%,#000000_100%)] before:w-full before:h-72 before:absolute before:inset-x-0 before:bottom-0">
              <Image
                src="/images/community.jpg"
                alt="community"
                height={587}
                width={619}
                className="rounded-[20px] w-full object-cover"
              />
              <div className="flex flex-col gap-3 absolute bottom-0 left-0 p-11">
                <Typography
                  title="Supportive Community"
                  type="xl"
                  cssClass="text-white max-w-[440px] leading-tight"
                />
                <Typography
                  title="Wellness is more powerful when we grow together"
                  cssClass="text-white"
                />
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default WhySkyborne;
