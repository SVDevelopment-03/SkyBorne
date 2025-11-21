"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { SignupFormData } from "./SignupTypes";
import { decrypt, encrypt } from "@/lib/crypto";

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
  step1: { motivation: "" },
  step2: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeTerms: false,
    authProvider: "email",
  },
  step3: { phoneNumber: "" },
  step4: { otp: "", tempUserId: "" },
  step5: { ageGroup: "", wellnessRole: "" },
  step6: { goal: "" },
  step7: { selectedPlan: "" },
  step8: { tourCompleted: false },
};
const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY as string;
const STEP_KEY = process.env.NEXT_PUBLIC_STEP_KEY as string;
const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const totalSteps = 8;

  const [step, setStep] = useState<number>(() => {
    if (typeof window === "undefined") return 0;

    const savedStep = localStorage.getItem(STEP_KEY);
    return savedStep ? Number(savedStep) : 0;
  });

  const [formData, setFormData] = useState<SignupFormData>(() => {
    if (typeof window === "undefined") return defaultData;

    const savedForm = localStorage.getItem(STORAGE_KEY);
    if (!savedForm) return defaultData;

    const decrypted = decrypt(savedForm);
    if (!decrypted) return defaultData;

    return {
      ...defaultData,
      ...decrypted,
      step2: { ...decrypted.step2 },
    };
  });

  // Save whenever formData changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const safeData = {
      ...formData, // do NOT store password
    };

    const encrypted = encrypt(safeData);
    localStorage.setItem(STORAGE_KEY, encrypted);
  }, [formData]);

  // Save step separately
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STEP_KEY, step.toString());
  }, [step]);

  const updateStepData = <K extends keyof SignupFormData>(
    key: K,
    value: SignupFormData[K]
  ) => {
    console.log("value", value);

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
