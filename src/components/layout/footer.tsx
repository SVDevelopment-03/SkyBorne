/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { footerSections, socialLinks } from "@/constants/home.constant";
import * as Yup from "yup";
import { useNewsLetterMutation } from "@/store/api/publicApi";

export const newsletterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

import Link from "next/link";
import { useFormik } from "formik";
import toast from "react-hot-toast";


const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-arrow-right-icon lucide-arrow-right"
  >
    <path d="M1 12h18" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default function Footer() {
   const [newsLetter] = useNewsLetterMutation();

  // Formik Setup
  const formik = useFormik({
    initialValues: { email: "" },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        await newsLetter(values).unwrap();
        toast.success("Subscribed successfully!");
        resetForm();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to subscribe");
      }
    },
  });

  return (
    <footer className="bg-[#494949] text-[#FFF7DD] rounded-2xl md:rounded-[30px] pt-7.5 lg:pt-[71px] pb-2 lg:pb-9 px-2 md:px-5 lg:px-[61px] font-satoshi-500">
      <div className="max-w-full mx-auto">
        {/* Top Grid */}
        <div className="grid md:grid-cols-3 gap-7.5 md:gap-10">
          {/* Dynamic Footer Sections */}
          <div className="md:col-span-2 flex items-start gap-8 md:gap-10 xl:gap-[100px] max-md:order-1">
            {footerSections?.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-10 md:gap-8">
                <h3 className="font-medium text-base md:text-xl uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-5 md:space-y-2">
                  {section?.links.map((link, i) => (
                    <li
                      key={i}
                      className="cursor-pointer hover:text-white/70 transition text-sm md:text-base font-montserrat font-normal"
                    >
                      <Link href={link?.link ? `${link?.link}` : "#"}>
                        {link?.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Subscribe Section */}
          <div className="flex flex-col md:items-end justify-between gap-3 max-md:order-3">
            <h3 className="font-semibold text-lg md:text-[28px] leading-normal uppercase md:text-right">
              SUBSCRIBE TO RECEIVE MORE UPDATES
            </h3>
 <form onSubmit={formik.handleSubmit}>
              <div className="relative flex items-center w-fit justify-start">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="bg-transparent border border-gray-400 rounded-full pl-5 pr-16 py-2 md:py-4 w-80 lg:w-96 text-base placeholder:text-[#7F7F7F] text-[#7F7F7F] focus:outline-none"
                />

                {/* Submit button */}
                <button
                  type="submit"
                  className="absolute right-2 bg-[#F5F1E7] text-[#494949] rounded-full max-md:size-7 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm font-semibold -rotate-30"
                >
                  →
                </button>
              </div>

              {/* Error Message */}
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-xs mt-1 pl-6 md:text-sm">
                  {formik.errors.email}
                </p>
              )}
            </form>

          </div>

          {/* Social Links + Copyright */}
          {/* <div className="pt-[72px] flex flex-col md:flex-row justify-between items-center text-sm"> */}
          <div className="md:col-span-2 flex items-center gap-4 mb-4 md:mb-0 max-md:order-2">
            {socialLinks?.map((name, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="rounded-full border border-gray-400 py-2.5 text-[11px] md:text-sm font-normal text-[#FFF7DD] flex items-center gap-2"
              >
                {name}
                <ArrowRightIcon />
              </Button>
            ))}
          </div>

          <div className="text-left md:text-right md:max-w-[328px] max-md:order-4 ml-auto">
            <p className="text-sm md:text-lg font-montserrat">
              Copyright 2025. Skyborne Drop | Privacy Policy | Terms Conditions
            </p>
          </div>
        </div>

        <div className="image w-full pt-6.5 md:pt-14">
          <Image
            src={"/images/footer.svg"}
            alt="Skyborne footer"
            width={467}
            height={349}
            className="object-cover md:object-contain w-full rounded-[10px] max-md:min-h-[178px]"
          />
        </div>
      </div>
    </footer>
  );
}
