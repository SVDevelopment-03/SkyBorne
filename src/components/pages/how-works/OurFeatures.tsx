"use client"
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import HeadingDiv from "@/components/ui/HeadingDiv";
import MotionDiv from "@/components/ui/MotionDiv";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
interface FeatureDetailProps {
  image: string;
  heading: string;
  description: string;
  buttonText: string;
  isRight?: boolean;
}

const featureDetails = [
  {
    image: "/images/how-works-1.jpg",
    heading: "Choose Your Focus",
    description:
      "Select the wellness experience you want yoga, fitness, meditation, or nutrition. Explore diverse programs and choose what motivates you most, whether it’s stress relief, strength, balance, or mindful eating. Skyborne lets you personalize your own journey, at your pace, with options for every goal and lifestyle",
    buttonText: "01",
  },
  {
    image: "/images/how-works-2.jpg",
    heading: "Find Your Program",
    description:
      "Browse our selection of live and on-demand classes and curated wellness tracks. With options ranging from guided yoga, dynamic fitness sessions, mindful meditation, and practical nutrition tips, you can tailor your experience to fit your goals. Discover programs by interest, duration, or expertise level, and start building your personal path to lasting wellness one step, one session, one habit at a time",
    buttonText: "02",
  },
  {
    image: "/images/how-works-3.jpg",
    heading: "Book Instantly",
    description:
      "Secure your spot, join a live session, or access content whenever it fits your schedule. Skyborne makes booking effortless single-click reservations, instant confirmations, and flexible options whether you want to join now, later, or catch up on-demand. Never miss out our reminders and calendar integrations keep you on track, so you can focus only on your wellbeing",
    buttonText: "03",
  },
  {
    image: "/images/how-works-4.jpg",
    heading: "Track Your Progress",
    description:
      "Track your journey with Skyborne’s dashboard. View session history, earn badges, and receive encouragement. Reflect on attendance, set goals, and enjoy rewards. The dashboard consolidates your stats and achievements, helping you stay motivated. Share your progress or keep it private it's your choice.",
    buttonText: "04",
  },
];

const FeatureDetail = ({
  image,
  heading,
  description,
  buttonText,
  isRight,
}: FeatureDetailProps) => {
  const router = useRouter();
  return (
    <div
      className={`flex md:flex-row items-center gap-7.5 md:gap-16 lg:gap-31.5 w-full ${
        isRight ? "max-md:flex-col " : "max-md:flex-col-reverse"
      }`}
    >
      {isRight && (
        <MotionDiv position="left">
          <div className="max-md:w-[358px] max-md:mr-auto">
            <Image
              src={image}
              alt="how-works-1"
              width={544}
              height={544}
              className="rounded-[15px] max-md:w-full"
            />
          </div>
        </MotionDiv>
      )}
      <MotionDiv position={isRight ? "right" : "left"}>
        <div className="flex flex-col items-start gap-5.5 md:gap-14 lg:gap-21 max-md:w-full">
          <div
            className={`flex flex-col items-start justify-center gap-4 md:gap-7.5 flex-1`}
          >
            <Typography
              title={heading}
              type="xl"
              cssClass="!text-[22px] md:!text-4xl"
            />
            <Typography
              cssClass="!text-[#494949] max-w-[594px]"
              title={description}
            />
          </div>
          <Button
            variant={"theme"}
            className={`px-6 md:px-10 py-2 md:py-3.5 text-xs md:text-base lg:text-lg font-medium`}
            onClick={() => router.push("/signup")}
          >
            {buttonText}
          </Button>
        </div>
      </MotionDiv>
      {!isRight && (
        <MotionDiv>
          <div className="max-md:w-[358px] max-md:mr-auto">
            <Image
              src={image}
              alt="how-works-1"
              width={544}
              height={544}
              className="rounded-[15px] max-md:w-full"
            />
          </div>
        </MotionDiv>
      )}
    </div>
  );
};

const OurFeatures = () => {
  return (
    <div className="flex flex-col items-center gap-12.5 md:gap-20 lg:gap-32.5">
      <HeadingDiv
        badge="How it works"
        title="The Values That Power Skyborne"
        description="From first step to lasting change, our core values shape every class, connection, and achievement"
        elemCss={{
          title: "max-md:!text-center",
          description: "max-md:!text-center",
        }}
      />
      <div className="flex flex-col items-center gap-15 md:gap-24 lg:gap-32.5 max-w-[1268px] mx-auto w-full">
        {featureDetails?.map((featureData, i) => {
          return (
            <FeatureDetail
              image={featureData?.image}
              heading={featureData?.heading}
              description={featureData?.description}
              buttonText={featureData?.buttonText}
              key={featureData?.buttonText}
              isRight={i % 2 == 0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OurFeatures;
