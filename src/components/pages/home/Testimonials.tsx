import Heading from "@/components/ui/heading";
import RatingReview from "@/components/ui/rating-review";
import { UserData } from "@/constants/home.constant";
import { TestimonialProps } from "@/types/home.type";
import Image from "next/image";
import React from "react";

const Testimonial = ({ data }: TestimonialProps) => {
  return (
    <div className="rounded-lg md:rounded-[10px] p-5 md:p-6 flex flex-col bg-white">
      <RatingReview rating={4} />
      <div className="pt-4 md:pt-5">
        <h2 className="font-satoshi-500 text-[17px] md:text-[22px] leading-[1.2]">
          {data?.heading}
        </h2>
        <p className="text-xs md:text-base font-montserrat font-normal pt-2.5 md:pt-3 max-w-[362px]">
          {data?.description}
        </p>
        <div className="flex pt-5 md:pt-[30px] items-center gap-4">
          <Image
            src={data?.user?.image}
            alt="user-image"
            height={50}
            width={50}
            className="size-9.5 md:size-12.5"
          />
          <div className="flex flex-col gap-1">
            <h2 className="font-medium text-base md:text-xl text-[#494949] font-montserrat">
              {data?.user?.name}
            </h2>
            <p className="font-normal text-xs md:text-base font-montserrat leading-[1.2] text-[#545454]">
              {data?.user?.totalClasses} classes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <div className="bg-[#FFE8E8] flex flex-col gap-12 md:gap-15 items-center justify-between rounded-2xl md:rounded-[30px] max-md:pb-7.5 max-lg:px-7.5 pt-[70px] text-[#494949]">
      <Heading
        title={"What Our Members Say"}
        description={
          "Don’t just take our word for it hear from the real people who found balance, energy, and growth with Skyborne"
        }
      />
      <div className="relative max-h-[664px] md:max-h-[610px] overflow-hidden [scrollbar-width:none]">
        <div className="absolute bg-[linear-gradient(180deg,#FFE8E8_0%,rgba(255,232,232,0)100%)] h-[116px] w-full z-10"></div>

        <div className="animate-scroll-up grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {UserData?.map((user) => {
            return <Testimonial key={user?.id} data={user} />;
          })}
          {/* duplicate for infinite scroll */}
          {UserData?.map((user) => (
            <Testimonial key={`${user?.id}-duplicate`} data={user} />
          ))}
        </div>
        <div className="sticky bottom-0">
          <div className="absolute bottom-0 bg-[linear-gradient(180deg,#FFE8E8_0%,rgba(255,232,232,0)100%)] md:bg-[linear-gradient(180deg,#FFE8E8_0%,rgba(255,232,232,0)100%)] h-[77px] md:h-[116px] w-full z-10 rotate-180"></div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
