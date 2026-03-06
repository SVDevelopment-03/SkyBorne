"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import MainListHeading from "@/components/ui/MainListHeading";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { DataTable } from "@/components/ui/CommonTable";
import CustomPagination from "@/components/ui/CustromPagination";
import { CommonSelect } from "@/components/ui/CountrySelect";
import { Badge } from "@/components/ui/badge";
import {
  MailLogRow,
  useGetMailLogsQuery,
} from "@/store/api/mailApi";

const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

const MailManagement = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "success" | "failed">("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isFetching } = useGetMailLogsQuery({
    page,
    limit,
    search,
    status,
  });

  const mailRows = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as "all" | "success" | "failed");
    setPage(1);
  };

  const columns: ColumnDef<MailLogRow>[] = [
    {
      accessorKey: "meetingTitle",
      header: "Meeting Title",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">
          {row.original.meetingTitle || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "meetingTime",
      header: "Meeting Time",
      cell: ({ row }) => (
        <span className="text-[#4B4B4B]">
          {formatDateTime(row.original.meetingTime)}
        </span>
      ),
    },
    {
      accessorKey: "sentAt",
      header: "Sent At",
      cell: ({ row }) => (
        <span className="text-[#4B4B4B]">{formatDateTime(row.original.sentAt)}</span>
      ),
    },
    {
      accessorKey: "totalUsers",
      header: "Total Users",
      cell: ({ row }) => (
        <span className="text-[#4B4B4B]">{row.original.totalUsers || 0}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "failed";
        const isSuccess = status === "success";

        return (
          <Badge
            className={`py-1! px-3! text-xs font-medium ${
              isSuccess ? "bg-[#27AE60]/10 text-[#27AE60]" : "bg-[#e74c3c]/10 text-[#e74c3c]"
            }`}
            style={{ borderRadius: "8px" }}
          >
            {isSuccess ? "Success" : "Failed"}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Reminder Management" />
        <CommonBreadcrump title="Reminder Management" href="/mail-management" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
          <div className="flex flex-wrap gap-4 w-full min-w-0">
            <div className="relative w-full sm:w-full md:w-[300px]">
              <Input2
                placeholder="Search by meeting title"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>

            <div className="w-full sm:w-[220px]">
              <CommonSelect
                label="Status"
                showLabel={false}
                options={statusOptions}
                cssProp="min-h-[45px]! w-full!"
                value={status}
                onChange={handleStatusChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full pt-4 relative overflow-x-auto max-w-[897px] lg:max-w-full">
          {(isLoading || isFetching) && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            </div>
          )}

          <DataTable columns={columns} data={mailRows} isLoadingData={isLoading} />
        </div>

        {totalPages > 1 && (
          <div className="relative w-full pt-4">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent md:hidden" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent md:hidden" />

            <div className="overflow-x-auto md:overflow-visible px-6">
              <div className="min-w-max md:min-w-0 flex justify-center">
                <CustomPagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  visiblePages={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailManagement;
