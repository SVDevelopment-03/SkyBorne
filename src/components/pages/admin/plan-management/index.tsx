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
import { SearchIcon } from "@/icons/helpIcon";
import { useDebounce } from "@/hooks/useDebounce";
import CustomPagination from "@/components/ui/CustromPagination";
import { useGetPlanProductsQuery, IPlanProduct } from "@/store/api/planProductApi";

interface PlanRowData extends IPlanProduct {
  actions?: React.ReactNode;
}

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
      accessorKey: "displayName",
      header: "Plan Name",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">{row.original.displayName || row.original.planKey}</span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span>${Number(row.original.price || 0)}</span>,
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
                const url = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")}/admin/migrate-plans`;
                const resp = await fetch(url, {
                  method: "POST",
                  credentials: "include",
                  headers: { "Accept": "application/json" },
                });

                const contentType = resp.headers.get("content-type") || "";
                if (contentType.includes("application/json")) {
                  const json = await resp.json();
                  if (json?.success) {
                    toast.success(json.message || "Migration completed");
                  } else {
                    toast.error(json?.message || "Migration failed");
                  }
                } else {
                  const text = await resp.text();
                  toast.error("Migration failed: unexpected response from server");
                  console.error("Migration non-JSON response:", text);
                }

                refetch();
              } catch (err: any) {
                toast.error(err?.message || "Migration request failed");
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
            isLoadingData={isLoading}
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
