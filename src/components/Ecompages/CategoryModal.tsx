/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import ModalHeading from "@/components/ui/ModalHeading";
import { Input2 } from "@/components/ui/input";
import {
  useCreateEcomCategoryMutation,
  useUpdateEcomCategoryMutation,
  type EcomCategory,
} from "@/store/api/categoryApi";

interface CategoryModalProps {
  editingCategory?: EcomCategory | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters"),
  description: Yup.string().optional(),
});

export const CategoryModal = ({
  editingCategory,
  onCancel,
  onSuccess,
}: CategoryModalProps) => {
  const [createCategory, { isLoading: isCreating }] =
    useCreateEcomCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateEcomCategoryMutation();

  const isEditing = !!editingCategory;
  const isLoading = isCreating || isUpdating;

  const formik = useFormik({
    initialValues: {
      name: editingCategory?.name || "",
      description: editingCategory?.description || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing && editingCategory?._id) {
          await updateCategory({
            categoryId: editingCategory._id,
            body: {
              name: values.name.trim(),
              description: values.description.trim(),
            },
          }).unwrap();
          toast.success("Category updated successfully");
        } else {
          await createCategory({
            name: values.name.trim(),
            description: values.description.trim(),
          }).unwrap();
          toast.success("Category added successfully");
        }

        onSuccess();
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
        console.error("Error saving category:", error);
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <ModalHeading title={isEditing ? "Edit Category" : "Add New Category"} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label>Category Name*</Label>
          <Input2
            placeholder="Enter category name..."
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="name"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
          />
          {formik.touched.name && formik.errors.name && (
            <span className="text-sm text-red-500">{formik.errors.name}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Input2
            placeholder="Short description..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="description"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
          />
        </div>

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
              !formik.values.name ||
              (isEditing &&
                formik.values.name === editingCategory?.name &&
                formik.values.description === (editingCategory?.description || "") &&
                !formik.dirty)
            }
          >
            {isLoading
              ? "Processing..."
              : isEditing
                ? "Update Category"
                : "Add Category"}
          </Button>
        </div>
      </div>
    </div>
  );
};
