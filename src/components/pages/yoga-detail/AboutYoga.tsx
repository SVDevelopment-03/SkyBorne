import { Button } from "@/components/ui/button";
import { WhiteHeading } from "@/components/ui/heading";
import HeadingDiv from "@/components/ui/HeadingDiv";
import Image from "next/image";
import React from "react";

const AboutYoga = () => {
  return (
    <div className="max-w-[1390px] mx-auto">
      <div className="bg-[#FFE8E8] gap-12 md:gap-15 rounded-2xl md:rounded-[30px] max-md:pb-7.5 max-lg:px-7.5 py-14 text-[#494949]">
        <div className="grid grid-cols-[1fr_589px] gap-6 md:gap-12 pr-16 items-stretch">
          <div className="flex flex-col items-start justify-between gap-24 pl-16">
            <HeadingDiv
              variant={"secondary"}
              cssClass="items-start"
              badge={"Yoga at Skyborne Drop"}
              elemCss={{ title: "max-w-[450px]", description: "text-left" }}
              title="What is Yoga, Really?"
              description="Yoga goes beyond movement it’s a practice that centers the mind, builds resilience, and restores calm. At Skyborne Drop, everyone is welcome to join our classes, reconnect with breath, and cultivate a balanced, healthy life"
            />
            <Button variant={"theme"} className="mt-2.5">
              Sign up for a class
            </Button>
          </div>
          <div className="flex flex-col items-center gap-8 bg-[#B95E82] size-full rounded-2xl">
            <Image
              src={"/images/yoga-details.jpg"}
              alt="our-service-3"
              width={569}
              height={522}
              className="object-contain rounded-2xl w-full"
            />
          </div>

          <div className="flex items-center justify-between gap-[22px]">
            <div className="bg-[#B95E82]/25 size-full rounded-2xl">
              <Image
                src={"/images/yoga-details-1.jpg"}
                alt="yoga-service-1"
                width={343}
                height={427}
                className="object-cover rounded-2xl size-full"
              />
            </div>
            <div className="bg-[#B95E82]/25 size-full rounded-2xl">
              <Image
                src={"/images/yoga-details-2.jpg"}
                alt="ypga-service-2"
                width={343}
                height={427}
                className="object-cvern rounded-xl size-full"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-8 bg-[#B95E82] rounded-xl px-3.5 md:px-6.5 py-[42px] min-h-[427px]">
            <WhiteHeading
              title="The Power of Yoga"
              description="Yoga empowers you to relieve stress, improve flexibility, and enhance sleep quality. Whether you’re joining for relaxation or building strength, our certified instructors and supportive community make wellness accessible to all.\n\n
  Skyborne Drop guides your journey with daily live sessions, replays, feedback, and encouragement for growth—every step of the way."
              elemClass={{
                heading: "md:text-[40px]",
                paragraph: "max-w-[487px]",
              }}
            />
            <Button variant={"yellow"} className="mt-auto">
              Book classes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutYoga;
