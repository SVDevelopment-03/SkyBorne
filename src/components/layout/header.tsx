"use client";
import React, { useState } from "react";
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
import useGetUser from "@/hooks/useGetUser";
import LogoutAlert from "@/utils/LogoutAlert";
import { removeTokens } from "@/lib/token";

const Header = ({ isHero }: { isHero?: boolean }) => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useGetUser();
  const avatarName = `${user?.firstName?.charAt(0) || "U"}${
    user?.lastName?.charAt(0) || ""
  }`;
  const fullName = toTitleCase(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User",
  );
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
    // {
    //   title: "Blogs",
    //   link: "/blogs",
    // },
    {
      title: "Contact us ",
      link: "/contact-us",
    },
    {
      title: "Testimonials",
      link: "/testimonials",
    },
  ];

  const handleClick = () => {
    if (user?.role == "admin") {
      router.push("/admin-dashboard");
    }
    if (user?.role == "trainer") {
      router.push("/trainer-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleLogoutConfirm = () => {
    removeTokens();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between">
      <div
        className={`flex items-center gap-1 min-h-0 ${
          isHero ? "bg-logo" : "bg-white/20 backdrop-blur-[20px]"
        } rounded-[300px] px-2 mr-2 sm:mr-0 sm:px-2.5 md:px-4 py-[2px] sm:py-[4px] md:py-2.5 max-w-[120px] md:max-w-[154px]`}
      >
        <div className="image shrink-0">
          <Link href={"/"} className="cursor-pointer">
            <Image
              src="/images/logo.png"
              alt="Skyborne Drop Logo"
              priority
              width={448}
              height={512}
              className="w-9 sm:w-10 md:w-11"
            />
          </Link>
        </div>
        <Link href={"/"} className="cursor-pointer min-w-0">
          <div className="logo-text font-Satoshi min-w-0">
            <h2
              className={`font-medium text-[10px] sm:text-[11px] md:text-lg leading-tight font-satoshi-500
              ${isHero ? "text-[#494949]" : "text-[#FFFFFF]"}`}
            >
              Skyborne Drop
            </h2>
          </div>
        </Link>
      </div>
      <div className="relative flex items-center gap-3.5">
        {!user ? (
          <>
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
        ) : (
          <>
            <div
              className="flex items-center cursor-pointer"
              onClick={handleClick}
            >
              <UserAvatar name={avatarName} />
            </div>
          </>
        )}
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
            {user && (
              <DropdownMenuItem
                onClick={() => setShowAlert(true)}
                className="hover:bg-[#FFF7DD]! text-[#494949]! hover:text-[#494949]! p-0 cursor-pointer"
              >
                <span className="text-[#FFF7DD] font-satoshi-500 font-medium text-base hover:text-[#494949] w-full px-3 py-1.5">
                  Logout
                </span>
                <DropdownMenuSeparator />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {showAlert && (
        <LogoutAlert
          onConfirm={handleLogoutConfirm}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default Header;
