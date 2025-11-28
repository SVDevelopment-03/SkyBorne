"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { toTitleCase } from "@/utils/Titlecase";
import UserAvatar from "@/hooks/useAvatar";
import { Typography } from "../ui/heading";

const Header = ({ isHero }: { isHero?: boolean }) => {
  const router = useRouter();
    const {user} = useSelector((state:RootState)=>state.auth);
    const avatarName = user?.firstName[0] + (user?.lastName ? user?.lastName[0] :'' );
      const fullName =toTitleCase( user?.firstName +' ' + (user?.lastName ? user?.lastName :'' ));
  const menuDetail = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "About us",
      link: "/about-us",
    },
    {
      title: "Our services",
      link: "/our-services",
    },
    {
      title: "How it works",
      link: "/how-works",
    },
    {
      title: "Packages",
      link: "/packages",
    },
    {
      title: "Blogs",
      link: "/blogs",
    },
    {
      title: "Contact us ",
      link: "/contact-us",
    },
    {
      title: "Testimonials",
      link: "/testimonials",
    },
  ];
  return (
    <div className="flex items-center justify-between">
      <div
        className={`flex items-center gap-1 ${
          isHero ? "bg-logo" : "bg-white/20 backdrop-blur-[20px]"
        } rounded-[300px] px-2.5 md:px-4 py-1.5 md:py-2.5 max-w-[97px] md:max-w-[154px]`}
      >
        <div className="image shrink-0">
          <Link href={"/"} className="cursor-pointer">
            <Image
              src={"/images/logo.png"}
              alt="Skyborne Drop Logo"
              width={44}
              height={50}
              className="object-contain w-7 md:w-11 h-8 md:h-[50px]"
            />
          </Link>
        </div>
        <Link href={"/"} className="cursor-pointer">
          <div className="logo-text font-Satoshi">
            <h2
              className={`font-medium text-[11px] md:text-lg leading-none font-satoshi-500 text-[#494949] ${
                isHero ? "text-[#494949]" : "text-[#FFFFFF]"
              }`}
            >
              Skyborne Drop
            </h2>
          </div>
        </Link>
      </div>
      <div className="relative flex items-center gap-3.5">
      {!user ?   <>
         <Button
          className={`${
            !isHero && "bg-[#FFFFFF] text-[#000000]"
          } max-md:py-1 max-md:px-4 `}
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
        <Button
          className={`${
            !isHero && "bg-[#FFFFFF] text-[#000000]"
          } max-md:py-1 max-md:px-4 `}
          onClick={() => router.push("/signup")}
        >
          Signup
        </Button>
        </>
      :   <>
              <div className="flex items-center cursor-pointer" onClick={()=>router.push("/dashboard")}>
                <UserAvatar name={avatarName}/>
              </div>
            </>}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="image rounded-full">
              <Image
                src={isHero ? "/images/menu.svg" : "/images/menu-white.svg"}
                alt="Menu"
                width={45}
                height={45}
                className="object-contain cursor-pointer size-7.5 md:size-11"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-[#494949]/60 backdrop-blur-2xl border-none shadow-md text-white min-w-[200px] p-3"
            align="end"
          >
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            {menuDetail?.map((menu) => (
              <DropdownMenuItem
                key={menu?.title}
                className=" hover:bg-[#FFF7DD]! text-[#494949]! hover:text-[#494949]! p-0"
              >
                <Link
                  href={menu?.link}
                  className="text-[#FFF7DD] font-satoshi-500 font-medium text-base hover:text-[#494949]  w-full px-3 py-1.5"
                >
                  {menu?.title}
                </Link>
                <DropdownMenuSeparator />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
