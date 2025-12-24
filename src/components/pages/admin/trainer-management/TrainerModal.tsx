/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input2 } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/Select2";
import { Label } from "@/components/ui/label";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { TrainerApiData, TrainerData } from "@/store/api/trainerApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import ModalHeading from "@/components/ui/ModalHeading";
import { Eye, EyeOff } from "lucide-react";

type Options = { value: string; label: string };

interface TrainerModalProps {
  trainer?: TrainerData | null;
  onSubmit: (data: Partial<TrainerApiData & { password?: string }>) => Promise<void> | void;
  onCancel: () => void;
  services?: { _id: string; title: string }[];
  isLoading?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().test(
    "is-valid-phone",
    "Enter a valid phone number",
    (value) => {
      if (!value) return true;
      return isValidPhoneNumber(value);
    }
  ),
  experience: Yup.number()
    .min(0, "Experience cannot be negative")
    .max(70, "Experience cannot exceed 70 years")
    .typeError("Experience must be a number"),
  charges: Yup.number()
    .min(0, "Charges cannot be negative")
    .required("Charges per session is required"),
  specialization: Yup.string().required("Specialization is required"),
  password: Yup.string().when("isEdit", {
    is: false,
    then: (schema) =>
      schema
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .required("Password is required for new trainers"),
    otherwise: (schema) => schema.notRequired(),
  }),
  confirmPassword: Yup.string().when("isEdit", {
    is: false,
    then: (schema) =>
      schema
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const TrainerModal = ({
  trainer,
  onSubmit,
  onCancel,
  services = [],
  isLoading = false,
}: TrainerModalProps) => {
  const isEdit = !!trainer;

  const {
    data: serviceData,
    isLoading: serviceLoading,
    isError: serviceError,
  } = useGetServicesQuery(undefined);

  const [serviceOptions, setServiceOption] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!serviceLoading && Array.isArray(serviceData?.data)) {
      const formatted = serviceData?.data.map((item: any) => ({
        label: item.title || item.name,
        value: item._id,
      }));
      setTimeout(() => {
        setServiceOption(formatted);
      }, 0);
    }
  }, [serviceData?.data, serviceLoading]);

  const formik = useFormik({
    initialValues: {
      name: trainer?.name || "",
      email: trainer?.email || "",
      phoneNumber: trainer?.phoneNumber || "",
      specialization: trainer?.specialization?._id || "",
      experience: trainer?.experience || 0,
      charges: trainer?.charges || 0,
      password: "",
      confirmPassword: "",
      isEdit,
    },
    validationSchema,
    onSubmit: (values, {setSubmitting}) => {
      const submitData: Partial<TrainerApiData & { password?: string }> = {
        name: values.name,
        email: values.email,
        charges: values.charges,
        experience: values.experience,
        specialization: values?.specialization,
      };

      if (values.phoneNumber) {
        const parsed = parsePhoneNumber(values.phoneNumber);
        submitData.phoneNumber = parsed?.number || values.phoneNumber;
      }

      // Include password only for new trainer creation
      if (!isEdit && values.password) {
        submitData.password = values.password;
      }
      setSubmitting(false);

      onSubmit(submitData);
    },
    enableReinitialize: true,
  });

  const getFieldError = (fieldName: string) => {
    return formik.touched[fieldName as keyof typeof formik.touched] &&
      formik.errors[fieldName as keyof typeof formik.errors]
      ? formik.errors[fieldName as keyof typeof formik.errors]
      : null;
  };

