"use client";

import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IAdminPlan,
  PlanPayload,
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from "@/store/api/planApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlanFormProps {
  initialPlan?: IAdminPlan | null;
}

const resolveServiceByKeyword = (
  serviceOptions: string[],
  keyword: "yoga" | "zumba" | "special",
): string | null => {
  const match = serviceOptions.find((service) =>
    String(service).toLowerCase().includes(keyword),
  );
  return match || null;
};

const resolveFallbackServices = (
  plan: IAdminPlan | null | undefined,
  serviceOptions: string[],
): string[] => {
  const existingServices = Array.isArray(plan?.services)
    ? plan!.services.filter((service) => String(service || "").trim().length > 0)
    : [];
  if (existingServices.length > 0) {
    return existingServices;
  }

  const planName = String(plan?.name || "").toLowerCase().trim();
  const yoga = resolveServiceByKeyword(serviceOptions, "yoga");
  const zumba = resolveServiceByKeyword(serviceOptions, "zumba");
  const specialty = resolveServiceByKeyword(serviceOptions, "special");

  if (planName.includes("gold")) {
    return [yoga, zumba].filter((service): service is string => Boolean(service));
  }
  if (planName.includes("diamond")) {
    return [yoga, zumba].filter((service): service is string => Boolean(service));
  }
  if (planName.includes("platinum")) {
    return [yoga, zumba, specialty].filter(
      (service): service is string => Boolean(service),
    );
  }

  return [];
};

const resolveFallbackClassCount = (plan: IAdminPlan | null | undefined): number => {
  const rawCount = Number(plan?.classCountPerMonth || 0);
  if (rawCount > 0) {
    return rawCount;
  }

  const planName = String(plan?.name || "").toLowerCase().trim();
  if (planName.includes("gold")) return 2;
  if (planName.includes("diamond")) return 4;
  if (planName.includes("platinum")) return 5;

  return 0;
};

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Plan name is required"),
  services: Yup.array().of(Yup.string()).min(1, "Select at least one service"),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be less than 0")
    .required("Price is required"),
  classCountPerMonth: Yup.number()
    .typeError("Class count/month must be a number")
    .min(0, "Class count/month cannot be less than 0")
    .required("Class count/month is required"),
});

export default function PlanForm({ initialPlan }: PlanFormProps) {
  const router = useRouter();
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const { data: serviceData, isLoading: isServicesLoading } =
    useGetServicesQuery(undefined);
  const isEditMode = !!initialPlan?._id;
  const serviceOptions: string[] = (
    (serviceData?.data || []) as Array<{ title?: string }>
  )
    .filter((service: { title?: string }) => service?.title)
    .map((service: { title?: string }) => String(service.title).trim());

  const initialServices = useMemo(
    () => resolveFallbackServices(initialPlan, serviceOptions),
    [initialPlan, serviceOptions],
  );

  const initialClassCount = useMemo(
    () => resolveFallbackClassCount(initialPlan),
    [initialPlan],
  );

  const formik = useFormik({
    initialValues: {
      name: initialPlan?.name || "",
      services: initialServices,
      price:
        initialPlan?.price !== undefined && initialPlan?.price !== null
          ? String(initialPlan.price)
          : "0",
      classCountPerMonth: String(initialClassCount),
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload: PlanPayload = {
          name: values.name.trim(),
          services: values.services,
          price: Number(values.price),
          classCountPerMonth: Number(values.classCountPerMonth),
        };

        if (isEditMode && initialPlan?._id) {
          await updatePlan({
            planId: initialPlan._id,
            body: payload,
          }).unwrap();
          toast.success("Plan updated successfully");
        } else {
          await createPlan(payload).unwrap();
          toast.success("Plan created successfully");
        }

        router.push("/plans");
      } catch (error: unknown) {
        const message: string =
          typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof (error as { data?: { message?: string } }).data?.message ===
            "string"
            ? (error as { data?: { message?: string } }).data?.message ??
              "Failed to save plan"
            : "Failed to save plan";

        toast.error(message);
      }
    },
  });

  const isLoading = isCreating || isUpdating;
  const selectedServices = formik.values.services;

  return (
    <div className="bg-white rounded-lg p-6 md:p-8">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Plan Name*</Label>
            <Input2
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter plan name"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price*</Label>
            <Input2
              id="price"
              type="number"
              min={0}
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-sm text-red-600">{formik.errors.price}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="classCountPerMonth">Class Count/Month*</Label>
            <Input2
              id="classCountPerMonth"
              type="number"
              min={0}
              name="classCountPerMonth"
              value={formik.values.classCountPerMonth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            {formik.touched.classCountPerMonth &&
              formik.errors.classCountPerMonth && (
                <p className="text-sm text-red-600">
                  {formik.errors.classCountPerMonth}
                </p>
              )}
          </div>

          <div className="flex flex-col gap-3">
            <Label>Services*</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full bg-[#F2F0ED80] border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] rounded-[10px] px-4 py-3 text-left text-[#494949] flex items-center justify-between"
                >
                  <span className="truncate">
                    {selectedServices.length > 0
                      ? selectedServices.join(", ")
                      : isServicesLoading
                        ? "Loading services..."
                        : "Select services"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#717182]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-72 overflow-y-auto">
                {serviceOptions.length > 0 ? (
                  serviceOptions.map((serviceName) => (
                    <DropdownMenuItem
                      key={serviceName}
                      className="flex items-center gap-2 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                      onClick={() => {
                        const shouldAdd = !selectedServices.includes(serviceName);
                        const nextServices = shouldAdd
                          ? Array.from(new Set([...selectedServices, serviceName]))
                          : selectedServices.filter(
                              (service) => service !== serviceName,
                            );
                        formik.setFieldValue("services", nextServices);
                      }}
                    >
                      <Checkbox
                        checked={selectedServices.includes(serviceName)}
                        className="data-[state=checked]:bg-[#B95E82] data-[state=checked]:border-[#B95E82]"
                      />
                      {serviceName}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-[#717182]">
                    No services found
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedServices.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FFE8E8] text-[#B95E82] px-3 py-1 text-xs font-medium"
                  >
                    <Check className="w-3 h-3" />
                    {service}
                  </span>
                ))}
              </div>
            )}
            {formik.touched.services && formik.errors.services && (
              <p className="text-sm text-red-600">{formik.errors.services}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
          <Button
            type="button"
            variant="outlineCancel"
            className="rounded-lg"
            onClick={() => router.push("/plans")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="theme"
            className="rounded-lg"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update Plan"
                : "Create Plan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
