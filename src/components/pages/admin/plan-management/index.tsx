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
import {
  useGetAdminPlansQuery,
  useUpdatePlanStatusMutation,
  useDeletePlanMutation,
  IAdminPlan,
} from "@/store/api/planApi";

interface PlanRowData extends IAdminPlan {
  actions?: React.ReactNode;
}

const PlanManagement = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, refetch } = useGetAdminPlansQuery({
    search: debouncedSearch,
    page,
    limit,
  });

  const [updateStatus, { isLoading: isStatusLoading }] = useUpdatePlanStatusMutation();
  const [deletePlan, { isLoading: isDeleteLoading }] = useDeletePlanMutation();

  const plans = data?.data?.plans || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handleStatusToggle = async (plan: IAdminPlan) => {
    try {
      const newStatus = !plan.isActive;
      await updateStatus({
        planId: plan._id,
        isActive: newStatus,
      }).unwrap();
      toast.success(
        `Plan ${newStatus ? "activated" : "deactivated"} successfully`
      );
      refetch();
    } catch (error: any) {
      const message = error?.data?.message || "Failed to update plan status";
      toast.error(message);
      console.error("Error updating status:", error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlan(planId).unwrap();
      toast.success("Plan deleted successfully");
      setDeleteConfirmId(null);
      refetch();
    } catch (error: any) {
      const message = error?.data?.message || "Failed to delete plan";
      toast.error(message);
      console.error("Error deleting plan:", error);
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
      accessorKey: "classCountPerMonth",
      header: "Classes/Month",
      cell: ({ row }) => (
        <span>{row.original.classCountPerMonth || 0}</span>
      ),
    },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => (
        <span className="text-sm">
          {(row.original.services || []).length} service(s)
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <button
          onClick={() => handleStatusToggle(row.original)}
          disabled={isStatusLoading}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            row.original.isActive
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="theme"
            size="sm"
            onClick={() => router.push(`/edit-plan/${row.original._id}`)}
            className="rounded-lg"
            disabled={isDeleteLoading}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {deleteConfirmId === row.original._id ? (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeletePlan(row.original._id)}
                disabled={isDeleteLoading}
                className="rounded-lg"
              >
                {isDeleteLoading ? "..." : "Confirm"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleteLoading}
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
              disabled={isDeleteLoading}
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
