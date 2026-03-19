"use client";
import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import { Country, State } from "country-state-city";
import { useSignup } from "./SignupContext";
import { Typography } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import HomeIcon from "@/utils/homeIcon";
import { CommonSelect, SelectOptionItem } from "@/components/ui/CountrySelect";
import { Input2 } from "@/components/ui/input";

export interface PhoneNumberFormValues {
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
}

const COUNTRY_OPTIONS: SelectOptionItem[] = Country.getAllCountries().map(
  (country) => ({
    label: country.name,
    value: country.isoCode,
  })
);

const getCountryCodeFromPhone = (phoneNumber: string): string => {
  if (!phoneNumber) return "";
  try {
    return parsePhoneNumber(phoneNumber)?.country || "";
  } catch {
    return "";
  }
};

const PhoneNumberSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .test("is-valid", "Enter a valid phone number", (value) =>
      value ? isValidPhoneNumber(value) : false
    ),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().trim().required("City is required"),
});

const Step3 = () => {
  const { step, setStep, totalSteps, updateStepData, formData } = useSignup();

  const handleSubmit = (values: PhoneNumberFormValues) => {
    const parsed = parsePhoneNumber(values.phoneNumber);

    updateStepData("step3", {
      phoneNumber: parsed?.number || values.phoneNumber,
      country: values.country,
      state: values.state,
      city: values.city.trim(),
    });
    nextStep();
  };

  const detectedCountryFromPhone = getCountryCodeFromPhone(
    formData.step3.phoneNumber || ""
  );

  const initialValues: PhoneNumberFormValues = {
    phoneNumber: formData.step3.phoneNumber || "",
    country: formData.step3.country || detectedCountryFromPhone || "",
    state: formData.step3.state || "",
    city: formData.step3.city || "",
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };
  return (
    <div className="flex flex-col gap-8 md:gap-14 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
        <div className="flex flex-col gap-5">
          <Typography
            title="Keep Your Skyborne Account Secure"
            type="xxl"
            cssClass="leading-tight text-lg sm:text-xl md:text-xxl"
          />
          <Typography
            title="You can change preferences anytime."
            type="theme"
          />
        </div>
        <HomeIcon />
      </div>
      <div className="form h-full overflow-auto [scrollbar-width:none]">
        <Formik
          initialValues={initialValues}
          validationSchema={PhoneNumberSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, handleChange }) => {
            const stateOptions: SelectOptionItem[] = values.country
              ? State.getStatesOfCountry(values.country).map((region) => ({
                  label: region.name,
                  value: region.name,
                }))
              : [];

            return (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-[18px]">
                    <Label>Mobile Number*</Label>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <PhoneInput
                          international
                          defaultCountry="AE"
                          country={values.country || undefined}
                          value={values.phoneNumber}
                          onChange={(value) => {
                            const nextPhone = value || "";
                            setFieldValue("phoneNumber", nextPhone);

                            const detectedCountry =
                              getCountryCodeFromPhone(nextPhone);
                            if (
                              detectedCountry &&
                              detectedCountry !== values.country
                            ) {
                              setFieldValue("country", detectedCountry);
                              setFieldValue("state", "");
                            }
                          }}
                          onCountryChange={(countryCode) => {
                            const nextCountry = countryCode || "";
                            setFieldValue("country", nextCountry);
                            if (nextCountry !== values.country) {
                              setFieldValue("state", "");
                            }
                          }}
                          className="bg-[#F3F3F5] min-h-[55px] rounded-[12.78px] border border-[#00000000] py-4 px-5 font-satoshi-400 gap-2.5 [&_input]:outline-none [&_.PhoneInputCountrySelectArrow]:opacity-100! [&_.PhoneInputCountrySelectArrow]:text-[#494949]!"
                        />
                        <Typography
                          title="We use your phone only for security, booking alerts, and important updates."
                          cssClass="text-[#6A7282]! mt-3 mb-2 sm:my-4"
                          type="regular"
                        />
                        {touched?.phoneNumber && errors?.phoneNumber && (
                          <p className="text-red-500 text-sm">
                            {errors?.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <CommonSelect
                    options={COUNTRY_OPTIONS}
                    label="Country *"
                    value={values.country}
                    onChange={(value) => {
                      setFieldValue("country", value);
                      if (value !== values.country) {
                        setFieldValue("state", "");
                      }
                    }}
                    error={errors.country}
                    touched={touched.country}
                  />

                  <CommonSelect
                    options={stateOptions}
                    label="State *"
                    value={values.state}
                    onChange={(value) => setFieldValue("state", value)}
                    error={errors.state}
                    touched={touched.state}
                  />

                  <div className="flex flex-col gap-3">
                    <Label>City *</Label>
                    <Input2
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      className="bg-[#F3F3F5] min-h-[55px]"
                    />
                    {touched.city && errors.city && (
                      <p className="text-red-500 text-sm">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-5.5 pt-10 sm:pt-[57px]">
                  <Button
                    variant={"outlineBlack"}
                    className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                    type="button"
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button
                    variant={"theme"}
                    className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Step3;
