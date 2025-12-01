"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface CardImage {
  id: number;
  src: string;
  alt: string;
}

const imageCards: CardImage[] = [
  { id: 1, src: "/images/explore-section1.svg", alt: "section-1" },
  { id: 2, src: "/images/explore-section2.svg", alt: "section-2" },
  { id: 3, src: "/images/explore-section3.svg", alt: "section-3" },
];

// import bgExplore from "../../../../public/images/explore-main.svg"

const Explore = () => {
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);

  // const [cards, setCards] = React.useState(CARD_COLORS);

  // const moveToEnd = (from: number) => {
  //   setCards((prev:any) => move([...prev], from, prev.length - 1));
  // };

  return (
    <div
      className="flex items-center justify-between max-lg:min-h-[907px] lg:h-[791px] bg-[#FFF7DD] bg-no-repeat bg-cover bg-bottom w-full"
      style={{ backgroundImage: "url('/images/explore-main.svg')" }}
    >
      <div className="grid md:grid-cols-2 max-md:gap-[183px] px-3.5 pt-11 pb-7.5 md:p-16 w-full max-w-full 2xl:max-w-[1440px] mx-auto font-satoshi-500 text-[#FFF7DD]">
        <div className="flex flex-col justify-between gap-4 self-center md:gap-20 md:max-h-[522px] md:h-full">
          <div className="flex flex-col gap-4 md:gap-5 items-start">
            <Button
              variant={"outline"}
              className="text-[#FFF7DD] border-[#FFF7DD] py-2 hover hover:text-[#FFF7DD] hover:border-[#FFF7DD] hover:bg-transparent cursor-default"
            >
              How it works
            </Button>
            <h2 className="text-[30px] max-md:leading-tight md:text-5xl lg:max-w-[433px]">
              Discover, Book, Transform All in One Place
            </h2>
          </div>
          <div className="flex flex-col gap-5 items-start  lg:max-w-[480px]">
            <p className="text-sm md:text-lg">
              Every class invites you to return—to your body, your presence,
              your breath. Find your path to lasting wellness
            </p>
            <Button className="bg-[#FFF7DD] text-[#494949] hover:text-white hover:border-[#B95E82] hover:bg-[#B95E82]"
            onClick={()=>router.push("/coming-soon")}>
              Explore all classes
            </Button>
          </div>
        </div>

        <div className="flex max-md:flex-col items-center gap-5 md:gap-16">
          {/* Image Stack */}
          <div className="relative flex flex-col items-center md:items-end justify-center min-h-[390px] w-full">
            {imageCards.map((img, index) => (
              <motion.div
                key={img.id}
                className="absolute"
                animate={{
                  y: active === img.id ? 0 : (index - 1) * 60,
                  scale: active === img.id ? 1.05 : 1,
                  zIndex: active === img.id ? 40 : index,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={422}
                  height={426}
                  className={`w-[308px] md:w-[422px] h-[311px] md:h-[426px] rounded-xl shadow-lg object-cover transition-all duration-300 ${
                    active === img.id ? "ring-4 ring-[#FFF7DD]" : "opacity-80"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Number List */}
          <div className="flex flex-row max-md:items-center md:flex-col gap-4">
            {imageCards.map((img, i) => (
              <motion.h4
                key={img.id}
                onMouseEnter={() => setActive(img.id)}
                // Hovering on number highlights image
                onClick={() => setActive(img.id)}
                className={`cursor-pointer text-sm md:text-[22px] leading-normal transition-all duration-300 ${
                  active === img.id
                    ? "text-[#FFF7DD] scale-125"
                    : active === null && i == 2
                    ? "text-[#FFF7DD] scale-125"
                    : "text-[#FFF7DD]/50 hover:text-[#FFF7DD]/80"
                }`}
              >
                {img.id.toString().padStart(2, "0")}
              </motion.h4>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
