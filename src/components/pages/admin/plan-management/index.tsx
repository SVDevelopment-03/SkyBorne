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
import { useGetPlanProductsQuery } from "@/store/api/planProductApi";

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
    return ["Yoga"];
  }
  if (normalizedName.includes("diamond")) {
    return ["Yoga"];
  }
  if (normalizedName.includes("platinum")) {
    return ["Yoga", "Specialty"];
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

  const { data, isLoading, refetch } = useGetPlanProductsQuery();
  const plans = data?.data || [];
  const totalPages = 1;

  // PlanProduct doesn't have an isActive toggle yet. Use backend upsert to modify entries.

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
      accessorKey: "billingType",
      header: "Billing",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.billingType || "-"}</span>
      ),
    },
    {
      accessorKey: "appleProductIds",
      header: "Apple SKUs",
      cell: ({ row }) => (
        <span>{(row.original.appleProductIds || []).length}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="theme"
          size="sm"
          onClick={() => router.push(`/edit-plan-product/${row.original._id}`)}
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
            onClick={() => router.push("/create-plan-product")}
          >
            Add Plan
          </Button>
          <Button
            variant="outline"
            className="ml-2 rounded-[10px] py-3! w-full md:w-auto"
            onClick={async () => {
              try {
                const resp = await fetch('/admin/migrate-plans', { method: 'POST' });
                const json = await resp.json();
                if (json?.success) {
                  toast.success(json.message || 'Migration completed');
                } else {
                  toast.error(json?.message || 'Migration failed');
                }
                refetch();
              } catch (err: any) {
                toast.error(err?.message || 'Migration request failed');
              }
            }}
          >
            Migrate Legacy Plans
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
