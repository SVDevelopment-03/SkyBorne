import HeadingDiv from "@/components/ui/HeadingDiv";
import { coachDetail } from "@/constants/about-us.constant";
import Image from "next/image";
import React from "react";

interface ServiceDetailProp {
  title: string;
  description: string;
  src?: string;
  role?: string;
}

const CoachDetail = ({ title, description, role }: ServiceDetailProp) => {
  return (
    <div className="rounded-xl font-satoshi-500 md:bg-[#F8F8F8]">
      <div className="flex flex-col gap-0.5 md:px-6 md:py-3.5">
        <h2 className="text-lg md:text-xl font-bold font-satoshi-700 tracking-wide">
          {title}
        </h2>
        <p className="font-montserrat font-medium text-sm md:text-[15px] leading-[25px] text-[#B95E82]">
          {role}
        </p>
        <p className="leading-[1.2] mt-1.5 font-satoshi-400 font-normal text-[10px] md:text-base text-[#4D4D4D]">
          {description}
        </p>
      </div>
    </div>
  );
};

const Coach = ({ title, description, role, src = "" }: ServiceDetailProp) => {
  return (
    <div className=" flex items-center max-md:gap-5.5 rounded-xl">
      {/* <Image
        src={src}
        alt="service-image"
        width={344}
        height={488}
        className="rounded-[10px] h-[153px] max-md:w-[153px] md:h-[488px] object-cover object-center shrink-0"
      /> */}
      <div className="md:p-4 max-w-[406px]">
        <CoachDetail title={title} description={description} role={role} />
      </div>
    </div>
  );
};

const Coaches = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-[50px] bg-[#FBEFD8] rounded-xl md:rounded-[30px] px-2 py-8.5 md:py-16">
      <HeadingDiv
        title="Meet Our Coaches"
        description="Our team blends expertise, care, and encouragement—making every class approachable and impactful"
        cssClass="items-start"
        elemCss={{ description: "text-left" }}
      />
      <div className="flex items-center justify-center flex-wrap gap-4">
        {coachDetail?.map((coach) => (
          <Coach
            key={coach?.id}
            src={coach?.image}
            title={coach?.title}
            role={coach?.role}
            description={coach?.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Coaches;
