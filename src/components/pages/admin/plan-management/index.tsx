"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { DataTable } from "@/components/ui/CommonTable";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { Toggle2 } from "@/components/ui/Toggle2";
import { SearchIcon } from "@/icons/helpIcon";
import { useDebounce } from "@/hooks/useDebounce";
import CustomPagination from "@/components/ui/CustromPagination";
import {
  IAdminPlan,
  useGetAdminPlansQuery,
  useUpdatePlanStatusMutation,
} from "@/store/api/planApi";

interface PlanRowData extends IAdminPlan {
  actions?: React.ReactNode;
}

const resolveServices = (plan: IAdminPlan): string[] => {
  const services = Array.isArray(plan.services)
    ? plan.services.filter((service) => String(service || "").trim().length > 0)
    : [];

  if (services.length > 0) {
    return services;
  }

  const normalizedName = String(plan.name || "").toLowerCase().trim();

  if (normalizedName.includes("gold")) {
    return ["Yoga / Zumba (Based on selected option)"];
  }
  if (normalizedName.includes("diamond")) {
    return ["Yoga", "Zumba"];
  }
  if (normalizedName.includes("platinum")) {
    return ["Yoga", "Zumba", "Specialty"];
  }

  return ["-"];
};

const resolveClassCount = (plan: IAdminPlan): number => {
  const count = Number(plan.classCountPerMonth || 0);
  if (count > 0) {
    return count;
  }

  const normalizedName = String(plan.name || "").toLowerCase().trim();

  if (normalizedName.includes("gold")) return 2;
  if (normalizedName.includes("diamond")) return 4;
  if (normalizedName.includes("platinum")) return 5;

  return 0;
};

const PlanManagement = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, refetch } = useGetAdminPlansQuery({
    search: debouncedSearch,
    page,
    limit,
  });
  const [updatePlanStatus, { isLoading: isUpdatingStatus }] =
    useUpdatePlanStatusMutation();

  const plans = data?.data?.plans || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handleStatusToggle = async (planId: string, currentStatus: boolean) => {
    try {
      await updatePlanStatus({
        planId,
        isActive: !currentStatus,
      }).unwrap();
      toast.success("Plan status updated");
      refetch();
    } catch (error: unknown) {
      const message: string =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message ===
          "string"
          ? (error as { data?: { message?: string } }).data?.message ??
            "Failed to update plan status"
          : "Failed to update plan status";

      toast.error(message);
    }
  };

  const columns: ColumnDef<PlanRowData>[] = [
    {
      accessorKey: "name",
      header: "Plan Name",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span>${Number(row.original.price || 0)}</span>,
    },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => (
        <span className="capitalize">
          {resolveServices(row.original).join(", ")}
        </span>
      ),
    },
    {
      accessorKey: "classCountPerMonth",
      header: "Class Count",
      cell: ({ row }) => <span>{resolveClassCount(row.original)}</span>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Toggle2
            checked={row.original.isActive}
            onChange={() =>
              handleStatusToggle(row.original._id, row.original.isActive)
            }
          />
          <span
            className={`text-sm font-medium ${
              row.original.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="theme"
          size="sm"
          onClick={() => router.push(`/edit-plan/${row.original._id}`)}
          className="rounded-lg"
        >
          <Edit className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Plan Management" />
        <CommonBreadcrump title="Plan Management" href="/plans" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Input2
              placeholder="Search by plan name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              name="search"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            <SearchIcon />
          </div>
          <Button
            variant="themeRegular"
            className="rounded-[10px] py-3! w-full md:w-auto"
            onClick={() => router.push("/create-plan")}
          >
            Add Plan
          </Button>
        </div>

        <div className="flex flex-col w-full">
          <DataTable
            columns={columns as ColumnDef<PlanRowData, unknown>[]}
            data={plans as PlanRowData[]}
            isLoadingData={isLoading || isUpdatingStatus}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-4">
            <CustomPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
              visiblePages={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanManagement;
