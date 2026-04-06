/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Input2 } from "@/components/ui/input";
import { DataTable } from "@/components/ui/CommonTable";
import { SearchIcon } from "@/icons/helpIcon";
import { useDebounce } from "@/hooks/useDebounce";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import { useGetProductInterestsQuery, type ProductInterest } from "@/store/api/productApi";

interface InterestRowData extends ProductInterest {
  actions?: React.ReactNode;
}

export function ProductInterests() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetProductInterestsQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const interests: InterestRowData[] = (data as any)?.data?.interests || [];

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  const columns: ColumnDef<InterestRowData>[] = [
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">
          {row.original.product?.name || "—"}
        </span>
      ),
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => (
        <span className="text-[#494949]">
          {`${row.original.user?.firstName || ""} ${row.original.user?.lastName || ""}`.trim() || "—"}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-[#494949]">
          {row.original.user?.email || "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-[#494949]">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Interested Users" />
        <CommonBreadcrump title="Interested Users" href="/interests" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Input2
              placeholder="Search by product or user..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              name="search"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            <SearchIcon />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <DataTable
            columns={columns as ColumnDef<InterestRowData, unknown>[]}
            data={interests}
            isLoadingData={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
