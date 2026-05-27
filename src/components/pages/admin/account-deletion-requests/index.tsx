"use client";

import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

import { DataTable } from "@/components/ui/CommonTable";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import CustomPagination from "@/components/ui/CustromPagination";
import { Button } from "@/components/ui/button";
import { useGetAccountDeletionRequestsQuery } from "@/store/api/adminApi";

import { AccountDeletionRequestRow, columns } from "./Column";

const statusFilters = ["all", "requested", "processed"] as const;

const AccountDeletionRequests = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("all");

  const { data, isLoading, refetch, isFetching } = useGetAccountDeletionRequestsQuery({
    page,
    limit,
    status,
  });

  const rows = data?.data?.items || [];
  const totalPages = data?.data?.pagination?.totalPages || 0;

  const mappedRows: AccountDeletionRequestRow[] = useMemo(
    () =>
      rows.map((item) => ({
        _id: item._id,
        fullName: item.fullName,
        email: item.email,
        reason: item.reason,
        status: item.status,
        requestedAt: item.requestedAt,
        processedAt: item.processedAt,
        gateway: item.metadata?.gateway,
        plan: item.metadata?.plan,
      })),
    [rows],
  );

  const handleStatusChange = (nextStatus: (typeof statusFilters)[number]) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Deletion requests refreshed");
    } catch (error) {
      toast.error("Failed to refresh deletion requests");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Deletion Requests" />
        <CommonBreadcrump title="Deletion Requests" href="/account-deletion-requests" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((item) => (
              <Button
                key={item}
                type="button"
                variant={status === item ? "themeRegular" : "outline"}
                className={
                  status === item
                    ? "capitalize"
                    : "capitalize border-[#DCE5E0] text-[#494949] bg-white hover:bg-[#fbe6e6]"
                }
                onClick={() => handleStatusChange(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-[#DCE5E0] text-[#494949] bg-white hover:bg-[#fbe6e6]"
            onClick={handleRefresh}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="flex flex-col w-full pt-4 relative overflow-x-auto max-w-[897px] lg:max-w-full">
          {isLoading && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            </div>
          )}

          <DataTable
            columns={columns as ColumnDef<AccountDeletionRequestRow, unknown>[]}
            data={mappedRows}
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

export default AccountDeletionRequests;
