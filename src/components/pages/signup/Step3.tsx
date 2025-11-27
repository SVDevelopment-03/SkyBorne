"use client";
import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import { useSignup } from "./SignupContext";
import { Typography } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";

export interface PhoneNumberFormValues {
  phoneNumber: string;
}

const PhoneNumberSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .test("is-valid", "Enter a valid phone number", (value) =>
      value ? isValidPhoneNumber(value) : false
    ),
});

const Step3 = () => {
  const handleSubmit = (values: PhoneNumberFormValues) => {
    const parsed = parsePhoneNumber(values?.phoneNumber);
    console.log("aaa", parsed);

    updateStepData("step3", { phoneNumber: parsed?.number as string });
    nextStep();
  };
  const { step, setStep, totalSteps, updateStepData, formData } = useSignup();

  const initialValues: PhoneNumberFormValues = {
    phoneNumber: formData?.step3?.phoneNumber || "",
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 2);
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
          validationSchema={PhoneNumberSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              {/* 2 Column Grid */}
              <div className="grid grid-cols-1">
                {/* First Name */}
                <div className="flex flex-col gap-[18px]">
                  <Label>Mobile Number*</Label>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <PhoneInput
                        international
                        defaultCountry="SA"
                        value={values.phoneNumber}
                        onChange={(value) =>
                          setFieldValue("phoneNumber", value)
                        }
                        className="bg-[#F3F3F5] min-h-[55px] rounded-[12.78px] border border-[#00000000] py-4 px-5 font-satoshi-400 gap-2.5 [&_input]:outline-none [&_.PhoneInputCountrySelectArrow]:opacity-100! [&_.PhoneInputCountrySelectArrow]:text-[#494949]!"
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
