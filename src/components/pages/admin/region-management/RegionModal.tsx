/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { Select } from "@/components/ui/Select2";
import { TimePicker } from "@/components/ui/TimePicker";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";

import {
  useCreateRegionMutation,
  useUpdateRegionMutation,
} from "@/store/api/regionApi";
import { IRegion } from "@/store/api/regionApi";
import ModalHeading from "@/components/ui/ModalHeading";

interface RegionModalProps {
  region?: IRegion;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Region name is required")
    .min(2, "Name must be at least 2 characters"),
  code: Yup.string()
    .required("Region code is required")
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must not exceed 10 characters"),
  timezone: Yup.string().optional(),
  replayTime: Yup.string().optional(),
});

// Common timezones list
const timezoneOptions = [
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
  { value: "America/New_York", label: "America/New_York (EST/EDT)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEDT)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
  { value: "America/Toronto", label: "America/Toronto (EST/EDT)" },
  { value: "Asia/Bangkok", label: "Asia/Bangkok (ICT)" },
  { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong (HKT)" },
  { value: "Australia/Melbourne", label: "Australia/Melbourne (AEDT)" },
  { value: "Asia/Bangkok", label: "Asia/Bangkok (ICT)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
  { value: "America/Mexico_City", label: "America/Mexico_City (CST/CDT)" },
];

export const RegionModal: React.FC<RegionModalProps> = ({
  region,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: region?.name || "",
    code: region?.code || "",
    timezone: region?.timezone || "",
  replayTime: region?.replayTime || "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        code: values.code.toUpperCase(),
        ...(values.timezone && { timezone: values.timezone }),
        ...(values.replayTime && { replayTime: values.replayTime }),
        status: "active" as const,
      };

      await onSubmit(payload);
      resetForm();
    } catch (error: any) {
      console.error("Error saving region:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6">
          {/* Header */}
          <div>
            <ModalHeading
              title={region ? "Edit Region" : "Create New Region"}
            />
          </div>

          {/* Form Fields Grid */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label>Region Name</Label>
              <Input2
                name="name"
                placeholder="e.g., Gulf Region"
                value={values.name}
                onChange={(e) => setFieldValue("name", e.target.value)}
                className="bg-[#F3F3F5] min-h-[55px] text-[#494949]"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Region Code */}
            <div className="flex flex-col gap-2">
              <Label>Region Code</Label>
              <Input2
                name="code"
                placeholder="e.g., GULF"
                value={values.code}
                onChange={(e) => setFieldValue("code", e.target.value)}
                className="bg-[#F3F3F5] min-h-[55px] text-[#494949]"
              />
              {errors.code && touched.code && (
                <p className="text-red-500 text-xs mt-1.5">{errors.code}</p>
              )}
            </div>

            {/* Timezone */}
            {/* <div className="flex flex-col gap-2">
              <Label>Timezone</Label>
              <Select
                value={values.timezone}
                onChange={(val) => setFieldValue("timezone", val)}
                options={timezoneOptions}
                placeholder="Select timezone..."
              />
              {errors.timezone && touched.timezone && (
                <p className="text-red-500 text-xs mt-1.5">{errors.timezone}</p>
              )}
            </div> */}

            {/* Replay Time */}
            {/* <div className="flex flex-col gap-2">
              <Label>Replay Time</Label>
              <TimePicker
                value={values.replayTime}
                onChange={(val) => setFieldValue("replayTime", val)}
              />
              {errors.replayTime && touched.replayTime && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.replayTime}
                </p>
              )}
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#e5e5e5]">
            <Button
              variant="outlineCancel"
              type="button"
              onClick={onCancel}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="theme"
              className="rounded-lg"
            >
              {isSubmitting
                ? region
                  ? "Updating..."
                  : "Creating..."
                : region
                ? "Update Region"
                : "Create Region"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
