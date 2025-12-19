"use client"
import useRedirectUser from "@/hooks/useRedirectUser";
import Image from "next/image";
import React from "react";
interface FeatureProp {
  icon: string;
  alt: string;
  text: string;
}

const Feature = ({ icon, alt, text }: FeatureProp) => {
  return (
    <div className="flex flex-col items-center gap-4 max-md:last:col-span-2 text-center">
      <Image
        src={icon}
        alt={alt}
        width={34}
        height={34}
        className="size-6 md:size-8.5"
      />
      <h2 className="text-sm md:text-base">{text}</h2>
    </div>
  );
};

const Features = () => {
const {redirectUser} = useRedirectUser()
  return (
    <div className="relative before:content-[''] before:size-full before:absolute before:inset-0 before:bg-[url(/images/grid-bg.svg)] ">
      <div className="font-montserrat bg-[linear-gradient(135deg,rgba(255,247,221,0.2)_0.7%,rgba(255,207,189,0.1)_50%,rgba(255,247,221,0.2)_100%)] rounded-3xl flex flex-col gap-8 items-center justify-between pt-8 md:pt-[82px] px-2.5 md:px-10">
        <div className="max-w-[650px] font-normal text-lg md:text-2xl text-[#494949] font-montserrat text-center">
          We believe wellness means nurturing every part of you body, mind, and
          spirit. Our journeys aren’t about perfection they’re about showing up,
          feeling present, and celebrating progress.
        </div>
        <span className="border-l h-10 border-[#494949]"></span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-14 justify-center md:justify-between">
          <Feature
            icon="/images/science.svg"
            alt="Science image"
            text="Science-led Guidance"
          />
          <Feature
            icon="/images/celebration.svg"
            alt="Celebration Image"
            text="Celebrating Every Path"
          />
          <Feature
            icon={"/images/connection.svg"}
            alt="Connection Image"
            text="Connected for Strength"
          />
        </div>
        <div className="relative image">
          <Image
            src="/images/feature-image.svg"
            alt="features-image"
            width={700}
            height={482}
            className="w-full"
          />
          <Image
            src="/images/about-us-logo.png"
            alt="About Us"
            width={140}
            onClick ={()=>redirectUser("/about-us")}
            height={140}
            className="absolute right-2 lg:-right-16 bottom-16 size-16 md:size-36 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
