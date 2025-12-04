/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import React, { useState } from "react";
import { useSignup } from "./SignupContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import SuccessAlert from "@/utils/swal";
import MotionDiv from "@/components/ui/MotionDiv";
import { useRegisterMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";
import { SignupFormValidation } from "./SignupTypes";
import { setCredentials } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { storage } from "@/lib/storage";

const Step6 = () => {
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const { step, setStep, totalSteps, formData, updateStepData } = useSignup();
  const [selected, setSelected] = useState(formData?.step6?.goal || "");
  const [register, { isLoading }] = useRegisterMutation();
  const tempUserId = formData?.step4?.tempUserId;
  const { step1, step2, step3, step4, step5, step6 } = formData;

  const handleSelect = (val: string) => {
    setSelected(val);
    updateStepData("step6", { goal: val });
  };

  const nextStep = async () => {
    try {
      if (!tempUserId) {
        toast.error("Invalid tempUserId. Please restart signup.");
        return;
      }

      const payload: SignupFormValidation = {
        ...step1,
        ...step2,
        ...step3,
        ...step4,
        ...step5,
        ...step6,
      };

      const res = await register(payload).unwrap();

      const { data } = res;
      const { user, accessToken, refreshToken } = data;
      if (res?.success) {
        storage.set(process.env.NEXT_PUBLIC_USER as string, user);
        localStorage.setItem(
          process.env.NEXT_PUBLIC_ACCESS_TOKEN as string,
          accessToken
        );
        localStorage.setItem(
          process.env.NEXT_PUBLIC_REFRESH_TOKEN as string,
          refreshToken
        );

        dispatch(
          setCredentials({ user: data?.user, accessToken, refreshToken })
        );
        toast.success(res?.message || "Signup completed!");
        setTimeout(() => {
          if (step < totalSteps) setStep(step + 1);
        }, 500);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to complete signup");
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const motivations = [
    {
      id: "1",
      title: "Attend my first session",
    },
    {
      id: "2",
      title: "Build a 7-day streak",
    },
    {
      id: "3",
      title: "Try something new each week",
    },
    {
      id: "4",
      title: "Join a group challenge",
    },
    {
      id: "5",
      title: "I'll decide later",
    },
  ];
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-5 pb-3.5">
        <Typography
          title="Set Your First Goal!"
          type="xxl"
          cssClass="leading-tight"
        />
      </div>
      <div className="flex flex-col gap-8 h-full overflow-auto [scrollbar-width:none]">
        {/* ---- RADIO GROUP ---- */}
        <RadioGroup
          value={selected ?? ""}
          onValueChange={handleSelect}
          className="grid grid-cols-1 gap-4"
        >
          {motivations.map((m) => (
            <MotionDiv key={m.id} position="left">
              <label
                htmlFor={m.id}
                className={`flex items-center gap-4 border-[2.5px] rounded-xl p-4.5 cursor-pointer transition 
                ${
                  selected === m.id
                    ? "border-[#B95E82] bg-[#FFE8E8]"
                    : "border-[#E5E7EB] bg-white"
                }
              `}
              >
                <RadioGroupItem
                  id={m.id}
                  value={m.id}
                  className={`size-5 ${
                    selected === m.id && "border-[#B95E82]"
                  } text-[#B95E82]`}
                />

                <Typography
                  title={m.title}
                  cssClass="xl:!text-xl xl:!leading-none text-[#0A0A0A]!"
                />
              </label>
            </MotionDiv>
          ))}
        </RadioGroup>
        <div className="bg-[#FFE8E8] border border-[#B95E82] h-[61px] max-h-[61px] flex justify-center items-center gap-3 rounded-[10px]">
          <Typography
            title="Setting a goal helps you stay motivated. Change it anytime."
            type="lgBlack"
            cssClass="text-sm! leading-normal md:text-base! lg:text-[22px]! md:leading-none!"
          />
        </div>
        {/* ---------------------- */}

        <div className="flex justify-center items-center gap-4 md:gap-5.5">
          <Button
            variant={"outlineBlack"}
            onClick={prevStep}
            disabled={isLoading}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            Back
          </Button>
          <Button
            variant={"theme"}
            disabled={!selected || isLoading}
            onClick={nextStep}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            <span className="flex flex-row gap-2 items-center">
              {isLoading && (
                <Loader2
                  size={24}
                  className="animate-spin text-white! h-6! w-6!"
                />
              )}
              Next
            </span>
          </Button>
        </div>
      </div>
      {showSuccess && (
        <SuccessAlert
          message="Goal set-let's reach it together"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default Step6;
