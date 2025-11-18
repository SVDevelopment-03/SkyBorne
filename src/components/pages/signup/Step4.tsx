import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React from "react";
import { useSignup } from "./SignupContext";
import { ShieldIcon } from "@/icons/helpIcon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export interface OtpFormValues {
  phoneNumber: string;
}

const OtpSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^\+[1-9]\d{1,14}$/, "Enter a valid phone number")
    .required("Phone number is required"),
});

const Step4 = () => {
  const initialValues: OtpFormValues = {
    phoneNumber: "",
  };

  const handleSubmit = (values: OtpFormValues) => {
    console.log("Form Submitted:", values);
    nextStep();
  };
  const { step, setStep, totalSteps } = useSignup();

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
            title="OTP sent to unknown@gmail.com"
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
                  <InputOTP maxLength={6}>
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
                <div className="flex flex-col items-start pt-4">
                  <p className="font-satoshi-500   text-lg font-normal leading-5 text-[#6A7282]">
                    {`Didn't receive it?`}
                    <span className="font-satoshi-700 font-bold text-[#B95E82] pl-2">
                      Resend code
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 md:gap-5.5 pt-[57px]">
                <Button
                  variant={"outlineBlack"}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button
                  variant={"theme"}
                  onClick={nextStep}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                >
                  Next
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Step4;
