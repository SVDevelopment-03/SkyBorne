"use client";
import { Button } from "@/components/ui/button";
import { useGetPlansQuery } from "@/store/api/publicApi";
import { IPlan } from "@/types/home.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface SubscriptionProp {
  name: string;
  image: string;
  price?: string;
  features: string[];
  isSelected?: boolean;
}

export const Subscription = ({
  name,
  image,
  features,
  price,
  isSelected,
}: SubscriptionProp) => {
  const router = useRouter();
  return (
    <div
      className={`cursor-pointer min-h-[440px] ${
        isSelected
          ? "bg-[linear-gradient(180.02deg,rgba(255,207,189,0.7)-51.68%,rgba(255,247,221,0.7)99.98%)] shadow-[0px_4.44px_8.88px_0px_#0000001A,0px_4.44px_8.88px_0px_#0000001A] hover:scale-105 transition"
          : "bg-[linear-gradient(180.02deg,rgba(255,207,189,0.25)_-51.68%,rgba(255,247,221,0.25)_99.98%)] shadow-[0px_3.63px_7.25px_0px_#0000001A,0px_3.63px_7.25px_0px_#0000001A] hover:scale-105 transition"
      } ${
        isSelected ? "lg:w-[317px]" : "max-md:min-w-[252px] lg:w-[317px]"
      } rounded-[30px] text-[#494949] hover:bg-[linear-gradient(180.02deg,rgba(255,207,189,0.7)-51.68%,rgba(255,247,221,0.7)99.98%)] hover:shadow-[0px_4.44px_8.88px_0px_#0000001A,0px_4.44px_8.88px_0px_#0000001A]`}
    >
      <div
        className={`relative min-h-[440px] flex flex-col h-full font-montserrat ${
          isSelected
            ? "gap-9.5 md:gap-16 px-6 md:px-9 pt-11 md:pt-16 pb-8 md:pb-12"
            : "gap-4.5 md:gap-11 px-3 md:px-5 pt-8 md:pt-12 pb-8 md:pb-12"
        }`}
      >
        <div className="absolute right-14 -top-5.5">
          <Image
            src={"/images/pricing-elements.png"}
            alt="Tag"
            height={88}
            width={70}
            className=""
          />
          <span className="text-white text-[10px] leading-normal text-center w-9 absolute left-6 top-7  ">
            $<span className="text-xs font-bold">{price}</span> /month
          </span>
        </div>
        <div className={`flex flex-col ${isSelected ? "gap-7" : "gap-8"}`}>
          <Image
            src={image}
            alt="subscribe"
            height={50}
            width={50}
            className="size-8 md:size-[50px]"
          />
          <div className={`${isSelected ? "space-y-3.5" : "space-y-6"}`}>
            <h5 className="text-2xl md:text-4xl font-medium max-w-[250px]">
              {name}
            </h5>
            <ul className="space-y-3 text-[8px] md:text-xs font-medium [&_li]:flex [&_li]:items-center [&_li]:gap-2">
              {features?.map((feature, i) => (
                <li key={i}>
                  <Image
                    src={"/images/tick-icon.svg"}
                    alt="Tick"
                    height={9}
                    width={12}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button
          variant={"filled"}
          className={`${
            isSelected ? "text-base py-2 mt-2" : "text-base py-2"
          } lg:w-[257px] mx-auto mt-auto!`}
          onClick={() => router.push("/signup")}
        >
          Unlock This Plan
        </Button>
      </div>
    </div>
  );
};

const Subscriptions = () => {
  const { data, isLoading, error } = useGetPlansQuery(undefined);
  const plans: IPlan[] = data?.data || [];

  const [isSelected, setIsSelected] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScrollToSecond = () => {
      if (scrollRef.current && window.innerWidth < 768) {
        const innerDiv = scrollRef.current.firstElementChild as HTMLElement;
        const child = innerDiv?.children[1] as HTMLElement; // 2nd plan
        if (child) {
          const offset =
            child.offsetLeft -
            scrollRef.current.clientWidth / 2 +
            child.clientWidth / 2;
          scrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
        }
      }
    };

    handleScrollToSecond();

    window.addEventListener("resize", handleScrollToSecond);

    return () => window.removeEventListener("resize", handleScrollToSecond);
  }, []);

  return (
    <>
      {!isLoading && plans?.length > 0 && (
        <div className="flex flex-col items-center gap-10 md:gap-12 md:py-[53px] md:px-10 text-[#494949]">
          <div className="flex flex-col items-center justify-center text-center gap-4 md:gap-6 font-satoshi-500">
            <h2 className="text-[30px] md:text-5xl">Find Your Wellness Plan</h2>
            <p className="text-sm md:text-lg text-[#1D1D1D]/80 max-w-80 md:max-w-[556px]">
              Ready to commit to your health? Skyborne offers flexible yoga,
              fitness, and nutrition plans for every lifestyle. Choose your fit
              below.
            </p>
          </div>
          <div
            ref={scrollRef}
            className="w-full max-lg:overflow-x-auto max-lg:[scrollbar-width:none]"
          >
            <div className="flex items-center justify-center gap-5 md:gap-14 pt-10 pb-3 min-w-[800px]">
              {isLoading &&
                [1, 2, 3].map((i) => <SkeletonSubscription key={i} />)}
              {!isLoading &&
                !error &&
                plans?.map((plan, index) => {
                  return (
                    <Subscription
                      key={plan?.name}
                      name={plan?.name}
                      features={plan?.features}
                      image={plan?.image}
                      isSelected={index == isSelected}
                      price={plan?.price}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscriptions;

export const SkeletonSubscription = () => {
  return (
    <div
      className={`rounded-[30px] max-md:min-w-[252px] lg:w-[317px] 
      bg-[linear-gradient(180.02deg,rgba(255,207,189,0.25)_-51.68%,rgba(255,247,221,0.25)_99.98%)]
      shadow-[0px_3.63px_7.25px_0px_#0000001A]
      animate-pulse`}
    >
      <div className="relative flex flex-col gap-6 px-5 pt-10 pb-8">
        {/* Price Tag */}
        <div className="absolute right-14 -top-5.5 w-[70px] h-[88px] bg-black/30 rounded-md"></div>

        {/* Icon */}
        <div className="w-12 h-12 bg-black/20 rounded-md"></div>

        {/* Plan Title */}
        <div className="w-32 h-6 bg-black/20 rounded-md"></div>

        {/* Features List */}
        <ul className="space-y-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-black/20 rounded-full"></div>
              <div className="w-28 h-3 bg-black/20 rounded"></div>
            </li>
          ))}
        </ul>

        {/* Button */}
        <div className="mt-4 w-full h-10 bg-black/30 rounded-lg"></div>
      </div>
    </div>
  );
};
