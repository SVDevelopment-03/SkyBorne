import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { GrayTimer } from "@/icons/helpIcon";
import { OurValueProp } from "@/types/home.type";
import Image from "next/image";
import React from "react";

const Rocket = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_291_921)">
        <path
          d="M14.222 21.2192C14.2592 21.3118 14.3238 21.3909 14.4072 21.4457C14.4906 21.5006 14.5888 21.5286 14.6885 21.526C14.7883 21.5235 14.8849 21.4905 14.9654 21.4314C15.0459 21.3724 15.1064 21.2901 15.1388 21.1957L21.4983 2.6062C21.5296 2.5195 21.5356 2.42569 21.5155 2.33572C21.4955 2.24576 21.4502 2.16337 21.385 2.09819C21.3199 2.03301 21.2375 1.98775 21.1475 1.96769C21.0575 1.94763 20.9637 1.9536 20.877 1.98491L2.28754 8.34448C2.19312 8.37686 2.11086 8.43735 2.05182 8.51782C1.99277 8.5983 1.95975 8.69491 1.95719 8.7947C1.95464 8.89448 1.98267 8.99266 2.03752 9.07605C2.09237 9.15945 2.17142 9.22407 2.26406 9.26124L10.0227 12.3725C10.268 12.4707 10.4908 12.6176 10.6778 12.8042C10.8648 12.9909 11.0121 13.2135 11.1107 13.4585L14.222 21.2192Z"
          stroke="#B95E82"
          strokeWidth="1.95679"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.3814 2.10254L10.6777 12.8052"
          stroke="#B95E82"
          strokeWidth="1.95679"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_291_921">
          <rect width="23.4815" height="23.4815" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const InnerBlogDetail = ({
  image,
  title,
  description,
}: OurValueProp) => {
  return (
    <div className="flex flex-col gap-5 md:gap-6.5 pb-5 md:pb-6 max-md:w-[246px] h-full">
      <div className="h-[219px] md:h-[312px] w-full rounded-t-3xl">
        <Image
          src={image}
          alt="service-image"
          width={396}
          height={281}
          className="rounded-t-[10px] size-full object-center object-cover"
        />
      </div>
      <div className={`flex flex-col items-start gap-[5px] px-5 md:px-6`}>
        <Typography
          title={title}
          cssClass="!text-lg md:!text-2xl"
          type="theme"
        />
        <Typography
          title={description}
          type="regular"
          cssClass={`max-w-full text-start text-[15px] md:text-xl leading-normal font-satoshi-400 text-[#717182]!`}
        />
      </div>
      <div className="mt-5 md:mt-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-1 text-[#717182]">
          <GrayTimer />
          <Typography
            title="5 min read"
            cssClass="text-xs md:text-[17px] text-[#717182]"
          />
        </div>
        <div className="flex items-center gap-1">
          <Typography title="Read more →" cssClass="text-[#B95E82]!" />
        </div>
      </div>
    </div>
  );
};

const InnerBlog = () => {
  const yogaDetails = [
    {
      id: 1,
      isMain: false,
      image: "/images/article-1.jpg",
      title: "Finding Calm in Busy Times",
      description:
        "Yoga and meditation create balance. Breathing promotes relaxation.",
    },
    {
      id: 2,
      isMain: true,
      image: "/images/article-2.jpg",
      title: "The Science of Movement",
      description:
        "Learn how activity benefits your body and mind. Find tips for daily movement.",
    },
    {
      id: 3,
      isMain: false,
      image: "/images/article-3.jpg",
      title: "Food, Mood, and Motivation",
      description:
        "Explore nutrition guides linking food to emotions. Find meal plans for busy lives.",
    },
  ];
  return (
    <div className="flex flex-col items-center px-2 md:px-10 lg:px-[86px]">
      <div className="max-w-[1268px] flex flex-col gap-[58px]">
        <div>
          <Image
            src={"/images/inner-blog.jpg"}
            alt="inner-blog"
            width={1268}
            height={734}
            className="rounded-3xl"
          />
        </div>
        <div className="bg-[linear-gradient(180deg,#FFE8E8_0%,#FFF7DD_100%)] p-9 rounded-3xl w-full">
          <Typography
            title="In a world full of distractions, finding calm is essential for wellbeing."
            cssClass="text-[30px]!"
          />
        </div>
        <div className="flex flex-col gap-[31px]">
          <Typography
            type="regular"
            title="Yoga and meditation create balance. Breathing promotes relaxation. In busy times, a few mindful moments restore clarity and peace."
            cssClass="text-2xl!"
          />
          <Typography
            type="regular"
            title="Even a short session of deep breathing can anchor us in the present and reduce stress. The practice doesn't require hours of your day—just a few intentional minutes can transform your mental state and overall wellbeing."
            cssClass="text-2xl!"
          />
          <Typography
            type="regular"
            title="When we cultivate mindfulness in our daily routines, we build resilience against the challenges that life presents. This isn't about escaping reality; it's about developing the tools to navigate it with grace and composure."
            cssClass="text-2xl!"
          />
        </div>
        <div className="rounded-3xl"></div>
      </div>
    </div>
  );
};

export default InnerBlog;