  return (
    <div className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
      <ModalHeading title={isEdit ? "Edit Trainer" : "Create Trainer"} />

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 pt-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label>Name*</Label>
            <Input2
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter trainer name"
              className="bg-[#F3F3F5] min-h-[55px] text-[#494949]"
            />
            {getFieldError("name") && (
              <span className="text-sm text-red-500">{getFieldError("name")}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label>Email*</Label>
            <Input2
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter trainer email"
              className="bg-[#F3F3F5] min-h-[55px] text-[#494949]"
            />
            {getFieldError("email") && (
              <span className="text-sm text-red-500">
                {getFieldError("email")}
              </span>
            )}
          </div>

          {/* Phone Number with Country Code */}
          <div className="flex flex-col gap-2">
            <Label>Phone Number</Label>
            <div className="bg-[#F3F3F5] rounded-lg border border-[#E5E5E5] overflow-hidden">
              <PhoneInput
                international
                defaultCountry="AE"
                value={formik.values.phoneNumber}
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                className="bg-[#F3F3F5] min-h-[55px] rounded-[12.78px] border-0 py-4 px-5 font-satoshi-400 gap-2.5 [&_input]:outline-none [&_.PhoneInputCountrySelectArrow]:opacity-100! [&_.PhoneInputCountrySelectArrow]:text-[#494949]!"
              />
            </div>
            {getFieldError("phoneNumber") && (
              <span className="text-sm text-red-500">
                {getFieldError("phoneNumber")}
              </span>
            )}
          </div>

          {/* Specialization */}
          {!serviceLoading && serviceData?.data?.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Specialization*</Label>
              <Select
                value={formik.values.specialization as string}
                onChange={(val) => formik.setFieldValue("specialization", val)}
                options={serviceOptions || []}
                placeholder="Select specialization..."
                cssProp="min-h-[56px]"
              />
              {getFieldError("specialization") && (
                <span className="text-sm text-red-500">
                  {getFieldError("specialization")}
                </span>
              )}
            </div>
          )}

          {/* Experience */}
          <div className="flex flex-col gap-2">
            <Label>Experience (Years)</Label>
            <Input2
              name="experience"
              type="number"
              value={formik.values.experience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter years of experience"
              min="0"
              max="70"
              className="bg-[#F3F3F5] min-h-[55px] text-[#494949]"
            />
            {getFieldError("experience") && (
              <span className="text-sm text-red-500">
                {getFieldError("experience")}
              </span>
            )}
          </div>

          {/* Charges per Session */}
          <div className="flex flex-col gap-2">
            <Label>Charges per Session*</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#494949] font-satoshi-500">
                USD
              </span>
              <Input2
                name="charges"
                type="number"
                value={formik.values.charges}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0.00"
                min="0"
                step="1"
                className="bg-[#F3F3F5] min-h-[55px] text-[#494949] pl-14"
              />
            </div>
            {getFieldError("charges") && (
              <span className="text-sm text-red-500">
                {getFieldError("charges")}
              </span>
            )}
          </div>

          {/* Password - Only for New Trainers */}
          {!isEdit && (
            <div className="flex flex-col gap-2">
              <Label>Password*</Label>
              <div className="relative">
                <Input2
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter password (min 8 characters)"
                  className="bg-[#F3F3F5] min-h-[55px] text-[#494949] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
        
              {getFieldError("password") && (
                <span className="text-sm text-red-500">
                  {getFieldError("password")}
                </span>
              )}
            </div>
          )}

          {/* Confirm Password - Only for New Trainers */}
          {!isEdit && (
            <div className="flex flex-col gap-2">
              <Label>Confirm Password*</Label>
              <div className="relative">
                <Input2
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Confirm password"
                  className="bg-[#F3F3F5] min-h-[55px] text-[#494949] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {getFieldError("confirmPassword") && (
                <span className="text-sm text-red-500">
                  {getFieldError("confirmPassword")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-6 border-t border-[#E5E5E5]">
          <Button
            variant="outlineCancel"
            onClick={onCancel}
            type="button"
            className="rounded-lg"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="theme"
            className="rounded-lg"
            disabled={formik.isSubmitting || isLoading || !formik.isValid}
          >
            {isLoading
              ? "Processing..."
              : isEdit
              ? "Update Trainer"
              : "Create Trainer"}
          </Button>
        </div>
      </form>
    </div>
  );
};