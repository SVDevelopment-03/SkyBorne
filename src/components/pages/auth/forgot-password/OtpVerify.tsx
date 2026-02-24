/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useRef, useState } from "react";
import { ShieldIcon } from "@/icons/helpIcon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { EmailVerifyProps } from ".";

export interface OtpFormValues {
  otp: string;
}

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

const OtpVerify = ({ nextStep, prevStep, userEmail }: EmailVerifyProps) => {
  const initialValues: OtpFormValues = {
    otp: "",
  };

  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const resendLockRef = useRef(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

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
    if (!canResend || resendLockRef.current || isResending || !userEmail) return;

    try {
      resendLockRef.current = true;
      setCanResend(false);
      setTimer(30);
      await sendOtp({ email: userEmail }).unwrap();
      console.log("OTP resent successfully");
    } catch (err: any) {
      console.log("Resend OTP Error:", err?.data?.message || err.message);
      setCanResend(true);
      setTimer(0);
    } finally {
      resendLockRef.current = false;
    }
  };

  // VERIFY OTP HANDLER
  const handleSubmit = async (values: OtpFormValues) => {
    try {
      const res = await verifyOtp({
        email: userEmail,
        otp: values.otp,
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message ?? "Otp verified successfully");

        setTimeout(() => nextStep(), 500);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 h-full">
      <div className="flex flex-col gap-5">
        <Typography
          title="Keep Your Skyborne Account Secure"
          type="xxl"
          cssClass="leading-tight"
        />
        <Typography title="You can change preferences anytime." type="theme" />
      </div>
      <div className="bg-[#FFE8E8] border border-[#B95E82] p-3 sm:p-4 flex items-start gap-2 sm:gap-3 rounded-[10px]">
        <div className="p-2 bg-[#E1E1E1] w-8 h-8 rounded-full">
          <ShieldIcon />
        </div>
        <div className="flex flex-col justify-start gap-1">
          <Typography
            title={`OTP sent to ${userEmail}`}
            type="lgBlack"
            // cssClass="text-base!"
            cssClass="text-base! break-all max-w-full"
          />
          <Typography
            title="Change email"
            type="lgBlack"
            // onClick={() => setStep(2)}
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
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              {/* 2 Column Grid */}
              <div className="grid grid-cols-1">
                <div className="flex flex-col gap-6 sm:gap-8 pt-5 sm:pt-7.5 px-0">
                  <h2 className="font-arial font-normal text-xl text-[#0A0A0A]">
                    Enter OTP *
                  </h2>
                  <InputOTP
                    maxLength={6}
                    value={values?.otp}
                    autoComplete="one-time-code"
                    onChange={(val) => setFieldValue("otp", val)}
                  >
                    <InputOTPGroup className="flex items-center justify-between sm:justify-start gap-1 sm:gap-1.5 w-full max-w-[280px] sm:max-w-none">
                      {[0, 1, 2, 3, 4, 5]?.map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="bg-[#F3F3F5] border border-[#00000000] rounded-xl size-10 sm:size-14.5 text-base sm:text-lg font-satoshi-500"
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
                    <p className="font-satoshi-500 text-sm sm:text-lg font-normal leading-5 text-[#6A7282]">
                      Resend in 00:{timer < 10 && "0"} {timer}s
                    </p>
                  ) : (
                    <p className="font-satoshi-500 text-sm sm:text-lg font-normal leading-5 text-[#6A7282]">
                      {`Didn't receive it?`}
                      <button
                        type="button"
                        disabled={isResending}
                        className="font-satoshi-700 font-bold text-[#B95E82] pl-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={resendOtpHandler}
                      >
                        Resend code
                      </button>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-center gap-3 sm:gap-4 md:gap-5.5 pt-8 sm:pt-[57px]">
                <Button
                  variant={"outlineBlack"}
                  type="button"
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  onClick={prevStep}
                  disabled={isLoading || isResending}
                >
                  Back
                </Button>
                <Button
                  variant={"theme"}
                  type="submit"
                  disabled={isLoading || isResending}
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
    </div>
  );
};

export default OtpVerify;
