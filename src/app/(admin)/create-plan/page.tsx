"use client";

import React from "react";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import PlanForm from "@/components/pages/admin/plan-management/PlanForm";

export default function CreatePlanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Create Plan" />
        <CommonBreadcrump title="Create Plan" href="/create-plan" />
      </div>
      <PlanForm />
    </div>
  );
}
