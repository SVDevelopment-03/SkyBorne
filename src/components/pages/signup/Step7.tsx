import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import React, { useState } from "react";
import { useSignup } from "./SignupContext";
import { SignupSubscriptionPlan } from "@/components/ui/SubscriptionPlanUi";
import SuccessAlert from "@/utils/swal";
import { useCreatePaymentMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetPlansQuery } from "@/store/api/publicApi";
import { IPlan } from "@/types/home.type";

const Step7 = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selected, setSelected] = useState<string>("2");
  const [createPayment, { isLoading }] = useCreatePaymentMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { step, setStep, totalSteps, formData } = useSignup();
      const { data, isLoading:planLoading, error } = useGetPlansQuery(undefined);
      const plans: IPlan[] = data?.data || [];
  const name = formData?.step2?.firstName;

  // const handlePayment = async () => {
  //   try {
  //     const payload = {
  //       amount: 99,
  //       currency: "USD",
  //       userId: user._id,
  //     };

  //     const res = await createPayment(payload).unwrap();

  //     window.location.href = res.paymentLink;

  //   } catch (err) {
  //     toast.error("Payment failed");
  //   }
  // };

  const nextStep = () => {
    setShowSuccess(true);
    setTimeout(() => {
      if (step < totalSteps) setStep(step + 1);
    }, 0);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const plansDetail = [
    {
      id: 1,
      name: "Starter Plan",
      price: "0",
      description: "Wellness for beginners or focused paths.",
      features: [
        "Up to 2 yoga group sessions/week",
        "Access to Yoga only",
        "Community chat, attendance tracker",
        "Beginner-friendly guidance",
        "No long-term commitment",
      ],
      isMain: false,
    },
    {
      id: 2,
      name: "Flex Plan",
      price: "0",
      description: "Balance, variety, and tools for steady progress.",
      features: [
        "4 sessions/week across Yoga + Fitness",
        "Downloadable wellness guides",
        "Habit tracker & reminder nudges",
        "Priority booking for workshops",
        "Support for changing needs",
      ],
      isMain: true,
    },
    {
      id: 3,
      name: "All Access Plan",
      price: "0",
      description: "Full access for holistic living and big goals",
      features: [
        "Unlimited sessions",
        "Exclusive webinars & milestone rewards",
        "Priority booking always",
        "Community challenges & leaderboards",
        "Personalized feedback and coaching",
      ],
      isMain: false,
    },
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-14 h-full">
      <div className="flex flex-col items-center gap-5">
        <Typography
          title="Choose your wellness plan to unlock full access"
          type="xxl"
          cssClass="leading-tight"
        />
        <Typography
          title="No payment required now just pick your style! You can change plans at any time."
          type="theme"
        />
      </div>
      <div className="flex flex-col gap-8 md:gap-14 h-full overflow-auto [scrollbar-width:none]">
        <div className="w-full max-lg:overflow-x-auto max-lg:[scrollbar-width:none]">
          <div className="grid grid-cols-3 items-stretch justify-center gap-4 h-full lg:gap-5 w-full min-w-[800px]">
            {plans?.map((plan) => {
              return (
                <SignupSubscriptionPlan
                  key={plan?._id}
                  onClick={() => setSelected(plan?._id)}
                  name={plan?.name}
                  description={plan?.description}
                  features={plan?.features}
                  price={plan?.price as string}
                  isMain={plan?._id == selected}
                />
              );
            })}
          </div>
        </div>
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
            onClick={nextStep}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            Unlock My Plan
          </Button>
        </div>
      </div>
      {showSuccess && (
        <SuccessAlert
          message={`Nice job ${name}! Your account is ready.`}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default Step7;
