import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import HeadingDiv from "@/components/ui/HeadingDiv";
import { coachDetail } from "@/constants/about-us.constant";
import Image from "next/image";
import React from "react";

interface ServiceDetailProp {
  title: string;
  description: string[];
  src?: string;
  badges: string[];
  cssClass?: string;
}

const Coach = ({
  title,
  description,
  badges,
  src = "",
  cssClass,
}: ServiceDetailProp) => {
  return (
    <div
      className={`bg-[#FFF8F5] hover:bg-[#FFF8F5]/80 rounded-xl p-4 md:py-6 md:px-5 flex flex-col items-start max-md:min-w-[230px] xl:max-w-[391px] gap-6 md:gap-7.5 max-md:w-[250px] h-full ${cssClass}`}
    >
      <div className="flex items-center justify-center size-30 bg-[#FFE8E8] rounded-br-full pr-6">
        <Image
          src={src}
          alt="service-image"
          width={38}
          height={38}
          className="rounded-[10px] size-7 md:size-9.5 object-contain object-center"
        />
      </div>
      <div className={`flex flex-col gap-3.5 md:gap-6 items-start w-full`}>
        <Typography
          title={title}
          cssClass="!text-[#19191B] !text-base md:!text-xl font-satoshi-700"
        />
        <div className="flex flex-col gap-3 md:gap-6.5 w-full">
          <ul className="space-y-3 font-satoshi-500 text-xs md:text-[13px] lg:text-base text-black/70 font-medium [&_li]:flex [&_li]:items-center [&_li]:gap-2">
            {description?.map((feature, i) => (
              <li key={i}>
                <Image
                  src={"/images/right-tick.svg"}
                  alt="Tick"
                  height={18}
                  width={18}
                />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 w-full overflow-x-auto [scrollbar-width:none]">
            {badges?.map((desc, i) => (
              <Badge
                key={i}
                variant={"outline"}
                className="px-3! py-1! text-[10px]! md:text-xs! leading-5! font-satoshi-500 font-medium text-[#494949] border-[#F3CDDC]"
              >
                {desc}
              </Badge>
            ))}
          </div>
          <Button
            variant={"theme"}
            className="px-7! py-2.5! text-sm! md:text-base! leading-5! font-montserrat pt-2.5 md:max-w-[150px]"
          >
            Join a Class
          </Button>
        </div>
      </div>
    </div>
  );
};

const Coaches = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-[50px] bg-[#FBEFD8] rounded-xl md:rounded-[30px] px-2 py-8.5 md:py-16">
      <HeadingDiv
        title="Meet Our Wellness Specialists"
        description="Connect with certified experts in yoga, fitness, and nutrition for personalized classes and guidance to help you thrive."
        cssClass="items-start"
        elemCss={{ description: "text-left" }}
      />
      <div className="max-lg:w-full max-lg:overflow-x-auto max-lg:[scrollbar-width:none]">
        <div className="grid grid-cols-3 items-center justify-center flex-wrap gap-5 max-md:min-w-[800px]">
          {coachDetail?.map((coach) => (
            <Coach
              key={coach?.id}
              src={coach?.image}
              badges={coach?.badges}
              title={coach?.title}
              description={coach?.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coaches;
