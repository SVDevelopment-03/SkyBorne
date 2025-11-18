"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { SignupFormData } from "./SignupTypes";

interface SignupContextType {
  step: number;
  setStep: (step: number) => void;
  formData: SignupFormData;
  totalSteps: number;
  updateStepData: <K extends keyof SignupFormData>(
    key: K,
    values: SignupFormData[K]
  ) => void;
}

const defaultData: SignupFormData = {
  step1: { inspiration: "" },
  step2: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    acceptTerms: false,
  },
  step3: { phone: "" },
  step4: { otp: ["", "", "", "", "", ""] },
  step5: { ageGroup: "", wellnessRole: "" },
  step6: { goal: "" },
  step7: { selectedPlan: "" },
  step8: { tourCompleted: false },
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const totalSteps = 8;
  const [step, setStep] = useState<number>(0);

  const [formData, setFormData] = useState<SignupFormData>(defaultData);

  const updateStepData = <K extends keyof SignupFormData>(
    key: K,
    value: SignupFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SignupContext.Provider
      value={{ step, setStep, formData, updateStepData, totalSteps }}
    >
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = (): SignupContextType => {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup must be used inside <SignupProvider />");
  return ctx;
};
