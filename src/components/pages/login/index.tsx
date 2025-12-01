/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Typography } from "@/components/ui/heading";
import { Input2 } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Checkbox } from "@/components/ui/checkbox";
import { AppleIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { GoogleIcon } from "@/icons/helpIcon";
import { useGoogleLogin } from "@react-oauth/google";

import toast from "react-hot-toast";
import { useLoginMutation, useSocialLoginMutation } from "@/store/api/authApi";
import { storage } from "@/lib/storage";
import { setCredentials } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import HomeIcon from "@/utils/homeIcon";
import AppleSignInButton from "react-apple-signin-auth";
interface LoginError {
  data: { message: string };
}

export interface LoginFormValues {
  email: string;
  password: string;
  agreeTerms: boolean;
}

// ------------------ Yup Schema ------------------

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Too short").required("Required"),
  agreeTerms: Yup.boolean().oneOf([true], "You must agree before continuing"),
});

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const [socialLogin, { isLoading:isSocialLoading }] = useSocialLoginMutation();


const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const { access_token } = tokenResponse;

      const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      }).then((res) => res.json());

      console.log("user info", userInfo);
      

      const payload = {
        provider: "google",
        email: userInfo.email,
        googleId: userInfo.sub,
      };

      const res = await socialLogin(payload).unwrap();

      const { user, accessToken, refreshToken } = res.data;

      storage.set(process.env.NEXT_PUBLIC_USER as string, user);
      localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN as string, accessToken);
      localStorage.setItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN as string, refreshToken);

      dispatch(setCredentials({ user, accessToken, refreshToken }));

      toast.success("Logged in successfully!");
      router.push("/dashboard");

    } catch (err: any) {
      toast.error(err?.data?.message || "Google login failed");
    }
  },
  onError: () => toast.error("Google login failed"),
});


const handleAppleSuccess = async (response: any) => {
  try {
    const idToken = response.authorization.id_token;
    const decoded: any = JSON.parse(atob(idToken.split(".")[1]));

    const payload = {
      provider: "apple",
      email: decoded.email,  
      appleId: decoded.sub,
    };

    const res = await socialLogin(payload).unwrap();

    const { user, accessToken, refreshToken } = res.data;

    storage.set(process.env.NEXT_PUBLIC_USER as string, user);
    localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN as string, accessToken);
    localStorage.setItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN as string, refreshToken);

    dispatch(setCredentials({ user, accessToken, refreshToken }));

    toast.success("Logged in successfully!");
    router.push("/dashboard");

  } catch (err: any) {
    toast.error(err?.data?.message || "Apple login failed");
  }
};



  const initialValues = {
    email: "",
    password: "",
    agreeTerms: false,
  };

  const handleClick = () => {
    router.push("/forgot-password");
  };

  const prevStep = () => {};

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const res = await login(payload).unwrap();
      const { data } = res;

      const { user, accessToken, refreshToken } = data;
      if (res?.success) {
        storage.set(process.env.NEXT_PUBLIC_USER as string, user);
        localStorage.setItem(
          process.env.NEXT_PUBLIC_ACCESS_TOKEN as string,
          accessToken
        );
        localStorage.setItem(
          process.env.NEXT_PUBLIC_REFRESH_TOKEN as string,
          refreshToken
        );

        dispatch(
          setCredentials({ user: data?.user, accessToken, refreshToken })
        );
        toast.success(res?.message || "Login successful!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.log("RAW LOGIN ERROR:", err);

      const message =
        err?.data?.message ||
        err?.error?.data?.message ||
        err?.message ||
        "Failed to login";

      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-xl:px-6 py-6 max-w-[1080px] w-full h-dvh flex items-center justify-center overflow-y-auto [scrollbar-width:none]">
      <div className="bg-black/5 rounded-[30px] shadow max-h-[calc(100%-100px)]">
        <div className="bg-white rounded-[30px] px-5 md:px-13 py-6 md:py-12 h-full">
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
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, setFieldValue }) => (
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
                        />
                        {touched?.email && errors?.email && (
                          <p className="text-red-500 text-sm">
                            {errors?.email}
                          </p>
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
                          <Typography
                            title="Forgot password?"
                            type="baseTheme"
                            onClick={handleClick}
                            cssClass="leading-tight pt-4 absolute right-0 cursor-pointer"
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
                          <p className="text-red-500 text-sm">
                            {errors.password}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-center gap-2 pt-[26px] leading-none">
                      <Checkbox
                        checked={values.agreeTerms}
                        onCheckedChange={(val) =>
                          setFieldValue("agreeTerms", val)
                        }
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
                      <p className="text-red-500 text-sm">
                        {errors.agreeTerms}
                      </p>
                    )}

                    <div className="flex justify-start items-center pt-1.5 gap-4 md:gap-5.5">
                      <Button
                        variant={"theme"}
                        className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Loader2
                            size={24}
                            className="animate-spin text-white! h-6! w-6!"
                          />
                        )}
                        Login
                      </Button>
                      <Button
                        variant={"outlineBlack"}
                        type="button"
                        className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                        onClick={() => router.push("/signup")}
                      >
                        Signup
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-[26px] pt-12">
                      <Button
                        variant={"outlineBlackRect"}
                        className="py-[17px]! px-[123px]!"
                        onClick={() => googleLogin()}
                        type="button"
                      >
                        <GoogleIcon />
                        Sign in with Google
                      </Button>
                      <AppleSignInButton
                  uiType="dark"
                  authOptions={{
                    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID as string,
                    scope: "email name",
                    redirectURI: process.env
                      .NEXT_PUBLIC_APPLE_REDIRECT_URI as string,
                    usePopup: true,
                  }}
                  onSuccess={(response: any) => handleAppleSuccess(response)}
                  onError={() => toast.error("Apple signup failed")}
                  render={(props: any) => (
                    <Button
                      variant="outlineBlackRect"
                      className="py-[17px]! px-[123px]!"
                      {...props}
                    >
                      <AppleIcon />
                      Sign up with Apple
                    </Button>
                  )}
                />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
