import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomButtons from "@/components/ui/CustomButtons";
import Heading from "@/components/ui/heading";
import Image from "next/image";
import React from "react";

interface SubscriptionProp {
  name: string;
  price: string;
  description: string;
  features: string[];
  isMain?: boolean;
}

const Subscription = ({
  name,
  price,
  description,
  features,
  isMain = false,
}: SubscriptionProp) => {
  return (
    <div
      className={`rounded-[18px] ${
        isMain ? "bg-[#B95E82]" : "bg-[#FFCFBD]/20"
      } px-[15px] flex flex-col items-start gap-7.5 pt-[42px] pb-[15px]`}
    >
      <Badge
        variant={`${isMain ? "outline" : "secondary"}`}
        className="px-8! py-3! text-xl! leading-5! font-satoshi-500 max-h-10 font-medium"
      >
        {name}
      </Badge>
      <Heading
        title={`$${price}/Month`}
        description={description}
        cssClass="items-start! !gap-3"
        isUpdated={true}
        isMain={isMain}
        elemClass={{
          heading: `text-[35px]! ${isMain ? "text-white" : "text-black"}`,
          paragraph: `text-base ${
            isMain ? "text-white" : "text-black/70 "
          }!text-left`,
        }}
      />
      <div className="bg-[#FFF7DD] rounded-xl p-5 w-full">
        <ul className="space-y-4 font-satoshi-500 text-xs md:text-base font-medium [&_li]:flex [&_li]:items-center [&_li]:gap-2">
          {features?.map((feature, i) => (
            <li key={i}>
              <Image
                src={"/images/right-tick.svg"}
                alt="Tick"
                height={20}
                width={20}
              />
              {feature}
            </li>
          ))}
          <Button
            variant={"theme"}
            className="px-8! py-4! text-lg! leading-5! font-montserrat mt-3.5"
          >
            Sign up & Claim
          </Button>
        </ul>
        <div></div>
      </div>
    </div>
  );
};

const SubscriptionPlans = () => {
  const plansDetail = [
    {
      id: 1,
      name: "Starter Plan",
      price: "0",
      description: "Wellness for beginners or focused paths.",
      features: [
        "Up to 2 yoga group sessions/week",
        "Access to Yoga only",
        "Community chat, attendance tracker",
        "Beginner-friendly guidance",
        "No long-term commitment",
      ],
      isMain: false,
    },
    {
      id: 2,
      name: "Flex Plan",
      price: "0",
      description: "Balance, variety, and tools for steady progress.",
      features: [
        "4 sessions/week across Yoga + Fitness",
        "Downloadable wellness guides",
        "Habit tracker & reminder nudges",
        "Priority booking for workshops",
        "Support for changing needs",
      ],
      isMain: true,
    },
    {
      id: 3,
      name: "All Access Plan",
      price: "0",
      description: "Full access for holistic living and big goals",
      features: [
        "Unlimited sessions",
        "Exclusive webinars & milestone rewards",
        "Priority booking always",
        "Community challenges & leaderboards",
        "Personalized feedback and coaching",
      ],
      isMain: false,
    },
  ];

  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="flex flex-col gap-8 md:gap-11 items-center justify-center rounded-2xl md:rounded-[30px] max-md:pb-7.5 max-lg:px-4 text-[#494949]">
        <Heading
          title={"Find Your Perfect Wellness Plan"}
          description={
            "Choose a package that fits your goals and schedule. Flexible options make it easy to start and grow at your pace."
          }
          elemClass={{ heading: "text-black" }}
        />
        <div className="flex flex-col items-center gap-16 w-full">
          <div className="rounded-4xl bg-[#FFE8E8] py-2 px-5 flex items-center gap-5">
            <CustomButtons variant={"theme"} text="Monthly" />
            <CustomButtons variant={"theme"} text="Yearly" />
          </div>
          <div className="w-full max-lg:overflow-x-auto max-lg:[scrollbar-width:none]">
            <div className="grid grid-cols-3 items-center justify-center gap-4 lg:gap-9 w-full min-w-[800px]">
              {plansDetail?.map((plan) => {
                return (
                  <Subscription
                    key={plan?.id}
                    name={plan?.name}
                    description={plan?.description}
                    features={plan?.features}
                    price={plan?.price}
                    isMain={plan?.isMain}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
