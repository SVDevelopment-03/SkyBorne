"use client";
import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { EmailVerifyProps } from ".";

export interface PasswordFormValues {
  password: string;
  confirmPassword: string;
}

// ------------------ Yup Schema ------------------

const PasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, "Too short").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Required"),
});

const ResetPassword = ({ nextStep, prevStep, userEmail }: EmailVerifyProps) => {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const initialValues: PasswordFormValues = {
    password: "",
    confirmPassword: "",
  };

  return (
    <div className="flex flex-col gap-8 md:gap-14 h-full">
      <div className="flex flex-col gap-5">
        <Typography
          title="Reset Your Password"
          type="xxl"
          cssClass="leading-tight"
        />
      </div>

      <div className="form h-full overflow-auto [scrollbar-width:none]">
        <Formik
          initialValues={initialValues}
          validationSchema={PasswordSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await resetPassword({
                email: userEmail,
                newPassword: values.password,
              }).unwrap();

              toast.success("Password reset successfully.");
              router.push("/login");

              resetForm();
            } catch (error) {
              handleApiError(error);
            }
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form className="space-y-6">
              {/* Password */}
              <div className="flex flex-col gap-4.5">
                <Label>New Password*</Label>
                <div className="relative">
                  <Input2
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={values.password}
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
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-4.5">
                <Label>Confirm Password*</Label>
                <div className="relative">
                  <Input2
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    className="bg-[#F3F3F5] min-h-[55px]"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-4.5"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? (
                      <EyeOff size={22} className="text-[#B1B1B1]" />
                    ) : (
                      <Eye size={22} className="text-[#B1B1B1]" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex justify-start items-center gap-4 md:gap-5.5 mt-12">
                <Button
                  variant={"theme"}
                  disabled={isLoading}
                  type="submit"
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                >
                  <span className="flex flex-row gap-2 items-center">
                    {isLoading && (
                      <Loader2
                        size={24}
                        className="animate-spin text-white! h-6! w-6!"
                      />
                    )}
                    Reset Password
                  </span>
                </Button>

                <Button
                  variant={"outlineBlack"}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  onClick={() => router.push("/login")}
                  type="button"
                >
                  Login
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
