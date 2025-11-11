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

const Header = ({ isHero }: { isHero?: boolean }) => {
  return (
    <div className="flex items-center justify-between">
      <div
        className={`flex items-center gap-1 ${
          isHero ? "bg-logo" : "bg-white/20 backdrop-blur-[20px]"
        } rounded-[300px] px-2.5 md:px-4 py-1.5 md:py-2.5 max-w-[97px] md:max-w-[154px]`}
      >
        <div className="image shrink-0">
          <Link href={"/"}>
            <Image
              src={"/images/logo.svg"}
              alt="Skyborne Drop Logo"
              width={44}
              height={50}
              className="object-contain w-7 md:w-11 h-8 md:h-[50px]"
            />
          </Link>
        </div>
        <div className="logo-text font-Satoshi">
          <h2
            className={`font-medium text-[11px] md:text-lg leading-none font-satoshi-500 text-[#494949] ${
              isHero ? "text-[#494949]" : "text-[#FFFFFF]"
            }`}
          >
            Skyborne Drop
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-3.5">
        <Button
          className={`${
            !isHero && "bg-[#FFFFFF] text-[#000000]"
          } max-md:py-1 max-md:px-4 `}
        >
          Signup
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            <div className="image">
              <Image
                src={isHero ? "/images/menu.svg" : "/images/menu-white.svg"}
                alt="Menu"
                width={45}
                height={45}
                className="object-contain cursor-pointer size-7.5 md:size-11"
              />
            </div>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
