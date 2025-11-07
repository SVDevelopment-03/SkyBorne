import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
  const footerSections = [
    {
      title: "QUICK LINKS",
      links: [
        "About Us",
        "Classes",
        "How it works",
        "Pricing plans",
        "Contact Us",
      ],
    },
    {
      title: "RESOURCES",
      links: ["Schedule", "Pricing", "FAQ", "Memberships", "Guides"],
    },
    {
      title: "SUPPORT",
      links: ["Help Center", "Accessibility", "Help Center"],
    },
  ];

  const socialLinks = ["Instagram", "Facebook", "YouTube"];

  return (
    <footer className="bg-[#494949] text-[#FFF7DD] rounded-[30px] pt-[71px] pb-9 px-[61px] font-satoshi-500">
      <div className="max-w-full mx-auto">
        {/* Top Grid */}
        <div className="grid md:grid-cols-3 gap-10  b-10">
          {/* Dynamic Footer Sections */}
          <div className="col-span-2 flex items-start gap-[100px]">
            {footerSections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-8">
                <h3 className="font-medium text-xl uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li
                      key={i}
                      className="cursor-pointer hover:text-white/70 transition text-base font-montserrat font-normal"
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Subscribe Section */}
          <div className="flex flex-col items-end justify-between gap-3">
            <h3 className="font-semibold text-[28px] leading-normal uppercase md:text-right">
              SUBSCRIBE TO RECEIVE MORE UPDATES
            </h3>
            <div className="relative flex items-center justify-end md:justify-start">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border border-gray-400 rounded-full pl-5 pr-16 py-4 w-80 lg:w-96 text-base placeholder:text-[#7F7F7F] text-[#7F7F7F] focus:outline-none"
              />
              <button className="absolute right-2 bg-[#F5F1E7] text-[#494949] rounded-full px-3 py-2 text-sm font-semibold">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Social Links + Copyright */}
        <div className="pt-[72px] flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex gap-4 mb-4 md:mb-0">
            {socialLinks.map((name, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="rounded-full border border-gray-400 py-2.5 text-sm font-normal text-[#FFF7DD] hover:bg-[#F5F1E7]/10"
              >
                {name} →
              </Button>
            ))}
          </div>

          <div className="text-center md:text-right md:max-w-[328px]">
            <p className="text-lg font-montserrat">
              Copyright 2025. Skyborne Drop | Privacy Policy | Terms Conditions
            </p>
          </div>
        </div>

        <div className="image w-full pt-14">
          <Image
            src={"/images/footer.svg"}
            alt="Skyborne footer"
            width={467}
            height={349}
            className="object-contain w-full rounded-[10px]"
          />
        </div>
      </div>
    </footer>
  );
}
