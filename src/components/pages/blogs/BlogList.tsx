import CustomButtons from "@/components/ui/CustomButtons";
import CustomPagination from "@/components/ui/CustromPagination";
import { Typography } from "@/components/ui/heading";
import { OurValueProp } from "@/types/home.type";
import Image from "next/image";
import React from "react";

const Blog = ({ image, title, description, cssClass }: OurValueProp) => {
  return (
    <div className="flex flex-col gap-6.5">
      <div className="h-[312px] w-full rounded-[10px] bg-[#B95E82]/50">
        <Image
          src={image}
          alt="service-image"
          width={367}
          height={306}
          className="rounded-[10px] size-full object-center object-cover"
        />
      </div>
      <div className={`flex flex-col items-start gap-3.5`}>
        <Typography title={title} cssClass="!text-[25px]" type="xl" />
        <Typography
          title={description}
          type="regular"
          cssClass={`max-w-full text-start leading-normal font-satoshi-500`}
        />
      </div>
    </div>
  );
};

const BlogList = () => {
  const tabDetails = [
    "Yoga",
    "Meditation",
    "Fitness & Movement",
    "Nutrition",
    "Community Stories",
  ];
  const yogaDetails = [
    {
      id: 1,
      image: "/images/yoga-journey.jpg",
      title: "Finding Calm in Busy Times",
      description:
        "Yoga and meditation create balance. Breathing promotes relaxation.",
    },
    {
      id: 2,
      image: "/images/yoga-journey.jpg",
      title: "The Science of Movement",
      description:
        "Learn how activity benefits your body and mind. Find tips for daily movement.",
    },
    {
      id: 3,
      image: "/images/yoga-journey.jpg",
      title: "Food, Mood, and Motivation",
      description:
        "Explore nutrition guides linking food to emotions. Find meal plans for busy lives.",
    },
    {
      id: 4,
      image: "/images/yoga-journey.jpg",
      title: "Community Stories",
      description: "Be inspired by Skyborne users. Celebrate milestones.",
    },
    {
      id: 5,
      image: "/images/yoga-journey.jpg",
      title: "Mindfulness Practices",
      description:
        "Practice mindfulness to reduce stress. Explore meditation guides.",
    },
    {
      id: 6,
      image: "/images/yoga-journey.jpg",
      title: "Sleep Well, Live Well",
      description:
        "Discover sleep routines and calming sounds for better rest.",
    },
  ];

  return (
    <div className="max-w-[1268px] mx-auto w-full">
      <div className="flex flex-col gap-12 px-4">
        <div className="flex items-center justify-between">
          <Typography
            title="Skyborne Journal Wellness, Insights, Inspiration"
            type="xl2"
            cssClass="max-w-[575px] leading-tight"
          />
          <Typography
            title="Discover expert advice, inspiring stories, and practical wellness tools curated for your journey"
            type="theme"
            cssClass="max-w-[481px]"
          />
        </div>
        <div className="flex items-center gap-5">
          {tabDetails?.map((tab, i) => (
            <CustomButtons
              key={i}
              text={tab}
              variant={i == 0 ? "theme" : "outline"}
              cssClass="font-medium py-1.5! px-[22px]! max-h-[38px]! leading-normal!"
            />
          ))}
        </div>
        <div className="mt-4.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yogaDetails?.map((yoga) => (
            <div className="bg-[#FFE8E8] rounded-2xl p-5" key={yoga?.id}>
              <Blog
                image={yoga?.image}
                title={yoga?.title}
                description={yoga?.description}
              />
            </div>
          ))}
        </div>
        <div className="pt-14.5">
          <CustomPagination />
        </div>
      </div>
    </div>
  );
};

export default BlogList;
