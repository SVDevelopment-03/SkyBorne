"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
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
import API from "@/lib/axios";

interface PlanRowData extends IPlanProduct {
  actions?: React.ReactNode;
}

const PlanManagement = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, refetch } = useGetPlanProductsQuery();
  const plans = data?.data || [];
  const totalPages = 1;

  const handleDeletePlan = async (planId: string, planKey: string) => {
    try {
      const resp = await API.delete(`/plans/${planId}`, {
        data: { planKey },
      });
      const json = resp?.data;
      if (json?.success) {
        toast.success(json.message || "Plan deleted successfully");
        setDeleteConfirmId(null);
        refetch();
      } else {
        toast.error(json?.message || "Failed to delete plan");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Delete request failed";
      toast.error(message);
      console.error("Delete error:", err?.response || err);
    }
  };

  const handleToggleStatus = async (plan: IPlanProduct) => {
    try {
      const currentStatus = (plan as any)?.isActive !== false;
      const newStatus = !currentStatus;
      
      const resp = await API.patch(`/plans/${plan._id}/status`, {
        isActive: newStatus,
      });
      const json = resp?.data;
      if (json?.success) {
        toast.success(
          `Plan ${newStatus ? "activated" : "deactivated"} successfully`
        );
        refetch();
      } else {
        toast.error(json?.message || "Failed to update status");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Status update failed";
      toast.error(message);
      console.error("Status update error:", err?.response || err);
    }
  };

  const columns: ColumnDef<PlanRowData>[] = [
    {
      accessorKey: "displayName",
      header: "Plan Name",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">
          {row.original.displayName || row.original.planKey}
        </span>
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
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = (row.original as any)?.isActive !== false;
        return (
          <button
            onClick={() => handleToggleStatus(row.original)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isActive
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="theme"
            size="sm"
            onClick={() => router.push(`/edit-plan-product/${row.original._id}`)}
            className="rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </Button>
          {deleteConfirmId === row.original._id ? (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleDeletePlan(row.original._id, row.original.planKey)
                }
                className="rounded-lg"
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-lg"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirmId(row.original._id)}
              className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
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
          <Button
            variant="outline"
            className="ml-2 rounded-[10px] py-3! w-full md:w-auto"
            onClick={async () => {
              try {
                const resp = await API.post("/admin/migrate-plans");
                const json = resp?.data;
                if (json?.success) {
                  toast.success(json.message || "Migration completed");
                } else {
                  toast.error(json?.message || "Migration failed");
                }
                refetch();
              } catch (err: any) {
                const message =
                  err?.response?.data?.message ||
                  err?.message ||
                  "Migration request failed";
                toast.error(message);
                console.error("Migration error:", err?.response || err);
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
