import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Checkbox } from "@/components/ui/checkbox";

import { AppleIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { GoogleIcon } from "@/icons/helpIcon";
import CountrySelect from "@/components/ui/CountrySelect";
import { useSignup } from "./SignupContext";

export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  agreeTerms: boolean;
}

// ------------------ Yup Schema ------------------

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Too short").required("Required"),
  country: Yup.string().required("Please select a country"),
  agreeTerms: Yup.boolean().oneOf([true], "You must agree before continuing"),
});

const Step2 = () => {
  const [showPass, setShowPass] = useState(false);
  const { step, setStep, totalSteps, formData, updateStepData } = useSignup();

  const initialValues: SignupFormValues = {
    firstName: formData.step2.firstName,
    lastName: formData.step2.lastName,
    email: formData.step2.email,
    password: "", // always empty (never stored)
    country: formData.step2.country,
    agreeTerms: formData.step2.agreeTerms,
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = (values: SignupFormValues) => {
    updateStepData("step2", {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: "", // NEVER store password
      country: values.country,
      agreeTerms: values.agreeTerms,
    });
    setStep(step + 1);
  };
  return (
    <div className="flex flex-col gap-8 md:gap-14 h-full">
      <div className="flex flex-col gap-5">
        <Typography
          title="Create Your Skyborne Account"
          type="xxl"
          cssClass="leading-tight"
        />
      </div>
      <div className="form h-full overflow-auto [scrollbar-width:none]">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form className="space-y-6">
              {/* 2 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* First Name */}
                <div className="flex flex-col gap-4.5">
                  <Label>First Name*</Label>
                  <Input2
                    name="firstName"
                    value={values?.firstName}
                    onChange={handleChange}
                    className="bg-[#F3F3F5] min-h-[55px]"
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-4.5">
                  <Label>Last Name*</Label>
                  <Input2
                    name="lastName"
                    value={values?.lastName}
                    onChange={handleChange}
                    className="bg-[#F3F3F5] min-h-[55px]"
                  />
                  {touched?.lastName && errors?.lastName && (
                    <p className="text-red-500 text-sm">{errors?.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-4.5">
                  <Label>Email Address*</Label>
                  <Input2
                    name="email"
                    value={values?.email}
                    onChange={handleChange}
                    className="bg-[#F3F3F5] min-h-[55px]"
                  />
                  {touched?.email && errors?.email && (
                    <p className="text-red-500 text-sm">{errors?.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-4.5">
                  <Label>Password*</Label>
                  <div className="relative">
                    <Input2
                      type={showPass ? "text" : "password"}
                      name="password"
                      value={values?.password}
                      onChange={handleChange}
                      className="bg-[#F3F3F5] min-h-[55px]"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-4.5"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? (
                        <EyeOff size={22} className="text-[#B1B1B1]" />
                      ) : (
                        <Eye size={22} className="text-[#B1B1B1]" />
                      )}
                    </button>
                  </div>
                  {touched?.password && errors?.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <CountrySelect
                value={values?.country}
                onChange={(val) => setFieldValue("country", val)}
                error={errors?.country}
                touched={touched?.country}
              />

              {/* Terms */}
              <div className="flex items-center gap-2 pt-[26px] leading-none">
                <Checkbox
                  checked={values.agreeTerms}
                  onCheckedChange={(val) => setFieldValue("agreeTerms", val)}
                  className="bg-[#F3F3F5] border-[0.8] border-[#0000001A]"
                />

                <p className="font-satoshi-500 font-medium text-base flex flex-wrap items-center">
                  {` I agree to Skyborne's`}{" "}
                  <Link
                    href="/terms"
                    className="text-[#B95E82] underline-offset-2 hover:underline ml-1"
                    target="_blank"
                  >
                    Terms
                  </Link>
                  <span className="mx-1">and</span>
                  <Link
                    href="/data-policy"
                    className="text-[#B95E82] underline-offset-2 hover:underline"
                    target="_blank"
                  >
                    Data Policy
                  </Link>
                </p>
              </div>
              {touched.agreeTerms && errors.agreeTerms && (
                <p className="text-red-500 text-sm">{errors.agreeTerms}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-[26px]">
                <Button
                  variant={"outlineBlackRect"}
                  className="py-[17px]! px-[123px]!"
                >
                  <GoogleIcon />
                  Sign up with Google
                </Button>
                <Button
                  variant={"outlineBlackRect"}
                  className="py-[17px]! px-[123px]!"
                >
                  <AppleIcon />
                  Sign up with Apple
                </Button>
              </div>
              <div className="flex flex-col items-center pb-4">
                <p className="font-satoshi-400 text-lg font-normal leading-5">
                  Already have an account?
                  <span className="font-satoshi-700 font-bold text-[#B95E82] pl-2">
                    Login
                  </span>
                </p>
              </div>
              <div className="flex justify-center items-center gap-4 md:gap-5.5">
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

export default Step2;
