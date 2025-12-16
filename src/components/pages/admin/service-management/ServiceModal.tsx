/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  CreateServiceRequest,
  IService,
} from "@/store/api/serviceApi";
import ModalHeading from "@/components/ui/ModalHeading";
import { Input2 } from "@/components/ui/input";

/* =======================
   Types
======================= */

interface ServiceModalProps {
  editingService?: IService | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/* =======================
   Validation
======================= */

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Service name is required")
    .min(2, "Service name must be at least 2 characters"),
});

/* =======================
   Component
======================= */

export const ServiceModal = ({
  editingService,
  onCancel,
  onSuccess,
}: ServiceModalProps) => {
  const [createService, { isLoading: isCreating }] =
    useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] =
    useUpdateServiceMutation();

  const isEditing = !!editingService;
  const isLoading = isCreating || isUpdating;

  const formik = useFormik({
    initialValues: {
      title: editingService?.title || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing && editingService?._id) {
          // Update existing service
          await updateService({
            serviceId: editingService._id,
            title: values.title.trim(),
          }).unwrap();
          toast.success("Service updated successfully");
        } else {
          // Create new service
          const payload: CreateServiceRequest = {
            title: values.title.trim(),
          };
          await createService(payload).unwrap();
          toast.success("Service added successfully");
        }
        onSuccess();
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
        console.error("Error saving service:", error);
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <ModalHeading
        title={isEditing ? "Edit Service" : "Add New Service"}
      />

      <div className="flex flex-col gap-6">
        {/* Service Name Input */}
        <div className="flex flex-col gap-2">
          <Label>Service Name*</Label>

          <Input2
            placeholder="Enter service name..."
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="title"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
          />

          {formik.touched.title && formik.errors.title && (
            <span className="text-sm text-red-500">{formik.errors.title}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-[#E5E5E5]">
          <Button
            variant="outlineCancel"
            onClick={onCancel}
            type="button"
            disabled={isLoading}
            className="rounded-lg"
          >
            Cancel
          </Button>

          <Button
            onClick={() => formik.handleSubmit()}
            variant="theme"
            className="rounded-lg"
            disabled={
              isLoading ||
              formik.isSubmitting ||
              !formik.values.title ||
              (isEditing &&
                formik.values.title === editingService?.title &&
                !formik.dirty)
            }
          >
            {isLoading
              ? "Processing..."
              : isEditing
                ? "Update Service"
                : "Add Service"}
          </Button>
        </div>
      </div>
    </div>
  );
};