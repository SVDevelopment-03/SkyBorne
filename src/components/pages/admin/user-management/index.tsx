/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { DataTable } from "@/components/ui/CommonTable";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import { columns, UserRowData } from "./Column";
import { ColumnDef } from "@tanstack/react-table";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useExportUsersCSVMutation,
  ExportUsersParams,
} from "@/store/api/userApi";
import toast from "react-hot-toast";
import { Loader, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommonSelect } from "@/components/ui/CountrySelect";
import CustomPagination from "@/components/ui/CustromPagination";
import countryList from "react-select-country-list";
import { State } from "country-state-city";

export interface DisplayUser extends UserRowData {
  countryCode?: string;
}

const planOptions = [
  { value: "all", label: "All Plans" },
  { value: "gold-yoga", label: "Gold Yoga" },
  { value: "gold-zumba", label: "Gold Zumba" },
  { value: "gold-mixed", label: "Gold Mixed" },
  { value: "diamond", label: "Diamond" },
  { value: "platinum", label: "Platinum" },
];

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [updateStatus] = useUpdateUserStatusMutation();
  const [exportCSV, { isLoading: isExporting }] = useExportUsersCSVMutation();
  const [filterPlan, setFilterPlan] = useState("all");

  // Get country options
  const countryOptions = useMemo(() => {
    const countries = countryList().getData();
    return [
      { value: "all", label: "All Countries" },
      ...countries.map((c) => ({
        value: c.value.toUpperCase(),
        label: c.label,
      })),
    ];
  }, []);

  const handlePlanFilter = (value: string) => {
    setFilterPlan(value);
    setPage(1);
  };

  const { data, isLoading, isFetching, refetch } = useGetUsersQuery({
    page,
    limit,
    search: search,
    country: filterCountry !== "all" ? filterCountry : undefined,
    state: filterState !== "all" ? filterState : undefined,
    plan: filterPlan !== "all" ? filterPlan : undefined,
  });
  const users: any[] = useMemo(() => data?.data?.users || [], [data]);
  const pagination :any= data?.data?.pagination || {};

  const stateOptions = useMemo(() => {
    const uniqueStates = new Set<string>();

    if (filterCountry !== "all") {
      const countryStates = State.getStatesOfCountry(filterCountry.toUpperCase());
      countryStates.forEach((item) => {
        const stateName = String(item?.name || "").trim();
        if (stateName) uniqueStates.add(stateName);
      });
    } else {
      users.forEach((user: any) => {
        const stateName = String(user?.state || user?.address?.state || "").trim();
        if (stateName) uniqueStates.add(stateName);
      });
    }

    return [
      { value: "all", label: "All States" },
      ...Array.from(uniqueStates)
        .sort((a, b) => a.localeCompare(b))
        .map((stateName) => ({ value: stateName, label: stateName })),
    ];
  }, [filterCountry, users]);

  // Backend → UI mapping with country code
  const mappedUsers: DisplayUser[] = users.map((u: any) => ({
    _id: u._id,
    name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "N/A",
    email: u.email || "N/A",
    phone: u.phoneNumber || "N/A",
    country: u.country || "N/A",
    state: u.state || u?.address?.state || "N/A",
    city: u.city || u?.address?.city || "N/A",
    countryCode: u.countryCode || "N/A",
    plan: u.plan || "N/A",
    subscriptionStatus:
      u?.subscription?.status || u?.subscriptionStatus || "N/A",
    status: u.isActive ? "active" : "inactive",
    createdAt: u.createdAt,
  }));

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCountryFilter = (value: string) => {
    setFilterCountry(value);
    setFilterState("all");
    setPage(1);
  };

  const handleStateFilter = (value: string) => {
    setFilterState(value);
    setPage(1);
  };

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
    } catch {
      toast.error("Failed to update status");
    }
  };

// index.tsx
const downloadCSV = async () => {
  try {
    const params: ExportUsersParams = {
      search: search || undefined,
      country: filterCountry !== "all" ? filterCountry : undefined,
      state: filterState !== "all" ? filterState : undefined,
      plan: filterPlan !== "all" ? filterPlan : undefined,
    };

    // Get CSV text from API
    const csvText = await exportCSV(params).unwrap();

    // Create blob from text
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `users_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  } catch (error: any) {
    console.error("Export error:", error);
    toast.error(error?.data?.message || error?.message || "Failed to export CSV");
  }
};
  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="User Management" />
        <CommonBreadcrump title="User Management" href="/user-management" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full"> */}
        {/* <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full"> */}
        {/* <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 w-full"> */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">

        {/* LEFT SIDE — Filters (wrap allowed) */}
        <div className="flex flex-wrap gap-4 w-full min-w-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-full md:w-[300px]">
            <Input2
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
            />
            <SearchIcon />
          </div>

          {/* Country Filter */}
          <div className="w-full md:w-auto">
            <CommonSelect
              label="Country"
              showLabel={false}
              options={countryOptions}
              cssProp="min-h-[45px]! md:min-w-[160px]!"
              value={filterCountry}
              onChange={handleCountryFilter}
            />
          </div>

          {/* Plan Filter */}
          <div className="w-full md:w-auto">
            <CommonSelect
              label="All Plans"
              showLabel={false}
              options={planOptions}
              cssProp="min-h-[45px]! md:min-w-[160px]!"
              value={filterPlan}
              onChange={handlePlanFilter}
            />
          </div>

          {/* State Filter */}
          <div className="w-full md:w-auto">
            <CommonSelect
              label="All States"
              showLabel={false}
              options={stateOptions}
              cssProp="min-h-[45px]! md:min-w-[170px]!"
              value={filterState}
              onChange={handleStateFilter}
            />
          </div>
        </div>

        {/* RIGHT SIDE — Action Button (isolated, never overlaps) */}
        {/* <div className="flex shrink-0 self-start lg:self-auto"> */}
        <div className="flex w-full lg:w-auto">
          <Button
            onClick={downloadCSV}
            variant="themeRegular"
            disabled={isExporting}
            // className="rounded-[10px] py-3!"
            className="rounded-[10px] py-3! w-full sm:w-auto "
          >
            {isExporting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            {isExporting ? "Exporting..." : "Download CSV"}
          </Button>
        </div>
      </div>
        {/* Table */}
        <div className="flex flex-col w-full pt-4 relative overflow-x-auto max-w-[897px] lg:max-w-full">
          {(isLoading || isFetching) && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            </div>
          )}

          <DataTable
            columns={
              columns(handleStatusToggle) as ColumnDef<DisplayUser, unknown>[]
            }
            data={mappedUsers}
            isLoadingData={isLoading}
          />
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="relative w-full pt-4">
            
            {/* Left fade for mobile */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent md:hidden" />

            {/* Right fade for mobile */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent md:hidden" />

            {/* Scroll container */}
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

export default UserManagement;
