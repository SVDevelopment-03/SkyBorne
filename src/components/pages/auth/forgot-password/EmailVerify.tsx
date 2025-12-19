"use client";
import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import { usePasswordResetRequestMutation } from "@/store/api/authApi";
import { Loader2 } from "lucide-react";
import { EmailVerifyProps } from ".";
import HomeIcon from "@/utils/homeIcon";

export interface EmailFormValues {
  email: string;
}

// ------------------ Yup Schema ------------------

const EmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const EmailVerify = ({
  nextStep,
  updateEmail,
  userEmail,
}: EmailVerifyProps) => {
  const router = useRouter();
  const [passwordResetRequest, { isLoading }] =
    usePasswordResetRequestMutation();

  const initialValues: EmailFormValues = {
    email: userEmail ?? "",
  };

  return (
    <div className="flex flex-col gap-8 md:gap-14 h-full">
      <div className="flex items-center justify-between">
        <Typography
          title="Welcome Back to Skyborne"
          type="xxl"
          cssClass="leading-tight"
        />
        <HomeIcon />
      </div>
      <div className="form h-full overflow-auto [scrollbar-width:none]">
        <Formik
          initialValues={initialValues}
          validationSchema={EmailSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await passwordResetRequest(values).unwrap();
              toast.success("Otp sent to your email.");
              if (updateEmail) updateEmail(values?.email);
              resetForm();
              nextStep();
            } catch (error) {
              handleApiError(error);
            }
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form className="space-y-6">
              {/* 2 Column Grid */}
              <div className="grid grid-cols-1 gap-10">
                {/* Email */}
                <div className="flex flex-col gap-4.5">
                  <Label>Email Address*</Label>
                  <Input2
                    name="email"
                    value={values?.email}
                    onChange={handleChange}
                    className="bg-[#F3F3F5] min-h-[55px]"
                    placeholder="Enter email to verify..."
                  />
                  {touched?.email && errors?.email && (
                    <p className="text-red-500 text-sm">{errors?.email}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-start items-center gap-4 md:gap-5.5 mt-12">
                <Button
                  variant={"outlineBlack"}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  onClick={() => router.push("/login")}
                  type="button"
                >
                  Login
                </Button>
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
                    Next
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

export default EmailVerify;
