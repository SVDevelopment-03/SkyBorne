"use client";
import { Typography } from "@/components/ui/heading";
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";
import EmailVerify from "./EmailVerify";
import OtpVerify from "./OtpVerify";
import ResetPassword from "./ResetPassword";
export interface EmailVerifyProps {
  nextStep: () => void;
  updateEmail?: (email: string) => void;
  prevStep?: () => void;
  userEmail: string;
}

const totalSteps = 3;
const FORGOT_PASSWORD_STEP_KEY = "forgot-password-step";
const FORGOT_PASSWORD_EMAIL_KEY = "forgot-password-email";

const getInitialStep = () => {
  if (typeof window === "undefined") return 1;

  const savedStep = window.sessionStorage.getItem(FORGOT_PASSWORD_STEP_KEY);
  const parsedStep = Number(savedStep);

  if (Number.isNaN(parsedStep) || parsedStep < 1 || parsedStep > totalSteps) {
    return 1;
  }

  return parsedStep;
};

const getInitialEmail = () => {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(FORGOT_PASSWORD_EMAIL_KEY) ?? "";
};

const ForgotPassword = () => {
  const [step, setStep] = useState(getInitialStep);
  const [userEmail, setUserEmail] = useState(getInitialEmail);

  useEffect(() => {
    window.sessionStorage.setItem(FORGOT_PASSWORD_STEP_KEY, String(step));
  }, [step]);

  useEffect(() => {
    if (userEmail) {
      window.sessionStorage.setItem(FORGOT_PASSWORD_EMAIL_KEY, userEmail);
      return;
    }

    window.sessionStorage.removeItem(FORGOT_PASSWORD_EMAIL_KEY);
  }, [userEmail]);

  const nextStep = () => {
    setStep((prev) => (prev < totalSteps ? prev + 1 : prev));
  };

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const updateEmail = (email: string) => {
    setUserEmail(email);
  };

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
              title={`${((step / totalSteps) * 100).toFixed(2)}% complete`}
              cssClass="text-[#1D1D1DCC]!"
            />
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2.5" />
        </div>

        {/* Current Step Content */}
        <div
          className={`bg-black/5 rounded-[30px] shadow max-h-[calc(100%-100px)]`}
        >
          <div
            className={`bg-white rounded-[30px] px-5 md:px-13 py-6 md:py-12 h-full`}
          >
            {step === 1 && (
              <EmailVerify
                nextStep={nextStep}
                updateEmail={updateEmail}
                userEmail={userEmail}
              />
            )}
            {step === 2 && (
              <OtpVerify
                nextStep={nextStep}
                prevStep={prevStep}
                userEmail={userEmail}
              />
            )}
            {step === 3 && (
              <ResetPassword
                nextStep={nextStep}
                prevStep={prevStep}
                userEmail={userEmail}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
