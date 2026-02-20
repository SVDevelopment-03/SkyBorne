"use client";

import React from "react";
import { useParams } from "next/navigation";

import PlanForm from "@/components/pages/admin/plan-management/PlanForm";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import { useGetAdminPlanByIdQuery } from "@/store/api/planApi";

export default function EditPlanPage() {
  const params = useParams();
  const planId = params.id as string;

  const { data, isLoading } = useGetAdminPlanByIdQuery(planId, {
    skip: !planId,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Edit Plan" />
        <CommonBreadcrump title="Edit Plan" href={`/edit-plan/${planId}`} />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg p-6">Loading plan details...</div>
      ) : (
        <PlanForm initialPlan={data?.data ?? null} />
      )}
    </div>
  );
}
