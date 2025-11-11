import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import Image from "next/image";
import React from "react";

const WhySkyborne = () => {
  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="grid grid-cols-2 gap-16">
        <div className="flex flex-col">
          <Typography
            title="WHY SKYBORNE EXISTS FOR YOU"
            type="xl"
            cssClass="max-w-[440px]"
          />
        </div>
        <div className="flex flex-col gap-7">
          <Typography
            title="We’re here to open the door to real wellness—where support, progress, and celebration are part of every journey"
            type="lgBlack"
            cssClass="max-w-[492px]"
          />
          <Button variant={"theme"} className="max-w-56">
            Start Your Journey
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center -space-y-8 w-fit">
          <div>
            <Button
              variant={"outline"}
              className="min-h px-20 py-6! min-w-[249px] text-black font-satoshi-700 text-xl leading-tight border border-dashed border-[#494949]  rotate-[5.12deg]"
            >
              Mindfulness
            </Button>
          </div>
          <div className="mt-10 mr-[200px]">
            <Button
              variant={"outline"}
              className="px-20 py-6! min-w-[249px] text-black font-satoshi-700 text-xl leading-tight border border-dashed border-[#494949]  rotate-[5.12deg]"
            >
              Authenticity
            </Button>
          </div>
          <div className="mt-20">
            <Button
              variant={"outline"}
              className="px-20 py-6! min-w-[249px] text-black font-satoshi-700 text-xl leading-tight border border-dashed border-[#494949]  rotate-[-4.48deg]"
            >
              Healthy Nourishment{" "}
            </Button>
            <Button
              variant={"outline"}
              className="px-20 py-6! min-w-[249px] text-black font-satoshi-700 text-xl leading-tight border border-dashed border-[#494949]  rotate-[38.61deg]"
            >
              Transformation
            </Button>
          </div>
          <div className="mt-10">
            <Button className="px-20 py-6! min-w-[249px] text-[#FFF7DD] font-satoshi-700 text-xl leading-tight border border-[#494949] bg-[#494949] rotate-[3.5deg]">
              Sincerity
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-16">
          <div className="relative min-h-[550px] bg-[##FFD4D4] rounded-[20px] overflow-hidden before:content-[''] before:bg-[linear-gradient(180deg,rgba(0,0,0,0)0%,#000000_100%)] before:w-full before:h-72 before:absolute before:inset-x-0 before:bottom-0">
            <Image
              src="/images/community.jpg"
              alt="community"
              height={587}
              width={619}
              className="rounded-[20px] w-full"
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
      </div>
    </div>
  );
};

export default WhySkyborne;
