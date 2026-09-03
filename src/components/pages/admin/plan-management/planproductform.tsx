"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IPlanProduct,
  useUpsertPlanProductMutation,
} from "@/store/api/planProductApi";

interface Props {
  initial?: IPlanProduct | null;
}

const validationSchema = Yup.object({
  planKey: Yup.string().required("Plan key is required"),
  displayName: Yup.string().required("Display name is required"),
  price: Yup.number().required("Price is required"),
});

export default function PlanProductForm({ initial }: Props) {
  const router = useRouter();
  const [upsert, { isLoading }] = useUpsertPlanProductMutation();

  const formik = useFormik({
    initialValues: {
      planKey: initial?.planKey || "",
      displayName: initial?.displayName || "",
      description: initial?.description || "",
      price: initial?.price ?? 0,
      currency: initial?.currency || "USD",
      billingType: initial?.billingType || "monthly",
      appleProductIds: (initial?.appleProductIds || []).join(", "),
      stripePriceIds: (initial?.stripePriceIds || []).join(", "),
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload: Partial<IPlanProduct> = {
          planKey: values.planKey.trim(),
          displayName: values.displayName.trim(),
          description: values.description.trim(),
          price: Number(values.price) || 0,
          currency: values.currency.trim().toUpperCase() || "USD",
          billingType: values.billingType as "monthly" | "yearly",
          appleProductIds: values.appleProductIds
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
          stripePriceIds: values.stripePriceIds
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
        };

        await upsert(payload).unwrap();
        toast.success("Plan saved");
        router.push("/plans");
      } catch (err: any) {
        toast.error(err?.message || "Failed to save plan");
      }
    },
  });

  return (
    <div className="bg-white rounded-lg p-6 md:p-8">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Plan Key*</Label>
            <Input2
              name="planKey"
              value={formik.values.planKey}
              onChange={formik.handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Display Name*</Label>
            <Input2
              name="displayName"
              value={formik.values.displayName}
              onChange={formik.handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Price</Label>
            <Input2 name="price" value={formik.values.price} onChange={formik.handleChange} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Currency</Label>
            <Input2 name="currency" value={formik.values.currency} onChange={formik.handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Billing Type</Label>
            <select name="billingType" value={formik.values.billingType} onChange={formik.handleChange} className="h-11 rounded-[10px] border px-3">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Apple Product IDs (comma separated)</Label>
            <Input2 name="appleProductIds" value={formik.values.appleProductIds} onChange={formik.handleChange} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Stripe Price IDs (comma separated)</Label>
          <Input2 name="stripePriceIds" value={formik.values.stripePriceIds} onChange={formik.handleChange} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Input2 name="description" value={formik.values.description} onChange={formik.handleChange} />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outlineCancel" onClick={() => router.push('/plans')} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="theme" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </div>
  );
}
