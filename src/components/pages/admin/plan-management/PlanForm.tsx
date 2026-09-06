"use client";

import React, { useMemo, useState } from "react";
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
import {
  IPlanProduct,
  useUpsertPlanProductMutation,
} from "@/store/api/planProductApi";
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

interface PlanFormValues {
  name: string;
  planKey: string;
  description: string;
  services: string[];
  price: string;
  currency: string;
  billingType: "monthly" | "yearly";
  appleProductIds: string;
  stripePriceIds: string;
  serviceClassCounts: Record<string, string>;
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
    ? plan.services.filter((service) => String(service || "").trim().length > 0)
    : [];
  if (existingServices.length > 0) {
    return existingServices;
  }

  const planName = String(plan?.name || "").toLowerCase().trim();
  const yoga = resolveServiceByKeyword(serviceOptions, "yoga");
  const specialty = resolveServiceByKeyword(serviceOptions, "special");

  if (planName.includes("gold")) {
    return [yoga].filter((service): service is string => Boolean(service));
  }
  if (planName.includes("diamond")) {
    return [yoga].filter((service): service is string => Boolean(service));
  }
  if (planName.includes("platinum")) {
    return [yoga, specialty].filter(
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

const distributeCountByServices = (
  services: string[],
  totalCount: number,
): Record<string, string> => {
  if (!Array.isArray(services) || services.length === 0) {
    return {};
  }

  const validTotal = Math.max(0, Math.floor(Number(totalCount) || 0));
  const base = Math.floor(validTotal / services.length);
  let remainder = validTotal % services.length;

  const result: Record<string, string> = {};
  services.forEach((service) => {
    const value = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
    result[service] = String(value);
  });

  return result;
};

const buildInitialServiceClassCounts = (
  plan: IAdminPlan | null | undefined,
  services: string[],
): Record<string, string> => {
  const fromPlan = Array.isArray(plan?.serviceClassCounts)
    ? plan.serviceClassCounts
    : [];

  if (fromPlan.length > 0) {
    const map: Record<string, string> = {};
    services.forEach((service) => {
      const matched = fromPlan.find(
        (entry) =>
          String(entry.service || "").trim().toLowerCase() ===
          String(service || "").trim().toLowerCase(),
      );
      map[service] = String(Number(matched?.classCountPerMonth || 0));
    });
    return map;
  }

  return distributeCountByServices(services, resolveFallbackClassCount(plan));
};

const sumServiceCounts = (
  services: string[],
  serviceClassCounts: Record<string, string>,
): number =>
  services.reduce((sum, service) => {
    const count = Number(serviceClassCounts?.[service] ?? 0);
    return sum + (Number.isFinite(count) && count > 0 ? Math.floor(count) : 0);
  }, 0);

const formatServiceName = (value: string): string =>
  String(value || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const slugifyPlanKey = (value: string): string =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "plan";

const parseIdList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Plan name is required"),
  planKey: Yup.string().trim().required("Plan key is required"),
  services: Yup.array().of(Yup.string()).min(1, "Select at least one service"),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be less than 0")
    .required("Price is required"),
});

export default function PlanForm({ initialPlan }: PlanFormProps) {
  const router = useRouter();
  const [serviceCountError, setServiceCountError] = useState("");
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const [upsertPlanProduct, { isLoading: isSavingProduct }] =
    useUpsertPlanProductMutation();
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

  const initialServiceClassCounts = useMemo(
    () => buildInitialServiceClassCounts(initialPlan, initialServices),
    [initialPlan, initialServices],
  );

  const formik = useFormik<PlanFormValues>({
    initialValues: {
      name: initialPlan?.name || "",
      planKey:
        initialPlan?.name ? slugifyPlanKey(initialPlan.name) : "gold",
      description: initialPlan?.description || "",
      services: initialServices,
      price:
        initialPlan?.price !== undefined && initialPlan?.price !== null
          ? String(initialPlan.price)
          : "0",
      currency: "USD",
      billingType: "monthly",
      appleProductIds: "",
      stripePriceIds: "",
      serviceClassCounts: initialServiceClassCounts,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const normalizedServiceClassCounts = values.services.map((service) => {
          const classCount = Number(values.serviceClassCounts?.[service] ?? 0);
          return {
            service,
            classCountPerMonth: Number.isFinite(classCount)
              ? Math.max(0, Math.floor(classCount))
              : NaN,
          };
        });

        const hasInvalidClassCount = normalizedServiceClassCounts.some(
          (entry) => !Number.isFinite(entry.classCountPerMonth),
        );

        if (hasInvalidClassCount) {
          setServiceCountError(
            "Each selected service must have a valid class count/month",
          );
          return;
        }

        setServiceCountError("");

        const totalClassesPerMonth = normalizedServiceClassCounts.reduce(
          (sum, entry) => sum + entry.classCountPerMonth,
          0,
        );

        const payload: PlanPayload = {
          name: values.name.trim(),
          services: values.services,
          price: Number(values.price),
          description: values.description.trim(),
          serviceClassCounts: normalizedServiceClassCounts,
          classCountPerMonth: totalClassesPerMonth,
        };

        const planProductPayload: Partial<IPlanProduct> = {
          planKey: values.planKey.trim() || slugifyPlanKey(values.name),
          displayName: values.name.trim(),
          description: values.description.trim(),
          price: Number(values.price) || 0,
          currency: values.currency.trim().toUpperCase() || "USD",
          billingType: values.billingType,
          appleProductIds: parseIdList(values.appleProductIds),
          stripePriceIds: parseIdList(values.stripePriceIds),
        };

        let savedPlan: { _id?: string } | undefined;

        if (isEditMode && initialPlan?._id) {
          savedPlan = (
            await updatePlan({
              planId: initialPlan._id,
              body: payload,
            }).unwrap()
          )?.data;
          toast.success("Plan updated successfully");
        } else {
          savedPlan = (await createPlan(payload).unwrap())?.data;
          toast.success("Plan created successfully");
        }

        await upsertPlanProduct(planProductPayload).unwrap();
        toast.success("Plan product details saved");

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

  const isLoading = isCreating || isUpdating || isSavingProduct;
  const selectedServices = formik.values.services;
  const totalMonthlyClasses = useMemo(
    () => sumServiceCounts(selectedServices, formik.values.serviceClassCounts),
    [selectedServices, formik.values.serviceClassCounts],
  );

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
              onChange={(event) => {
                formik.handleChange(event);
                if (!event.target.value) return;
                formik.setFieldValue("planKey", slugifyPlanKey(event.target.value));
              }}
              onBlur={formik.handleBlur}
              placeholder="Enter plan name"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="planKey">Plan Key*</Label>
            <Input2
              id="planKey"
              name="planKey"
              value={formik.values.planKey}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="gold"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            {formik.touched.planKey && formik.errors.planKey && (
              <p className="text-sm text-red-600">{formik.errors.planKey}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Input2
              id="currency"
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
              placeholder="USD"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="billingType">Billing Type</Label>
            <select
              id="billingType"
              name="billingType"
              value={formik.values.billingType}
              onChange={formik.handleChange}
              className="bg-[#F2F0ED80] border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] rounded-[10px] px-3 py-3 text-base text-[#1F1F1F]"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="appleProductIds">Apple Product IDs</Label>
            <Input2
              id="appleProductIds"
              name="appleProductIds"
              value={formik.values.appleProductIds}
              onChange={formik.handleChange}
              placeholder="com.skyborne.gold.monthly"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stripePriceIds">Stripe Price IDs</Label>
          <Input2
            id="stripePriceIds"
            name="stripePriceIds"
            value={formik.values.stripePriceIds}
            onChange={formik.handleChange}
            placeholder="price_123, price_456"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Input2
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder="Plan description"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
          />
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

                      const nextServiceClassCounts = {
                        ...formik.values.serviceClassCounts,
                      };

                      if (shouldAdd) {
                        nextServiceClassCounts[serviceName] =
                          nextServiceClassCounts[serviceName] ?? "0";
                      } else {
                        delete nextServiceClassCounts[serviceName];
                      }

                      formik.setFieldValue("services", nextServices);
                      formik.setFieldValue(
                        "serviceClassCounts",
                        nextServiceClassCounts,
                      );
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-[10px] border border-[#E5E5E5] p-4">
              {selectedServices.map((service) => (
                <div key={service} className="flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#494949]">
                    <Check className="w-3.5 h-3.5 text-[#B95E82]" />
                    {formatServiceName(service)}
                  </span>
                  <div>
                    <Input2
                      type="number"
                      min={0}
                      value={formik.values.serviceClassCounts?.[service] ?? "0"}
                      onChange={(e) => {
                        setServiceCountError("");
                        formik.setFieldValue("serviceClassCounts", {
                          ...formik.values.serviceClassCounts,
                          [service]: e.target.value,
                        });
                      }}
                      placeholder="0"
                      className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pt-1.5 text-base! placeholder:text-[#929292]!"
                    />
                    <p className="mt-1 text-xs text-[#717182]">
                      {formatServiceName(service)} classes / month
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formik.touched.services && formik.errors.services && (
            <p className="text-sm text-red-600">{formik.errors.services}</p>
          )}
          {serviceCountError && (
            <p className="text-sm text-red-600">{serviceCountError}</p>
          )}
        </div>

        <div className="rounded-[10px] border border-[#E5E5E5] bg-[#FBFAF9] px-4 py-3">
          <p className="text-sm text-[#717182]">Total classes per month</p>
          <p className="text-xl font-semibold text-[#1A1A1A]">{totalMonthlyClasses}</p>
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
