import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
// import bgExplore from "../../../../public/images/explore-main.svg"

const Explore = () => {
  return (
    <div
      className="flex items-center justify-between h-[791px] bg-[#FFF7DD] bg-no-repeat bg-cover bg-bottom w-full"
      style={{ backgroundImage: "url(/images/explore-main.svg)" }}
    >
      <div className="grid grid-cols-2 p-16 w-full max-w-full mx-auto font-satoshi-500 text-[#FFF7DD]">
        <div className="flex flex-col justify-between gap-20 min-h-[522px]">
          <div className="flex flex-col gap-5 items-start">
            <Button
              variant={"outline"}
              className="text-[#FFF7DD] border-[#FFF7DD]"
            >
              How it works
            </Button>
            <h2 className="text-5xl lg:max-w-[433px]">
              Discover, Book, Transform All in One Place
            </h2>
          </div>
          <div className="flex flex-col gap-5 items-start  lg:max-w-[480px]">
            <p className="text-lg">
              Every class invites you to return—to your body, your presence,
              your breath. Find your path to lasting wellness
            </p>
            <Button className="bg-[#FFF7DD] text-[#494949]">
              Explore all classes
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <div className="relative w-[422px] h-full ml-auto">
            <Image
              src="/images/explore-section1.svg"
              alt="section-image"
              width={422}
              height={426}
              className="absolute top-0 left-0 z-10 rounded-xl"
            />
            <Image
              src="/images/explore-section2.svg"
              alt="section-image"
              width={422}
              height={426}
              className="absolute top-14 left-0 z-10 rounded-xl"
            />
            <Image
              src="/images/explore-section3.svg"
              alt="section-image"
              width={422}
              height={426}
              className="absolute top-28 z-10 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h6 className="text-[#FFF7DD]/70 text-[20px] leading-normal">01</h6>
            <h5 className="text-[#FFF7DD]/70 text-[20px] leading-normal">02</h5>
            <h4 className="text-[#FFF7DD] text-[30px] leading-normal">03</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
