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
import { useSignup } from "./SignupContext";
import { useGoogleLogin } from "@react-oauth/google";

import toast from "react-hot-toast";
import { round } from "lodash";
import { useRouter } from "next/navigation";
import HomeIcon from "@/utils/homeIcon";

export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

// ------------------ Yup Schema ------------------

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string()
    .notRequired()
    .min(2, "Last name atleast have 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /[A-Z]/,
      "Password must contain uppercase, lowercase, number, special character (@, $, !, %, *, ?, &)"
    )
    .matches(
      /[a-z]/,
      "Password must contain uppercase, lowercase, number, special character (@, $, !, %, *, ?, &)"
    )
    .matches(
      /\d/,
      "Password must contain uppercase, lowercase, number, special character (@, $, !, %, *, ?, &)"
    )
    .matches(
      /[@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, special character (@, $, !, %, *, ?, &)"
    ),
  agreeTerms: Yup.boolean().oneOf([true], "You must agree before continuing"),
});

const Step2 = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const { step, setStep, formData, updateStepData } = useSignup();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      // Fetch user info from Google
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      ).then((res) => res.json());

      console.log("Google User:", userInfo);

      // Extract needed data
      const googleData = {
        firstName: userInfo.given_name || "",
        lastName: userInfo.family_name || "",
        email: userInfo.email,
        picture: userInfo.picture,
        authProvider: "google",
        googleId: userInfo?.sub,
      };

      console.log("googleData:", googleData);

      // Save to Step2 in SignupContext
      updateStepData("step2", {
        firstName: googleData.firstName,
        lastName: googleData.lastName,
        email: googleData.email,
        password: "", // password not needed for social login
        agreeTerms: true,
        authProvider: "google",
        googleId: userInfo?.sub,
      });

      // Move to next step
      setStep(3); // or Step 4 based on your flow
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

  const initialValues: SignupFormValues = {
    firstName: formData.step2.firstName,
    lastName: formData.step2.lastName,
    email: formData.step2.email,
    password: formData.step2.password,
    agreeTerms: formData.step2.agreeTerms,
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (values: SignupFormValues) => {
    updateStepData("step2", {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values?.password,
      agreeTerms: values.agreeTerms,
      authProvider: "email",
      // googleId: formData?.step2?.googleId,
      // appleId: formData?.step2?.appleId,
    });

    setStep(step + 1);
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10 h-full">
      <div className="flex items-center justify-between">
        <Typography
          title="Create Your Skyborne Account"
          type="xxl"
          cssClass="leading-tight"
        />
        <HomeIcon />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3">
                  <Label>Last Name</Label>
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
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3">
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

              {/* Terms */}
              <div className="flex items-center gap-2 leading-none">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-[26px] pt-[20px]">
                <Button
                  variant={"outlineBlackRect"}
                  className="py-[17px]! px-[123px]!"
                  onClick={() => googleLogin()}
                  type="button"
                >
                  <GoogleIcon />
                  Sign up with Google
                </Button>
                <Button
                  variant={"outlineBlackRect"}
                  className="py-[17px]! px-[123px]!"
                  type="button"
                >
                  <AppleIcon />
                  Sign up with Apple
                </Button>
              </div>
              <div className="flex flex-col items-center pb-4">
                <p className="font-satoshi-400 text-lg font-normal leading-5">
                  Already have an account?
                  <span
                    className="font-satoshi-700 font-bold text-[#B95E82] pl-2 cursor-pointer"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </span>
                </p>
              </div>
              <div className="flex justify-center items-center gap-4 md:gap-5.5">
                <Button
                  variant={"outlineBlack"}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  onClick={prevStep}
                  type="button"
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
