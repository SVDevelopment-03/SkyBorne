"use client";
import { Button } from "@/components/ui/button";
import { services } from "@/constants/home.constant";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
interface ServiceDetailProp {
  title: string;
  description: string;
  src?: string;
  hovered?: boolean;
  index?: number;
}

const ServiceDetail = ({ title, description }: ServiceDetailProp) => {
  return (
    <div className="rounded-md bg-white/20 backdrop-blur-[20px] text-[#FFFFFF] font-satoshi-500">
      <div className="flex flex-col gap-1.5 md:gap-2 px-3.5 md:px-5 py-1.5 md:py-2.5">
        <h2 className="font-medium text-lg md:text-[25px] leading-[1.1]">
          {title}
        </h2>
        <p className="text-xs md:text-lg leading-[1.1] font-satoshi-400 font-normal ">
          {description}
        </p>
      </div>
    </div>
  );
};

const Service = ({
  title,
  description,
  src = "",
  hovered,
  index,
}: ServiceDetailProp) => {
  return (
    <>
      <Image
        src={src}
        alt="service-image"
        className="rounded-[10px] object-cover object-center"
        // style={{ flex: hovered == index ? "1.5" : "1" }}
        fill
      />
      <div
        className={`px-1.5 md:px-2.5 absolute inset-x-0 bottom-2.5 ${
          hovered ? "max-w-[406px]" : "max-w-full"
        }`}
      >
        <ServiceDetail title={title} description={description} />
      </div>
    </>
  );
};

const Services = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToSecond = () => {
      if (scrollRef.current && window.innerWidth < 768) {
        const child = scrollRef.current.children[0]?.children[1] as HTMLElement; // 2nd card
        if (child) {
          const offset =
            child.offsetLeft -
            scrollRef.current.clientWidth / 2 +
            child.clientWidth / 2;
          scrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
        }
      }
    };

    scrollToSecond();
    window.addEventListener("resize", scrollToSecond);
    return () => window.removeEventListener("resize", scrollToSecond);
  }, []);
  return (
    <div className="flex flex-col items-center gap-9 md:gap-12 md:py-[53px] px-5 md:px-10 text-[#494949]">
      <div className="flex flex-col items-center justify-center text-center gap-2.5 md:gap-6 font-satoshi-500">
        <h2 className="text-[30px] md:text-5xl">Find Your Flow, Every Day</h2>
        <p className="text-[13px] text-lg  text-[#1D1D1D] max-w-[492px]">
          Every class invites you to return—to your body, your presence, your
          breath. Find your path to lasting wellness
        </p>
      </div>
      <div
        ref={scrollRef}
        className="max-lg:w-full max-lg:overflow-x-auto max-lg:[scrollbar-width:none]"
      >
        <div className="flex items-center md:justify-center gap-3.5 md:gap-5">
          {services?.map((service, index) => (
            <div
              className="flex relative rounded-lg md:rounded-[10px] h-[312px] md:h-[451px] w-[280px] md:w-[406px] max-md:min-w-[280px] shrink-0 md:overflow-hidden transition-all ease-in-out duration-600"
              style={{ flex: hovered == index ? "1.6" : "1" }}
              key={service?.id}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <Service
                src={service?.src}
                title={service?.title}
                description={service?.description}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Button variant={"outline"}>Explore all Services</Button>
      </div>
    </div>
  );
};

export default Services;
