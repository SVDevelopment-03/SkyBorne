"use client";
import React from "react";
import Heading from "../ui/heading";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreatConsultationMutation } from "@/store/api/publicApi";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

const consultationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{6,15}$/, "Enter a valid phone number")
    .required("Phone is required"),
  service: Yup.string().required("Please select a service"),
  message: Yup.string()
    .min(10, "Message should be at least 10 characters")
    .required("Message is required"),
});

const ConsultationForm = () => {
  const [creatConsultation, { isLoading, isSuccess, error }] =
    useCreatConsultationMutation();

  return (
    <div className="flex flex-col gap-7.5 md:gap-12 bg-[#FBEFD8] rounded-[30px] flex-1 h-full p-8 pt-9">
      <Heading
        title="Don’t know which direction to choose?"
        description="We support your journey ask us about Skyborne classes, membership, or wellness. Our team is ready to help you."
        cssClass="!items-start text-left"
        elemClass={{
          heading: "text-4xl max-w-[450px] text-[#494949]",
          paragraph: "!text-[#1D1D1DCC]/80",
        }}
      />
      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        }}
        validationSchema={consultationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await creatConsultation(values).unwrap();
            toast.success("Consultation form submitted");
            resetForm();
          } catch (error) {
            handleApiError(error);
          }
        }}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form className="flex flex-col gap-5 justify-center">
            <div className="grid grid-cols-2 items-center gap-x-5 gap-y-3 md:gap-[34px]">
              {/* Name */}
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={values.phone}
                  onChange={handleChange}
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Select Service */}
              <div>
                <Select
                  onValueChange={(value) => setFieldValue("service", value)}
                  value={values.service}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full min-h-[51px] h-9 bg-transparent text-lg shadow-xs outline-none border-0 border-b border-[rgba(0,0,0,0.52)] rounded-none",
                      "focus-visible:border-b-2 focus-visible:border-ring focus-visible:ring-0 [&>svg]:hidden text-black/50 px-0! font-arial"
                    )}
                  >
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="dance">Dance</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {touched.service && errors.service && (
                  <p className="text-red-500 text-sm mt-1">{errors.service}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <Textarea
                name="message"
                placeholder="Write the message"
                className="h-25"
                value={values.message}
                onChange={handleChange}
              />
              {touched.message && errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant={"outline"}
              className="w-fit md:max-w-[250px] md:mt-3"
            >
              Get Free Consultation
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ConsultationForm;
