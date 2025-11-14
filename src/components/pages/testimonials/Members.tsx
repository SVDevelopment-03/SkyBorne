import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import RatingReview from "@/components/ui/rating-review";
import Image from "next/image";
import React from "react";

const Members = () => {
  return (
    <div className="flex flex-col gap-9 md:gap-14 items-center">
      <Typography title="Real Members, Real Progress" type="xl2" cssClass="max-md:text-[25px]" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[372px_minmax(372px,1fr)_372px] gap-2.5 md:gap-5">
        <div className="flex md:flex-col gap-2.5 md:gap-5">
          <div className="relative h-[237px] md:h-[336] w-full bg-[#B95E82]/50 rounded-lg md:rounded-[20px]">
            <Image
              src={"/images/member-1.jpg"}
              alt="member-1"
              width={372}
              height={336}
              className="rounded-lg md:rounded-[20px] size-full object-cover"
            />
          </div>
          <div className="relative h-[237px] md:h-[336] w-full bg-[#B95E82]/50 rounded-lg md:rounded-[20px]">
            <Image
              src={"/images/member-2.jpg"}
              alt="member-2"
              width={372}
              height={336}
              className="rounded-lg md:rounded-[20px] size-full object-cover"
            />
          </div>
        </div>
        <div className="row-span-2 relative">
          <div className="relative h-[405px] md:h-[694px] w-full bg-[#B95E82]/50 rounded-lg md:rounded-[20px]">
            <Image
              src={"/images/member-3.jpg"}
              alt="member-3"
              width={484}
              height={694}
              className="rounded-lg md:rounded-[20px] size-full object-cover"
            />
            <div className="absolute inset-0 p-5 flex flex-col justify-between h-full">
              <div className="flex flex-col gap-4.5">
                <Badge variant={"yellow"} className="px-4 py-1">
                  Yoga for Stress Relief
                </Badge>
                <div className="[&_.start]:text-white! [&_.start]:text-xl md:[&_.start]:text-3xl!">
                  <RatingReview rating={0} />
                </div>
              </div>
              <div>
                <Badge variant={"filled"} className="font-satoshi-500 text-xl">
                  Priya Patel
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-2">
          <div className="relative h-[405px] md:h-[694px] w-full bg-[#B95E82]/50 rounded-lg md:rounded-[20px]">
            <Image
              src={"/images/member-4.jpg"}
              alt="member-4"
              width={372}
              height={694}
              className="rounded-lg md:rounded-[20px] size-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
