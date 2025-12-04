import { Button } from "@/components/ui/button";
import { WhiteHeading } from "@/components/ui/heading";
import HeadingDiv from "@/components/ui/HeadingDiv";
import Image from "next/image";
import React from "react";
import MotionDiv from "@/components/ui/MotionDiv";

const AboutZumba = () => {
  return (
    <div className="max-w-[1390px] mx-auto">
      <div className="bg-[#FFE8E8] gap-12 md:gap-15 rounded-2xl md:rounded-[30px] max-md:pb-4 max-md:px-2.5 max-lg:px-7.5 py-14 text-[#494949]">
        <div className="grid lg:grid-cols-2 xl:grid-cols-[1fr_589px] gap-6 md:gap-12 lg:pr-16 items-stretch">
          <MotionDiv position="left">
            <div className="flex flex-col items-start justify-between gap-4 md:gap-24 lg:pl-16">
              <HeadingDiv
                variant={"secondary"}
                cssClass="items-start"
                badge={"Zumba at Skyborne Drop"}
                elemCss={{ title: "max-w-[450px]", description: "text-left" }}
                title="What is Zumba, Really?"
                description="Zumba blends Latin rhythms with easy-to-follow moves, creating a dynamic workout that feels more like a party than exercise. Ignite your body, boost coordination, burn calories, and feel the music lift your mood"
              />
              <Button variant={"theme"} className="mt-2.5">
                Sign up for a class
              </Button>
            </div>
          </MotionDiv>
          <MotionDiv>
            <div className="flex flex-col items-center gap-8 bg-[#B95E82] size-full rounded-2xl">
              <Image
                src={"/images/zumba-1.jpg"}
                alt="zumba-3"
                width={569}
                height={522}
                className="object-cover rounded-2xl size-full"
              />
            </div>
          </MotionDiv>

          <MotionDiv position="left">
            <div className="flex items-center justify-between gap-2.5 md:gap-5.5">
              <div className="bg-[#B95E82]/25 size-full rounded-2xl">
                <Image
                  src={"/images/zumba-2.jpg"}
                  alt="zumba-service-1"
                  width={343}
                  height={427}
                  className="object-cover rounded-2xl size-full"
                />
              </div>

              <div className="bg-[#B95E82]/25 size-full rounded-2xl">
                <Image
                  src={"/images/zumba-dance.jpg"}
                  alt="zumba-service-2"
                  width={343}
                  height={427}
                  className="object-cover rounded-2xl max-h-[415px] size-full"
                />
              </div>
            </div>
          </MotionDiv>
          <MotionDiv>
            <div className="flex flex-col items-start gap-6 md:gap-8 bg-[#B95E82] rounded-xl px-4 md:px-6.5 pt-3.5 pb-6.5 md;py-[42px] md:min-h-[427px]">
              <WhiteHeading
                title="Dance for Full-Body Fitness."
                description="Experience high-energy music and choreography as Zumba transforms cardio into a dance party. Each class boosts heart health, coordination, stamina, and flexibility while burning calories and releasing stress-relieving endorphins.

Whether new to fitness or active, routines are easily modified to suit your pace and enjoy group dancing."
                elemClass={{
                  heading: "text-xl md:text-[40px]",
                  paragraph: "max-md:text-[13px] max-w-[487px]",
                }}
              />
              <Button variant={"yellow"} className="mt-auto">
                Book classes
              </Button>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default AboutZumba;
