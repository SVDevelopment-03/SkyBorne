/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import countryList from "react-select-country-list";

import Select, { SingleValue } from "react-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  useCreateCountryMutation,
  CreateCountryRequest,
} from "@/store/api/countryApi";
import ModalHeading from "@/components/ui/ModalHeading";

/* =======================
   Types
======================= */

interface CountryOption {
  label: string;
  value: string;
}

interface CountryModalProps {
  onCancel: () => void;
  onSuccess: () => void;
}

/* =======================
   Validation
======================= */

const validationSchema = Yup.object({
  selectedCountry: Yup.string().required("Country is required"),
});

/* =======================
   Component
======================= */

export const CountryModal = ({ onCancel, onSuccess }: CountryModalProps) => {
  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();

  // ✅ Correct country list
  const countryOptions: CountryOption[] = countryList().getData();

  const formik = useFormik({
    initialValues: {
      selectedCountry: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const selectedCountryObj = countryOptions.find(
          (opt) => opt.value === values.selectedCountry
        );

        if (!selectedCountryObj) {
          toast.error("Invalid country selection");
          return;
        }

        const createData: CreateCountryRequest = {
          name: selectedCountryObj.label,
          code: selectedCountryObj.value,
          status: "active",
        };

        await createCountry(createData).unwrap();
        toast.success("Country added successfully");
        onSuccess();
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
        console.error("Error creating country:", error);
      }
    },
  });

  // ✅ Correct select value mapping
  const selectedOption: CountryOption | null =
    countryOptions.find((opt) => opt.value === formik.values.selectedCountry) ||
    null;

  return (
    <div className="flex flex-col gap-6">
      <ModalHeading title="Add New Country"/>
      <div className="flex flex-col gap-6">
        {/* Country Select */}
        <div className="flex flex-col gap-2">
          <Label>Select Country*</Label>

          <Select<CountryOption, false>
            options={countryOptions}
            value={selectedOption}
            onChange={(option: SingleValue<CountryOption>) => {
              if (option) {
                formik.setFieldValue("selectedCountry", option.value);
                formik.setFieldTouched("selectedCountry", true);
              }
            }}
            placeholder="Search and select a country..."
            isSearchable
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "55px",
                backgroundColor: "#F3F3F5",
                borderColor: "#b95e82", // same border always
                boxShadow: "none", // ❗ remove blue glow
                "&:hover": {
                  borderColor: "#b95e82",
                },
                ...(state.isFocused && {
                  borderColor: "#b95e82",
                }),
              }),
            }}
          />

          {formik.touched.selectedCountry && formik.errors.selectedCountry && (
            <span className="text-sm text-red-500">
              {formik.errors.selectedCountry}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-[#E5E5E5]">
          <Button
            variant="outlineCancel"
            onClick={onCancel}
            type="button"
            disabled={isCreating}
            className="rounded-lg"
          >
            Cancel
          </Button>

          <Button
            onClick={() => formik.handleSubmit()}
            variant="theme"
            className="rounded-lg"
            disabled={
              isCreating ||
              formik.isSubmitting ||
              !formik.values.selectedCountry
            }
          >
            {isCreating ? "Processing..." : "Add Country"}
          </Button>
        </div>
      </div>
    </div>
  );
};
