"use client";
import React from "react";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import PlanProductForm from "@/components/pages/admin/plan-management/planproductform";

export default function Page() {
  return (
    <div className="p-6">
      <CommonBreadcrump title="Create Plan" href="/create-plan-product" />
      <div className="mt-6">
        <PlanProductForm />
      </div>
    </div>
  );
}
