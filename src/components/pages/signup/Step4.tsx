/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useRef, useState } from "react";
import { useSignup } from "./SignupContext";
import { ShieldIcon } from "@/icons/helpIcon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import SuccessAlert from "@/utils/swal";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export interface OtpFormValues {
  otp: string;
}

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

const Step4 = () => {
  const initialValues: OtpFormValues = {
    otp: "",
  };
  const [showSuccess, setShowSuccess] = useState(false);
  const otpSentRef = useRef(false);

  const { step, setStep, totalSteps, updateStepData, formData } = useSignup();
  const userEmail = formData?.step2?.email;

  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    if (!otpSentRef?.current) {
      otpSentRef.current = true;
      sendOtp({ email: userEmail });
    }
  }, [userEmail, sendOtp]);

  useEffect(() => {
    if (!canResend && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  // RESEND OTP HANDLER
  const resendOtpHandler = async () => {
    try {
      setCanResend(false);
      setTimer(30);
      await sendOtp({ email: userEmail }).unwrap();
      console.log("OTP resent successfully");
    } catch (err: any) {
      console.log("Resend OTP Error:", err?.data?.message || err.message);
    }
  };

  // VERIFY OTP HANDLER
  const handleSubmit = async (values: OtpFormValues) => {
    try {
      const res = await verifyOtp({
        email: userEmail,
        otp: values.otp,
      }).unwrap();
      const { data } = res;
      if (res?.success) {
        console.log("OTP Verified:", res);
        toast.success(res?.message ?? "Otp verified successfully");
        updateStepData("step4", {
          otp: values.otp,
          tempUserId: data?.tempUserId,
        });

        setTimeout(() => nextStep(), 500);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "OTP verification failed");
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };
  return (
    <div className="flex flex-col gap-8 md:gap-8 h-full">
      <div className="flex flex-col gap-5">
        <Typography
          title="Keep Your Skyborne Account Secure"
          type="xxl"
          cssClass="leading-tight"
        />
        <Typography title="You can change preferences anytime." type="theme" />
      </div>
      <div className="bg-[#FFE8E8] border border-[#B95E82] p-4 flex items-start gap-3 rounded-[10px]">
        <div className="p-2 bg-[#E1E1E1] w-8 h-8 rounded-full">
          <ShieldIcon />
        </div>
        <div className="flex flex-col justify-start gap-1">
          <Typography
            title={`OTP sent to ${userEmail}`}
            type="lgBlack"
            cssClass="text-base!"
          />
          <Typography
            title="Change email"
            type="lgBlack"
            onClick={() => setStep(2)}
            cssClass="text-base! text-[#B95E82] cursor-pointer"
          />
        </div>
      </div>
      <div className="form size-full [scrollbar-width:none]">
        <Formik
          initialValues={initialValues}
          validationSchema={OtpSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              {/* 2 Column Grid */}
              <div className="grid grid-cols-1">
                <div className="flex flex-col gap-8 pt-7.5 px-0.5">
                  <h2 className="font-arial font-normal text-xl text-[#0A0A0A]">
                    Enter OTP *
                  </h2>
                  <InputOTP
                    maxLength={6}
                    value={values?.otp}
                    onChange={(val) => setFieldValue("otp", val)}
                  >
                    <InputOTPGroup className="flex items-center gap-1.5">
                      {[0, 1, 2, 3, 4, 5]?.map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="bg-[#F3F3F5] border border-[#00000000] rounded-xl size-14.5 text-lg font-satoshi-500"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {touched?.otp && errors?.otp && (
                  <p className="text-red-500 text-sm pt-4">{errors?.otp}</p>
                )}
                <div className="flex flex-col items-start pt-4">
                  {!canResend ? (
                    <p className="font-satoshi-500  text-lg font-normal leading-5 text-[#6A7282]">
                      Resend in 00:{timer < 10 && "0"} {timer}s
                    </p>
                  ) : (
                    <p className="font-satoshi-500  text-lg font-normal leading-5 text-[#6A7282]">
                      {`Didn't receive it?`}
                      <span
                        className="font-satoshi-700 font-bold text-[#B95E82] pl-2 cursor-pointer"
                        onClick={resendOtpHandler}
                      >
                        Resend code
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 md:gap-5.5 pt-[57px]">
                <Button
                  variant={"outlineBlack"}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  onClick={prevStep}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  variant={"theme"}
                  disabled={isLoading}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                >
                  <span className="flex flex-row gap-2 items-center">
                    {isLoading && (
                      <Loader2
                        size={24}
                        className="animate-spin text-white! h-6! w-6!"
                      />
                    )}
                    Verify & Continue
                  </span>
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {showSuccess && (
        <SuccessAlert
          message="You're verified and secure"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default Step4;
