"use client";

import Link from "next/link";
import { useSignup } from "./SignupContext";
import Image from "next/image";
import { Typography } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import SignupPage from "./SignupPage";
import Step8 from "./Step8";

// import Step8 from "./steps/Step8";

export default function SignupContainer() {
  const { step } = useSignup();

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeScreen />;
      case 8:
        return <Step8 />;

      default:
        return <SignupPage />;
    }
  };

  return <>{renderStep()}</>;
}

const WelcomeScreen = () => {
  const { setStep } = useSignup();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_50%] lg:grid-cols-[1fr_40%] gap-6 items-center h-screen">
      <div className="flex items-center justify-center px-10 py-0 lg:py-10">
        <div className="flex flex-col items-start justify-center">
          <div
            className={`flex items-center justify-start gap-1 rounded-[300px] max-w-[97px] md:max-w-[154px]`}
          >
            <div className="image shrink-0">
              <Link href={"/"} className="cursor-pointer">
                <Image
                  src={"/images/logo.png"}
                  alt="Skyborne Drop Logo"
                  width={44}
                  height={50}
                  className="object-cover w-7 md:w-11 h-8 md:h-[50px]"
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
          <div className="text-[#494949]">
            <Typography
              title="Welcome to Skyborne Drop!"
              cssClass="text-3xl! md:text-6xl! xl:text-[80px]! max-w-[589px] leading-[1.1] !font-satoshi-700 !font-bold !text-[#494949]"
            />
            <Typography
              title="Start your personalized wellness journey. Group sessions, expert guidance let's make progress together."
              type="lg"
              cssClass="max-w-[454px] mt-12 lg:mt-[76px]"
            />
            <Button
              variant={"theme"}
              onClick={() => setStep(1)}
              className="mt-6 py-[14x]! px-[66px]! font-medium"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 h-screen">
        <Image
          src={"/images/sign-up.jpg"}
          alt="sign-up"
          width={661}
          height={966}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
