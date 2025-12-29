
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { DataTable } from "@/components/ui/CommonTable";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import { columns, UserRowData } from "./Column";
import { ColumnDef } from "@tanstack/react-table";
import { useGetUsersQuery, useUpdateUserStatusMutation } from "@/store/api/userApi";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useUpdateCountryStatusMutation } from "@/store/api/countryApi";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [updateStatus] = useUpdateUserStatusMutation();

  // Debounce search input
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSearch(search);
  //     setPage(1);
  //   }, 300);
  //   return () => clearTimeout(handler);
  // }, [search]);

  const { data, isLoading, refetch } = useGetUsersQuery({
    page,
    limit,
    search: search, // backend search
  });

  const users:any = data?.data || [];

  // Backend → UI mapping
  const mappedUsers: UserRowData[] = users.map((u: any) => ({
    _id: u._id,
    name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "N/A",
    email: u.email || "N/A",
    phone: u.phoneNumber || "N/A",
    country: u.country || "N/A",
    plan: u.plan || "N/A",
    status: u.isActive ? "active" : "inactive",
    createdAt:u.createdAt
  }));

  // ✅ Client-side search fallback for instant filtering
  // if (debouncedSearch) {
  //   const searchLower = debouncedSearch.toLowerCase();
  //   mappedUsers = mappedUsers.filter(
  //     (u) =>
  //       u.name.toLowerCase().includes(searchLower) ||
  //       u.email.toLowerCase().includes(searchLower)
  //   );
  // }

  const handleSearch = (value: string) => setSearch(value);

  const handleStatusToggle = async (
    userId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateStatus({
        userId,
        status: newStatus,
      }).unwrap();
      toast.success(`User status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="User Management" />
        <CommonBreadcrump title="User Management" href="/user-management" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Search */}
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input2
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] min-w-[260px] md:min-w-[450px] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>
          </div>

          <div />
        </div>

        {/* Table */}
        <div className="flex flex-col w-full pt-4 relative">
          {isLoading && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            </div>
          )}

          <DataTable
            columns={
              columns(handleStatusToggle) as ColumnDef<UserRowData, unknown>[]
            }
            data={mappedUsers}
            isLoadingData={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
