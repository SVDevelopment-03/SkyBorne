import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
interface ServiceDetailProp {
  title: string;
  description: string;
  src?: string;
}

const ServiceDetail = ({ title, description }: ServiceDetailProp) => {
  return (
    <div className="rounded-md bg-white/20 backdrop-blur-[20px] text-[#FFFFFF] font-satoshi-500">
      <div className="flex flex-col gap-2 px-5 py-2.5">
        <h2 className="font-medium text-[25px] leading-[1.1]">
          {title}
        </h2>
        <p className="text-lg leading-[1.1] font-satoshi-400 font-normal ">
          {description}
        </p>
      </div>
    </div>
  );
};

const Service = ({ title, description, src = "" }: ServiceDetailProp) => {
  return (
    <div className="relative rounded-[10px] h-[451px]">
      <Image
        src={src}
        alt="service-image"
        className="rounded-[10px] h-full object-center"
        width={406}
        height={451}
      />
      <div className="px-2.5 absolute bottom-2.5 max-w-[406px]">
        <ServiceDetail title={title} description={description} />
      </div>
    </div>
  );
};

const Services = () => {
  return (
    <div className="flex flex-col items-center gap-12 py-[53px] px-10 text-[#494949] bg-[linear-gradient(135deg,rgba(255,247,221,0.2)_0.7%,rgba(255,207,189,0.1)_50%,rgba(255,247,221,0.2)_100%)]">
      <div className="flex flex-col items-center justify-center text-center gap-6 font-satoshi-500">
        <h2 className="text-5xl">Find Your Flow, Every Day</h2>
        <p className="text-lg  text-[#1D1D1D] max-w-[492px]">Every class invites you to return—to your body, your presence, your breath. Find your path to lasting wellness</p>
      </div>
      <div className="flex items-center justify-center gap-5">
        <Service
          src="/images/service1.jpg"
          title="Yoga"
          description="Gentle movement and mindful stillness blend tradition and innovation for all levels."
        />
        <Service
          src="/images/service2.jpg"
          title="Zumba Dance"
          description="Group classes with music. Burn calories and enjoy dance."
        />
        <Service
          src="/images/service3.jpg"
          title="Diet & Nutrition"
          description="Recharge focus, relieve stress, and nourish with guided meditations & nutrition support."
        />
      </div>
      <div>
        <Button variant={"outline"}>Explore all Services</Button>
      </div>
    </div>
  );
};

export default Services;
