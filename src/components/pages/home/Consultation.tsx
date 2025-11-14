import ConsultationForm from "@/components/forms/consultation-form";
import Image from "next/image";
import React from "react";

const Consultation = () => {
  return (
    <div className="max-w-full 2xl:max-w-[1440px] mx-auto flex max-lg:flex-col items-stretch gap-5 md:gap-[30px] w-full [scrollbar-width:none]">
      <div className="w-full lg:w-1/2 xl:w-[741px] md:min-h-[610px]">
        <Image
          height={610}
          width={741}
          src="/images/consultation.jpg"
          alt="contact us"
          className="size-full rounded-[30px]"
        />
      </div>
      <div className="flex-1">
        <ConsultationForm />
      </div>
    </div>
  );
};

export default Consultation;
