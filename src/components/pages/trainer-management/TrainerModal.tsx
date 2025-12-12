// ============================================================================
// TrainerModal.tsx (Create/Edit Modal with Formik & Yup)
// ============================================================================
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input2 } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrainerData } from "./Column";
import { Label } from "@/components/ui/label";

interface TrainerModalProps {
  trainer?: TrainerData | null;
  onSubmit: (data: Partial<TrainerData>) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .required("Name is required"),
  experience: Yup.number()
    .min(0, "Experience cannot be negative")
    .max(70, "Experience cannot exceed 70 years")
    .typeError("Experience must be a number"),
});

export const TrainerModal = ({
  trainer,
  onSubmit,
  onCancel,
}: TrainerModalProps) => {
  const formik = useFormik({
    initialValues: {
      name: trainer?.name || "",
      experience: trainer?.experience || 0,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
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
    <div className="flex flex-col gap-4">
      <h2 className="text-[24px] font-bold font-satoshi-500">
        {trainer ? "Edit Trainer" : "Create New Trainer"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 pt-4">
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
            <span className="text-sm text-red-500">
              {getFieldError("name")}
            </span>
          )}
        </div>

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
            className="bg-[#F3F3F5] min-h-[55px] text-[#494949]"
          />
          {getFieldError("experience") && (
            <span className="text-sm text-red-500">
              {getFieldError("experience")}
            </span>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} className="rounded-lg">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="themeRegular"
            className="rounded-lg"
            disabled={formik.isSubmitting}
          >
            {trainer ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};
