import { AdminNav, SidebarNav } from "@/constants/dashboard.constant";
import { InfoIcon } from "@/icons/dashboardIcon";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Typography } from "../ui/heading";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import LogoutAlert from "@/utils/LogoutAlert";
import { removeTokens } from "@/lib/token";


const AdminSidebar = () => {
  const [selected, setSelected] = useState("Dashboard");
  const [showAlert, setShowAlert] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


  const router = useRouter();

  const handleLogoutConfirm = () => {
    removeTokens();
    router.push("/login");
  };

  return (
    <div className="flex flex-col bg-white overflow-y-auto h-full [scrollbar-width:none] pb-3.5">
      <div className="flex flex-col gap-13.5 p-5 bg-white">
        <div
          className={`flex items-center gap-1 rounded-[300px] max-w-[97px] md:max-w-[154px]`}
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
                className={`font-medium text-[11px] md:text-lg leading-none font-satoshi-500 text-[#494949]`}
              >
                Skyborne Drop
              </h2>
            </div>
          </Link>
        </div>
        <div className="flex flex-col justify-center gap-2.5 md:gap-4">
          {AdminNav.navMain.map((item) => (
            <div
              className=""
              key={item?.title}
              onClick={() => setSelected(item?.title)}
            >
              {!item?.logout && (
                <Link
                  href={item?.url}
                  className={`font-medium rounded-[12px] flex items-center gap-4 p-3.5 ${
                    selected === item.title
                      ? "shadow-[0px_3.52px_5.29px_-3.52px_#0000001A,0px_8.81px_13.22px_-2.64px_#0000001A] bg-[#B95E82] text-[#FFF7DD]"
                      : "bg-white/0 text-[#494949]"
                  } hover:text-[#FFF7DD] hover:bg-[#B95E82] transition-all
              `}
                >
                  <div className="flex items-center gap-2.5">
                    {item?.icon && <item.icon />}

                    <h2 className="font-satoshi-500 font-medium text-sm md:text-base lg:text-lg leading-tight">
                      {item?.title}
                    </h2>
                  </div>
                </Link>
              )}

              {item?.logout && (
                <div
                  onClick={() => setShowAlert(true)}
                  className={`font-medium rounded-[12px] flex items-center gap-4 p-3.5 cursor-pointer ${
                    selected === item.title
                      ? "shadow-[0px_3.52px_5.29px_-3.52px_#0000001A,0px_8.81px_13.22px_-2.64px_#0000001A] bg-[#B95E82] text-[#FFF7DD]"
                      : "bg-white/0 text-[#494949]"
                  } hover:text-[#FFF7DD] hover:bg-[#B95E82] transition-all
              `}
                >
                  <div className="flex items-center gap-2.5">
                    {item?.icon && <item.icon />}

                    <h2 className="font-satoshi-500 font-medium text-sm md:text-base lg:text-lg leading-tight">
                      {item?.title}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 mt-auto ">
        <div className="h-px bg-[#DCE5E0] my-6"></div>
        <div className="rounded-[14px] bg-[#FBFAF9] p-4 flex flex-col items-end gap-7.5">
          <div className="flex items-start gap-3">
            <div className="bg-[#FFE8E8] rounded-[10px] h-9 w-9 p-2">
              <InfoIcon />
            </div>
            <div className="flex flex-col gap-1">
              <Typography
                title="Need Assistance?"
                type="xxl"
                cssClass="text-[#0A0A0A]! text-lg!"
              />
              <Typography
                title="Our support team is here 24/7"
                type="regular"
                cssClass="text-[#717182]! text-[15px]!"
              />
              <Button variant={"themeRegular"} className="mt-6">
                Get Help
              </Button>
            </div>
          </div>
        </div>
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

export default AdminSidebar;
