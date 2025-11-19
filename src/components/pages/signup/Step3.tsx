"use client";
import React from "react";
import { useSignup } from "./SignupContext";
import { Typography } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Input2 } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface OtpFormValues {
  phoneNumber: string;
}

const OtpSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(
      /^\+[1-9]\d{1,14}$/,
      "Enter a valid phone number start's with country code"
    )
    .required("Phone number is required"),
});

const Step3 = () => {
  const handleSubmit = (values: OtpFormValues) => {
    updateStepData("step3", { phoneNumber: values.phoneNumber });
    nextStep();
  };
  const { step, setStep, totalSteps, updateStepData, formData } = useSignup();

  const initialValues: OtpFormValues = {
    phoneNumber: formData?.step3?.phoneNumber || "",
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };
  return (
    <div className="flex flex-col gap-8 md:gap-14 h-full">
      <div className="flex flex-col gap-5">
        <Typography
          title="Keep Your Skyborne Account Secure"
          type="xxl"
          cssClass="leading-tight"
        />
        <Typography title="You can change preferences anytime." type="theme" />
      </div>
      <div className="form h-full overflow-auto [scrollbar-width:none]">
        <Formik
          initialValues={initialValues}
          validationSchema={OtpSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              {/* 2 Column Grid */}
              <div className="grid grid-cols-1">
                {/* First Name */}
                <div className="flex flex-col gap-[18px]">
                  <Label>Mobile Number*</Label>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <Input2
                        name="phoneNumber"
                        placeholder="+1 (555) 000-0000"
                        value={values?.phoneNumber}
                        onChange={(e) => {
                          let val = e.target.value;

                          // Allow "+" only at the start, remove everywhere else
                          val = val.replace(/[^\d+]/g, "");
                          if (val.indexOf("+") > 0)
                            val = val.replace(/\+/g, "");

                          handleChange({
                            target: { name: "phoneNumber", value: val },
                          });
                        }}
                        className="bg-[#F3F3F5] min-h-[55px]"
                      />
                      <Typography
                        title="We use your phone only for security, booking alerts, and important updates."
                        cssClass="text-[#6A7282]! my-4"
                        type="regular"
                      />
                      {touched?.phoneNumber && errors?.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {errors?.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
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
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Step3;
