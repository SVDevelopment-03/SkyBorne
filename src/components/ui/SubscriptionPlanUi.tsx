import Image from "next/image";
import { Badge } from "./badge";
import Heading from "./heading";
import { Button } from "./button";
import { MouseEventHandler } from "react";

interface SubscriptionProp {
  name: string;
  price: string;
  description: string;
  features: string[];
  isMain?: boolean;
  onClick?: () => void;
}

const SubscriptionPanUi = ({
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
      } px-3 md:px-[15px] flex flex-col items-start gap-7 md:gap-7.5 pt-7.5 md:pt-[42px] pb-3 md:pb-[15px]`}
    >
      <Badge
        variant={`${isMain ? "outline" : "secondary"}`}
        className="px-8! py-3! text-sm! md:text-xl! leading-5! font-satoshi-500 max-h-10 font-medium"
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
          heading: `text-[26px] md:text-[35px]! ${
            isMain ? "text-white" : "text-black"
          }`,
          paragraph: `text-xs md:text-base ${
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
            className="px-8! py-4! text-sm! md:text-lg! leading-5! font-montserrat mt-3.5"
          >
            Sign up & Claim
          </Button>
        </ul>
        <div></div>
      </div>
    </div>
  );
};

export const SignupSubscriptionPlan = ({
  name,
  price,
  description,
  features,
  onClick,
  isMain = false,
}: SubscriptionProp) => {
  return (
    <div
      className={`rounded-[18px] ${
        isMain ? "bg-[#B95E82]" : "bg-[#FFCFBD]/20"
      } px-3 flex flex-col items-start gap-6 pt-7.5 pb-3 md:pb-[15px]`}
      onClick={onClick}
    >
      <Badge
        variant={`${isMain ? "outline" : "secondary"}`}
        className="px-6! py-2.5! text-sm! md:text-base! leading-5! font-satoshi-500 max-h-10 font-medium"
      >
        {name}
      </Badge>
      <Heading
        title={`$${price}/Month`}
        description={description}
        cssClass="items-start! !gap-3 md:!gap-2.5"
        isUpdated={true}
        isMain={isMain}
        elemClass={{
          heading: `text-[26px] md:text-[26px]! ${
            isMain ? "text-white" : "text-black"
          }`,
          paragraph: `text-xs md:text-[13px] ${
            isMain ? "text-white" : "text-black/70 "
          }!text-left`,
        }}
      />
      <div
        className={`rounded-xl p-4 w-full  ${
          isMain ? "bg-[#FFF7DD]" : "bg-transparent"
        }`}
      >
        <ul className="space-y-4 font-satoshi-500 text-xs md:text-[13px] text-black/70 font-medium [&_li]:flex [&_li]:items-center [&_li]:gap-2">
          {features?.map((feature, i) => (
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
          <Button
            variant={"theme"}
            className="px-8! py-2.5! text-sm! md:text-sm! leading-5! font-montserrat mt-3.5"
          >
            {isMain ? 'Selected' : 'Select Plan'}
          </Button>
        </ul>
      </div>
    </div>
  );
};

export default SubscriptionPanUi;
