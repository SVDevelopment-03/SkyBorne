import { Typography } from "@/components/ui/heading";
import HelpIcon from "@/icons/helpIcon";
import { OurValueProp } from "@/types/home.type";
import Image from "next/image";
import React from "react";

const HelpDetail = ({
  image,
  title,
  description,
  cssClass,
  icon = "",
}: OurValueProp) => {
  return (
    <div className="flex flex-col gap-6.5">
      <div className="flex items-center justify-between">
        <div className={`flex flex-col items-start gap-2.5`}>
          <Typography
            title={title}
            cssClass="!text-[30px] !leading-8"
            type="xl"
          />
          <Typography
            title={description}
            type="regular"
            cssClass={`max-w-full text-start leading-normal font-satoshi-500`}
          />
        </div>
        <HelpIcon icon={icon} />
      </div>
      <div className="h-[312px] w-full rounded-xl bg-[#B95E82]/50">
        <Image
          src={image}
          alt="service-image"
          width={367}
          height={306}
          className="rounded-[10px] size-full object-center object-cover"
        />
      </div>
    </div>
  );
};

const Help = () => {
  const helpDetails = [
    {
      id: 1,
      image: "/images/help-3.jpg",
      title: "Chat with Us",
      description: "+971 89359298",
      icon: "whatsapp",
    },
    {
      id: 2,
      image: "/images/help-2.jpg",
      title: "Email Support",
      description: "support@skyborne.com",
      icon: "email",
    },
    {
      id: 3,
      image: "/images/help-1.jpg",
      title: "Quick Help",
      description: "Response time: within 24 hours",
      icon: "timer",
    },
  ];

  return (
    <div className="flex flex-col gap-[50px] items-center">
      <Typography title="We’re Here to Help" type="xl" />
      <div className="mt-4.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpDetails?.map((help) => (
          <div className="bg-[#FFE8E8] rounded-2xl p-4 pt-6" key={help?.id}>
            <HelpDetail
              image={help?.image}
              title={help?.title}
              description={help?.description}
              icon={help?.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
