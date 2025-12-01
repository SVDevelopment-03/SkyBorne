"use client";
import React from "react";
import { useSignup } from "./SignupContext";
import { Typography } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { CommonSelect } from "@/components/ui/CountrySelect";

export interface UserinfoSchema {
  ageGroup: string;
  wellnessRole: string;
}

// ------------------ Yup Schema ------------------

const Step5Schema = Yup.object().shape({
  ageGroup: Yup.string().required("Please select an age group"),
  wellnessRole: Yup.string().required("Please select a wellness role"),
});

const Step5 = () => {
  const { step, setStep, totalSteps, formData, updateStepData } = useSignup();

  const initialValues: UserinfoSchema = {
    ageGroup: formData.step5.ageGroup || "",
    wellnessRole: formData.step5.wellnessRole || "",
  };

  const ageGroupOptions = [
    {
      label: "Under 18",
      value: "1",
    },
    {
      label: "18-24",
      value: "2",
    },
    {
      label: "25-34",
      value: "3",
    },
    {
      label: "35-44",
      value: "4",
    },
    {
      label: "45+",
      value: "5",
    },
  ];

  const wellnessRoleOption = [
    {
      label: "Just for myself",
      value: "1",
    },
    {
      label: "For my family",
      value: "2",
    },
    {
      label: "I'm a worker manager",
      value: "3",
    },
  ];

  const handleSubmit = (values: UserinfoSchema) => {
    // Save to context
    updateStepData("step5", values);

    nextStep();
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };
  return (
    <div className="flex flex-col gap-8 md:gap-14 h-full">
      <div className="flex flex-col gap-5">
        <Typography
          title="Tell us a Little About You"
          type="xxl"
          cssClass="leading-tight"
        />
      </div>
      <div className="form h-full overflow-auto [scrollbar-width:none]">
        <Formik
          initialValues={initialValues}
          validationSchema={Step5Schema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Age Group */}
              <CommonSelect
                options={ageGroupOptions}
                label="Age Group *"
                value={values?.ageGroup}
                onChange={(val) => setFieldValue("ageGroup", val)}
                error={errors?.ageGroup}
                touched={touched?.ageGroup}
              />

              {/* Wellness Role */}
              <CommonSelect
                options={wellnessRoleOption}
                label="Wellness Role *"
                value={values?.wellnessRole}
                onChange={(val) => setFieldValue("wellnessRole", val)}
                error={errors?.wellnessRole}
                touched={touched?.wellnessRole}
              />
              <div className="py-4">
                <div className="bg-[#FFE8E8] border border-[#B95E82] px-6 lg:px-15 py-5 lg:py-7.5 flex items-start gap-3 rounded-[10px]">
                  <Typography
                    title="We use age to suggest safe, relevant programs and personalize your experience."
                    type="lgBlack"
                    cssClass="text-sm! leading-normal md:text-base! lg:text-[22px]! md:leading-none!"
                  />
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 md:gap-5.5">
                <Button
                  variant={"outlineBlack"}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button
                  variant={"theme"}
                  className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
                  type="submit"
                >
                  Next
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default Step5;
