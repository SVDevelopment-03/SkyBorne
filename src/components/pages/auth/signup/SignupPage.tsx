"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Typography } from "@/components/ui/heading";
import Step1 from "./Step1";
import { useSignup } from "./SignupContext";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step7Packages from "./Step7Package";

export default function SignupPage() {
  const { step, totalSteps } = useSignup();

  return (
    <div className="mx-auto max-xl:px-6 py-6 max-w-[1080px] w-full min-h-dvh">
      <div className="flex flex-col gap-8 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Typography
              title={`Step ${step} of ${totalSteps}`}
              cssClass="text-[#1D1D1DCC]!"
            />
            <Typography
              title={`${(step / totalSteps) * 100}% complete`}
              cssClass="text-[#1D1D1DCC]!"
            />
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2.5" />
        </div>

        {/* Current Step Content */}
        <div
          className={`${
            step != 7
              ? "bg-black/5 rounded-[30px] shadow max-h-[calc(100%-100px)]"
              : ""
          }`}
        >
          <div
            className={`${
              step != 7
                ? "bg-white rounded-[30px] px-5 md:px-13 py-6 md:py-8 h-full"
                : ""
            }`}
          >
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
            {step === 5 && <Step5 />}
            {step === 6 && <Step6 />}
            {step === 7 && <Step7Packages />}
          </div>
        </div>
      </div>
    </div>
  );
}
