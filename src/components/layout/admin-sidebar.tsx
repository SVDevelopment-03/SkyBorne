/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { AdminNav, SidebarNav } from "@/constants/dashboard.constant";
import { InfoIcon } from "@/icons/dashboardIcon";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Typography } from "../ui/heading";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import LogoutAlert from "@/utils/LogoutAlert";
import { removeTokens } from "@/lib/token";
import { ChevronDown } from "lucide-react";

const AdminSidebar = () => {
  const [selected, setSelected] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const pathname = usePathname();

  const matchRoute = (pathname: string, route: string) => {
    // Convert `:id` to regex matcher
    const regex = new RegExp("^" + route.replace(/:\w+/g, "[^/]+") + "$");
    return regex.test(pathname);
  };

  const router = useRouter();

  // Auto-expand collapsible items if current route matches any sub-item
  useEffect(() => {
    AdminNav.navMain.forEach((item, index) => {
      if (item.isCollapsible && item.items && Array.isArray(item.items)) {
        const hasActiveSubItem = item.items.some((subItem: any) => {
          if (typeof subItem === "string") {
            return pathname.startsWith(subItem);
          } else if (subItem.url) {
            return pathname.startsWith(subItem.url);
          }
          return false;
        });

        if (hasActiveSubItem && !expandedItems.includes(index)) {
          setExpandedItems((prev) => [...prev, index]);
        }
      }
    });
  }, [pathname]);

  const handleLogoutConfirm = () => {
    removeTokens();
    router.push("/login");
  };

  const toggleCollapsible = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isItemActive = (item: any, pathname: string) => {
    if (item.url && pathname === item.url) return true;
    if (item.items && Array.isArray(item.items)) {
      return item.items.some((subItem: any) => {
        if (typeof subItem === "string") {
          return pathname.startsWith(subItem);
        } else if (subItem.url) {
          return pathname.startsWith(subItem.url);
        }
        return false;
      });
    }
    return false;
  };

  return (
    <div className="flex flex-col bg-white overflow-y-auto h-screen [scrollbar-width:none] pb-3.5 ">
      <div className="flex flex-col gap-13.5 p-5 bg-white">
        <div
          className={`flex items-center gap-1 rounded-[300px] max-w-[97px] md:max-w-[154px]`}
        >
          <div className="image shrink-0">
            <Link href={"/"} className="cursor-pointer">
              <Image
                src="/images/logo.png"
                alt="Skyborne Drop Logo"
                priority
                width={448}
                height={512}
                className="w-11"
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
        <div className="flex flex-col justify-center gap-2.5 md:gap-4 max-h-[730px] overflow-y-auto [scrollbar-width:none]">
          {AdminNav.navMain.map((item, i) => (
            <div className="" key={item?.title} onClick={() => setSelected(i)}>
              {!item?.logout && !item?.isCollapsible && (
                <Link
                  href={item?.url}
                  className={`font-medium rounded-[12px] flex items-center gap-4 p-3.5 ${
                    isItemActive(item, pathname)
                      ? "shadow-[0px_3.52px_5.29px_-3.52px_#0000001A,0px_8.81px_13.22px_-2.64px_#0000001A] bg-[#B95E82] text-[#FFF7DD]"
                      : "bg-white/0 text-[#494949]"
                  } hover:text-[#FFF7DD] hover:bg-[#B95E82] transition-all`}
                >
                  <div className="flex items-center gap-2.5">
                    {item?.icon && <item.icon />}

                    <h2 className="font-satoshi-500 font-medium text-sm md:text-base lg:text-lg leading-tight">
                      {item?.title}
                    </h2>
                  </div>
                </Link>
              )}

              {/* Collapsible Item (Ecom) */}
              {item?.isCollapsible && (
                <div>
                  <div
                    onClick={() => toggleCollapsible(i)}
                    className={`font-medium rounded-[12px] flex items-center justify-between gap-4 p-3.5 cursor-pointer ${
                      isItemActive(item, pathname)
                        ? "shadow-[0px_3.52px_5.29px_-3.52px_#0000001A,0px_8.81px_13.22px_-2.64px_#0000001A] bg-[#B95E82] text-[#FFF7DD]"
                        : "bg-white/0 text-[#494949]"
                    } hover:text-[#FFF7DD] hover:bg-[#B95E82] transition-all`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item?.icon && <item.icon />}

                      <h2 className="font-satoshi-500 font-medium text-sm md:text-base lg:text-lg leading-tight">
                        {item?.title}
                      </h2>
                    </div>

                    {/* Chevron Icon */}
                    {item?.collapsibleIcon && (
                      <item.collapsibleIcon
                        size={18}
                        className={`transition-transform duration-300 ${
                          expandedItems.includes(i) ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>

                  {/* Sub-items */}
                  {expandedItems.includes(i) && item?.items && (
                    <div className="mt-2 ml-4 flex flex-col gap-2 border-l-2 border-[#E0E0E0] pl-3">
                      {item.items.map((subItem: any, subIndex: number) => (
                        <Link
                          key={`${i}-${subIndex}`}
                          href={subItem.url}
                          className={`font-medium rounded-[8px] flex items-center gap-3 px-3 py-2 text-sm transition-all ${
                            pathname === subItem.url || pathname.startsWith(subItem.url)
                              ? "bg-[#B95E82] text-[#FFF7DD]"
                              : "bg-white/0 text-[#494949] hover:bg-[#B95E82]/20 hover:text-[#B95E82]"
                          }`}
                        >
                          {subItem?.icon && (
                            <subItem.icon size={16} className="flex-shrink-0" />
                          )}
                          <span className="font-satoshi-500 text-xs md:text-sm">
                            {subItem?.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {item?.logout && (
                <div
                  onClick={() => setShowAlert(true)}
                  className={`font-medium rounded-[12px] flex items-center gap-4 p-3.5 cursor-pointer ${
                    pathname === item.url
                      ? "shadow-[0px_3.52px_5.29px_-3.52px_#0000001A,0px_8.81px_13.22px_-2.64px_#0000001A] bg-[#B95E82] text-[#FFF7DD]"
                      : "bg-white/0 text-[#494949]"
                  } hover:text-[#FFF7DD] hover:bg-[#B95E82] transition-all`}
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
              <Button
                variant={"themeRegular"}
                className="mt-6"
                onClick={() => router.push("/contact-us")}
              >
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