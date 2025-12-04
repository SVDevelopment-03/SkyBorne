"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/layout/header";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const LiText = ({ text, link }: { text: string; link: string }) => {
  return (
    <li className="pb-2.5 md:pb-4 pt-4 first:pt-0 md:pt-5.5 border-b border-[#494949]">
      <Link href={`${link}`} className="outline-none">
        <div className="flex flex-col">
          <div className="flex items-center gap-7.5">
            <h2 className="font-medium text-xs md:text-lg">{text}</h2>
            <div className="border border-[#494949]/20 bg-white md:bg-black/20 rounded-[50px] w-6 md:w-[37px] h-3 md:h-[19px] flex items-center justify-center">
              <Image
                src={"/images/arrow-right.svg"}
                alt="Skyborne Drop Logo"
                width={16}
                height={0}
                className="w-2.5 md:w-4"
              />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

const Hero = () => {
  const router = useRouter();

  return (
    <div className="hero-gradient rounded-2xl md:rounded-[30px] text-[#494949] pt-3.5 md:pt-6 px-3 md:px-[60px] font-montserrat">
      <div className="max-w-[1440px] mx-auto">
        <Header isHero={true} />
        <div className="flex max-xl:flex-col items-center lg:items-center xl:items-end justify-between gap-5 min-h-[800px] max-xl:pt-[70px] max-lg:pb-3">
          <div className="flex flex-col gap-11 max-lg:items-center pb-10 md:pb-14">
            <div className="flex flex-col max-lg:items-center gap-7">
              <h2 className="font-medium text-[30px] md:text-[45px] 2xl:text-[60px] leading-[110%] font-satoshi-500 max-lg:text-center max-md:max-w-[293px]">
                Live Balanced. Feel Energized. Be Well
              </h2>
              <Button
                variant={"outline"}
                className="max-w-[152px]"
                onClick={() => router.push("/signup")}
              >
                Get Started
              </Button>
            </div>
            <div className="max-md:hidden rounded-[10px] bg-black/20 w-[367px] h-[232px]">
              <Image
                src={"/images/hero-left-image.svg"}
                alt="Skyborne left image"
                width={339}
                height={204}
                className="object-contain p-3.5 size-full"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="relative center-image shrink-0 z-10 w-fit text-center">
              <div className="absolute top-5 left-2 -z-10">
                {/* <h2 className="font-satoshi-500 text-[65px] lg:text-[135px] leading-normal font-bold bg-clip-text [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,rgba(0,0,0,0.32)0%,rgba(0,0,0,0)100%)] uppercase"> */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 5, ease: "easeOut" }}
                  className="font-satoshi-500 text-[65px] lg:text-[135px] leading-normal font-bold bg-clip-text [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,rgba(0,0,0,0.32)0%,rgba(0,0,0,0)100%)] uppercase"
                >
                  Skyborne
                </motion.h2>
                {/* </h2> */}
              </div>
              <Image
                src={"/images/hero-center-image.svg"}
                alt="Skyborne center Logo"
                width={467}
                height={716}
                className="object-contain w-[305px] md:w-[467px] h-595px] md:h-[716px]"
              />
              <div>
                <div className="absolute top-32 md:top-54 right-26 md:ight-40">
                  <div className="flex items-center justify-center rounded-full size-[13px] md:size-5 bg-white/20">
                    <div className="flex items-center justify-center rounded-full size-[10.48px] md:size-4 bg-white/50">
                      <div className="flex items-center justify-center rounded-full size-[6.54px] md:size-2.5 bg-white"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-30 md:top-50 -right-2 md:-right-6">
                  <Button variant={"transparent"} className="cursor-default!">
                    Healthy mind
                  </Button>
                </div>
              </div>
              <div>
                <div className="absolute bottom-16 md:bottom-18 left-28 md:left-40">
                  <div className="flex items-center justify-center rounded-full size-[13px] md:size-5 bg-white/20">
                    <div className="flex items-center justify-center rounded-full size-[10.48px] md:size-4 bg-white/50">
                      <div className="flex items-center justify-center rounded-full size-[6.54px] md:size-2.5 bg-white"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-14 md:-left-6">
                  <Button variant={"transparent"} className="cursor-default!">
                    Healthy body
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 nav w-fit md:w-[234px] shrink-0 md:pb-14 max-md:bg-[#F0CCC4] max-md:p-2 max-md:rounded-md">
            <div className="md:hidden w-[178px] h-[107px]">
              <Image
                src={"/images/hero-left-image.svg"}
                alt="Skyborne left image"
                width={178}
                height={107}
                className="object-contain size-full"
              />
            </div>
            <ul>
              <LiText text="Yoga Classes" link="/yoga-detail" />
              <LiText text="Group Therapy" link="/fitness-detail/1" />
              <LiText text="Nutrition Consults" link="/diet-detail/1" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
