import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import React, { useState } from "react";
import { useSignup } from "./SignupContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import SuccessAlert from "@/utils/swal";
import MotionDiv from "@/components/ui/MotionDiv";

const Step6 = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const { step, setStep, totalSteps, formData, updateStepData } = useSignup();
  const [selected, setSelected] = useState(formData?.step6?.goal || "");

  const handleSelect = (val: string) => {
    setSelected(val);
    updateStepData("step6", { goal: val });
  };

  const nextStep = () => {
    setShowSuccess(true);
    setTimeout(() => {
      if (step < totalSteps) setStep(step + 1);
    }, 0);
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
    <div className="flex flex-col gap-8 md:gap-12 h-full">
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
                className={`flex items-center gap-4 border-[2.5px] rounded-xl p-5.5 cursor-pointer transition 
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
        <div className="bg-[#FFE8E8] border border-[#B95E82] px-15 py-7.5 flex items-start gap-3 rounded-[10px]">
          <Typography
            title="Setting a goal helps you stay motivated. Change it anytime."
            type="lgBlack"
            cssClass="text-[22px]! leading-none!"
          />
        </div>
        {/* ---------------------- */}

        <div className="flex justify-center items-center gap-4 md:gap-5.5">
          <Button
            variant={"outlineBlack"}
            onClick={prevStep}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            Back
          </Button>
          <Button
            variant={"theme"}
            disabled={!selected}
            onClick={nextStep}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            Next
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
