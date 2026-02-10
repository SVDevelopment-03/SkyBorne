/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import countryList from "react-select-country-list";

import Select, { SingleValue } from "react-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  useCreateCountryMutation,
  useUpdateCountryMutation,
  CreateCountryRequest,
  ICountry,
  IRegion,
} from "@/store/api/countryApi";
import ModalHeading from "@/components/ui/ModalHeading";

/* =======================
   Types
======================= */

interface CountryOption {
  label: string;
  value: string;
}

interface RegionOption {
  label: string;
  value: string;
}

interface CountryModalProps {
  country?: ICountry;
  regions: IRegion[];
  onCancel: () => void;
  onSuccess: () => void;
}

/* =======================
   Validation
======================= */

const validationSchema = Yup.object({
  selectedCountry: Yup.string().required("Country is required"),
  region: Yup.string().nullable(),
});

/* =======================
   Component
======================= */

export const CountryModal = ({
  country,
  regions,
  onCancel,
  onSuccess,
}: CountryModalProps) => {
  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation();

  const isSubmitting = isCreating || isUpdating;

  // ✅ Correct country list
  const countryOptions: CountryOption[] = useMemo(
    () => countryList().getData(),
    []
  );

  // ✅ Region options with "No Region" option
  const regionOptions: RegionOption[] = useMemo(
    () => [
      { label: "No Region", value: "" },
      ...regions.map((r) => ({
        label: r.name,
        value: r._id,
      })),
    ],
    [regions]
  );

  // Get initial region value
  const getInitialRegion = (): string => {
    if (!country) return "";
    if (typeof country.region === "string") return country.region;
    if (typeof country.region === "object" && country.region) {
      return (country.region as IRegion)._id;
    }
    return "";
  };

  const formik = useFormik({
    initialValues: {
      selectedCountry: country?.code || "",
      region: getInitialRegion(),
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const selectedCountryObj = countryOptions.find(
          (opt) => opt.value === values.selectedCountry
        );

        if (!selectedCountryObj) {
          toast.error("Invalid country selection");
          return;
        }

        const payload: CreateCountryRequest = {
          name: selectedCountryObj.label,
          code: selectedCountryObj.value,
          region: values.region || null,
          status: "active",
        };

        if (country?._id) {
          // Update existing country
          await updateCountry({
            countryId: country._id,
            body: payload,
          }).unwrap();
          toast.success("Country updated successfully");
        } else {
          // Create new country
          await createCountry(payload).unwrap();
          toast.success("Country added successfully");
        }

        onSuccess();
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
        console.error("Error:", error);
      }
    },
  });

  // ✅ Correct select value mapping for country
  const selectedCountryOption: CountryOption | null = useMemo(
    () =>
      countryOptions.find(
        (opt) => opt.value === formik.values.selectedCountry
      ) || null,
    [formik.values.selectedCountry, countryOptions]
  );

  // ✅ Correct select value mapping for region
  const selectedRegionOption: RegionOption | null = useMemo(
    () =>
      regionOptions.find((opt) => opt.value === formik.values.region) || null,
    [formik.values.region, regionOptions]
  );

  return (
    <div className="flex flex-col gap-6">
      <ModalHeading
        title={country?._id ? "Edit Country" : "Add New Country"}
      />
      <div className="flex flex-col gap-6">
        {/* Country Select */}
        <div className="flex flex-col gap-2">
          <Label>Select Country*</Label>

          <Select<CountryOption, false>
            options={countryOptions}
            value={selectedCountryOption}
            onChange={(option: SingleValue<CountryOption>) => {
              if (option) {
                formik.setFieldValue("selectedCountry", option.value);
                formik.setFieldTouched("selectedCountry", true);
              }
            }}
            placeholder="Search and select a country..."
            isSearchable
            isDisabled={!!country?._id} // Disable country selection when editing
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "55px",
                backgroundColor: "#F3F3F5",
                borderColor: "#b95e82",
                boxShadow: "none",
                cursor: country?._id ? "not-allowed" : "pointer",
                opacity: country?._id ? 0.6 : 1,
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

        {/* Region Select */}
        <div className="flex flex-col gap-2">
          <Label>Region (Optional)</Label>

          <Select<RegionOption, false>
            options={regionOptions}
            value={selectedRegionOption}
            onChange={(option: SingleValue<RegionOption>) => {
              if (option) {
                formik.setFieldValue("region", option.value);
                formik.setFieldTouched("region", true);
              }
            }}
            placeholder="Select a region..."
            isSearchable
            isClearable
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "55px",
                backgroundColor: "#F3F3F5",
                borderColor: "#b95e82",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#b95e82",
                },
                ...(state.isFocused && {
                  borderColor: "#b95e82",
                }),
              }),
            }}
          />

          {formik.touched.region && formik.errors.region && (
            <span className="text-sm text-red-500">
              {formik.errors.region}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-[#E5E5E5]">
          <Button
            variant="outlineCancel"
            onClick={onCancel}
            type="button"
            disabled={isSubmitting}
            className="rounded-lg"
          >
            Cancel
          </Button>

          <Button
            onClick={() => formik.handleSubmit()}
            variant="theme"
            className="rounded-lg"
            disabled={isSubmitting || formik.isSubmitting || !formik.values.selectedCountry}
          >
            {isSubmitting
              ? "Processing..."
              : country?._id
              ? "Update Country"
              : "Add Country"}
          </Button>
        </div>
      </div>
    </div>
  );
};