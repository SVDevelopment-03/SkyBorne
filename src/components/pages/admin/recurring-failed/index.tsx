"use client";

import React, { useMemo, useState } from "react";
import MainListHeading from "@/components/ui/MainListHeading";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { CommonSelect } from "@/components/ui/CountrySelect";
import { DataTable } from "@/components/ui/CommonTable";
import CustomPagination from "@/components/ui/CustromPagination";
import { Loader } from "lucide-react";
import { useGetRecurringPaymentFailuresQuery } from "@/store/api/paymentApi";
import { useDebounce } from "@/hooks/useDebounce";
import { columns, RecurringFailureRow } from "./Column";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "processing", label: "Processing" },
  { value: "cancelled", label: "Cancelled" },
];

const RecurringFailedPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      status: status !== "all" ? (status as "processing" | "cancelled") : undefined,
    }),
    [debouncedSearch, status, page, limit]
  );

  const { data, isLoading, isFetching } = useGetRecurringPaymentFailuresQuery(queryParams);

  const failures: RecurringFailureRow[] = useMemo(
    () =>
      (data?.failures || []).map((failure, index) => ({
        _id: failure._id,
        serialNumber: (page - 1) * limit + index + 1,
        fullName: failure.fullName || "—",
        email: failure.email || "—",
        phoneNumber: failure.phoneNumber || "—",
        subscriptionId: failure.subscriptionId || "—",
        invoiceId: failure.invoiceId || "—",
        status: failure.status === "cancelled" ? "cancelled" : "processing",
        failedAt: failure.failedAt || null,
        createdAt: failure.createdAt || null,
      })),
    [data?.failures, page, limit]
  );

  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Recurring Failed" />
        <CommonBreadcrump title="Recurring Failed" href="/recurring-failed" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto flex-wrap">
            <div className="relative w-full sm:w-[260px] md:w-[340px]">
              <Input2
                placeholder="Search name, email, phone"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>

            {/* <div className="w-full sm:w-[220px]">
              <CommonSelect
                label="Status"
                showLabel={false}
                options={statusOptions}
                cssProp="min-h-[45px]! w-full!"
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              />
            </div> */}
          </div>
        </div>

        <div className="flex flex-col w-full pt-4 relative overflow-x-auto">
          {isFetching && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
            </div>
          )}

          <DataTable columns={columns} data={failures} isLoadingData={isLoading} />
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

export default RecurringFailedPage;
