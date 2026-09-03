"use client";

import React from "react";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import PlanProductForm from "@/components/pages/admin/plan-management/planproductform";
import { useParams } from "next/navigation";
import { useGetPlanProductsQuery, IPlanProduct } from "@/store/api/planProductApi";

export default function Page() {
  const params = useParams();
  const id = String(params?.id || "");
  const { data } = useGetPlanProductsQuery();
  const plans: IPlanProduct[] = data?.data || [];
  const plan = plans.find((p) => p._id === id) || null;

  return (
    <div className="p-6">
      <CommonBreadcrump title="Edit Plan" href={`/edit-plan-product/${id}`} />
      <div className="mt-6">
        <PlanProductForm initial={plan} />
      </div>
    </div>
  );
}
