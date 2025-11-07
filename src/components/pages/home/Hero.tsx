import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Footer from "@/components/layout/footer";

const LiText = ({ text, link }: { text: string; link: string }) => {
  return (
    <li className="pb-4 pt-5.5 border-b border-[#494949]">
      <Link href={`${link}`} className="outline-none">
        <div className="flex flex-col">
          <div className="flex items-center gap-7.5">
            <h2 className="font-medium text-lg">{text}</h2>
            <div className="border border-[#494949]/20 bg-black/20 rounded-[50px] w-[37px] h-[19px] flex items-center justify-center">
              <Image
                src={"/images/arrow-right.svg"}
                alt="Skyborne Drop Logo"
                width={16}
                height={0}
              />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

const Hero = () => {
  return (
    <div className="hero-gradient rounded-[30px] text-[#494949] pt-6 px-[60px] font-montserrat">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-logo rounded-[300px] px-4 py-2.5 max-w-[154px]">
            <div className="image shrink-0">
              <Link href={"/"}>
                <Image
                  src={"/images/logo.svg"}
                  alt="Skyborne Drop Logo"
                  width={44}
                  height={50}
                  className="object-contain"
                />
              </Link>
            </div>
            <div className="logo-text font-Satoshi">
              <h2 className="font-medium text-lg leading-none font-satoshi-500 text-[#494949]">
                Skyborne Drop
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Button>Signup</Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                {" "}
                <div className="image">
                  <Image
                    src={"/images/menu.svg"}
                    alt="Menu"
                    width={45}
                    height={45}
                    className="object-contain cursor-pointer"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-end justify-between gap-5 min-h-[800px]">
          <div className="flex flex-col gap-11 pb-14">
            <div className="flex flex-col gap-7">
              <h2 className="font-medium text-[60px] leading-[110%] font-satoshi-500">
                Live Balanced. Feel Energized. Be Well
              </h2>
              <Button variant={"outline"} className="max-w-[152px]">
                Get Started
              </Button>
            </div>
            <div className="rounded-[10px] bg-black/20 w-[367px] h-[232px]">
              <Image
                src={"/images/hero-left-image.svg"}
                alt="Skyborne left image"
                width={339}
                height={204}
                className="object-contain p-3.5 size-full"
              />
            </div>
          </div>
          <div className="relative center-image shrink-0 z-10">
            <div className="absolute top-5 left-2 -z-10">
              <h2 className="font-satoshi-500 text-[135px] leading-normal font-bold bg-clip-text [-webkit-text-fill-color:transparent] bg-[linear-gradient(180deg,rgba(0,0,0,0.32)0%,rgba(0,0,0,0)100%)] uppercase">
                Skyborne
              </h2>
            </div>
            <Image
              src={"/images/hero-center-image.svg"}
              alt="Skyborne center Logo"
              width={467}
              height={716}
              className="object-contain"
            />
            <div>
              <div className="absolute top-54 right-40">
                <div className="flex items-center justify-center rounded-full size-5 bg-white/20">
                  <div className="flex items-center justify-center rounded-full size-4 bg-white/50">
                    <div className="flex items-center justify-center rounded-full size-2.5 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="absolute top-50 -right-6">
                <Button variant={"transparent"} className="cursor-default!">Healthy mind</Button>
              </div>
            </div>
            <div>
              <div className="absolute bottom-18 left-40">
                <div className="flex items-center justify-center rounded-full size-5 bg-white/20">
                  <div className="flex items-center justify-center rounded-full size-4 bg-white/50">
                    <div className="flex items-center justify-center rounded-full size-2.5 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-14 -left-6">
                <Button variant={"transparent"} className="cursor-default!">Healthy body</Button>
              </div>
            </div>
          </div>
          <div className="nav w-[234px] shrink-0 pb-14">
            <ul>
              <LiText text="Yoga Classes" link="/" />
              <LiText text="Group Therapy" link="/" />
              <LiText text="Nutrition Consults" link="/" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
