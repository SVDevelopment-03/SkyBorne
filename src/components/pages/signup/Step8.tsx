"use client";
import { Typography } from "@/components/ui/heading";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import { Pagination } from "swiper/modules";
import {
  CalenderIcon,
  CommentIcon,
  TrendingIcon,
  UsersIcon,
} from "@/icons/helpIcon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Step8 = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 md:gap-16 h-dvh pt-5">
      <div className="flex flex-col items-center justify-center gap-2.5 px-4">
        <Typography
          title="Welcome to Your Skyborne Dashboard, James !"
          type="xxl"
          cssClass="leading-tight"
        />
        <Typography
          title="Let's take a quick tour of what you can do"
          type="theme"
        />
      </div>
      <TourSlider />
    </div>
  );
};

export function TourSlider() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0); // Initialize with 0 for the first slide

  const swiperRef = useRef<SwiperType | null>(null);

  const SwiperDetail = [
    {
      icon: <CalenderIcon />,
      title: "Book live group sessions in a click",
      description:
        "Browse our schedule and join sessions that fit your goals and schedule. Easy booking, instant confirmation.",
    },
    {
      icon: <TrendingIcon />,
      title: "See your progress and celebrate milestones",
      description:
        "Track your wellness journey with beautiful visualizations. Hit milestones and earn badges as you grow.",
    },
    {
      icon: <UsersIcon />,
      title: "Connect in chat, learn from experts, and join challenges",
      description:
        "Join our vibrant community. Participate in group challenges, chat with members, and get expert guidance.",
    },
    {
      icon: <CommentIcon />,
      title: "Access support anytime via chat or FAQ",
      description:
        "Need help? We're here for you 24/7. Quick answers in our FAQ or chat with our support team.",
    },
  ];

  const handleBack = () => {
    if (currentIndex === 0) {
      router.push("/dashboard");
    } else {
      swiperRef.current?.slidePrev();
    }
  };

  const handleNext = () => {
    if (currentIndex === 3) {
      router.push("/dashboard");
    } else {
      swiperRef.current?.slideNext();
    }
  };

  return (
    <div className="bg-black/5 rounded-[30px] shadow max-h-[calc(100%-100px)]">
      <div className="bg-white rounded-[30px] px-5 md:px-13 py-6 md:py-12 w-full max-w-[1080] text-center">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={40}
          className="mySwiper"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setCurrentIndex(swiper.activeIndex); // store instance
          }}
          onSlideChange={(swiper) => {
            setCurrentIndex(swiper.activeIndex); // updates index every time
          }}
        >
          {/* Slide 1 */}
          {SwiperDetail?.map((swiperData, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-8 md:gap-11 items-center">
                <div className="bg-[linear-gradient(135.33deg,#B95E82_0%,#FFFBF7_135.16%)] size-24 rounded-3xl flex flex-col items-center justify-center shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]">
                  {swiperData?.icon}
                </div>
                <div className="flex flex-col items-center gap-5">
                  <Typography
                    title={swiperData?.title}
                    cssClass="text-[30px]! text-[#0A0A0A]!"
                  />
                  <Typography
                    title={swiperData?.description}
                    cssClass="text-[#4A5565]! max-w-[536px] text-center"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Buttons */}
        <div className="flex justify-center items-center gap-4 md:gap-5.5 pt-[45px]">
          <Button
            variant={"outlineBlack"}
            onClick={handleBack}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            {currentIndex == 0 ? "Skip Tour" : "Previous"}
          </Button>
          <Button
            variant={"theme"}
            onClick={handleNext}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            {currentIndex < 3 ? "Next" : "Take me to dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Step8;
