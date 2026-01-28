/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useMemo } from "react";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { DataTable } from "@/components/ui/CommonTable";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import { columns, CancelSubscriptionRow } from "./Column";
import { ColumnDef } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { CommonSelect } from "@/components/ui/CountrySelect";
import CustomPagination from "@/components/ui/CustromPagination";
import countryList from "react-select-country-list";
import toast from "react-hot-toast";
import DeleteSubscriptionModal from "@/utils/DeleteSubscriptionModal";

import { useCancelSubscriptionMutation, useGetCancelledSubscriptionsQuery } from "@/store/api/paymentApi";

const CancelSubscriptionPage = () => {
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [selectedSubscriptionName, setSelectedSubscriptionName] = useState<string | undefined>(undefined);

  // ✅ Use paymentApi query to fetch cancelled subscriptions
  const { data, isLoading, isFetching, refetch }:any = useGetCancelledSubscriptionsQuery({
    page,
    limit,
    search: search || undefined,
    country: filterCountry !== "all" ? filterCountry : undefined,
  });
  console.log("Cancelled Subscriptions Data:", data);

  const [cancelSubscription] = useCancelSubscriptionMutation();

  // ✅ Map API data to table rows safely
  const subscriptions: CancelSubscriptionRow[] =
    data?.data?.cancelSubscriptions?.map((s: any) => ({
      _id: s._id || s.subscriptionId,
      name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
      email: s.email || "N/A",
      userId:s.userId || "",
      cancelledAt: s.cancelledAt || null,
      description: s.description || "",
      createdAt: s.createdAt || s.updatedAt,
      plan: s.plan || "-", 
      status: s.isCancelled ? "inactive" : "active", // toggle active/inactive
    })) || [];

  const totalPages = data?.data?.pagination?.totalPages || 1;

  const countryOptions = useMemo(() => {
    const countries = countryList().getData();
    return [
      { value: "all", label: "All Countries" },
      ...countries.map((c) => ({ value: c.value.toUpperCase(), label: c.label })),
    ];
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleAction = (id: string, name?: string) => {
    setSelectedSubscriptionId(id);
    setSelectedSubscriptionName(name);
    setModalOpen(true);
  };

  const handleCountryFilter = (value: string) => {
    setFilterCountry(value);
    setPage(1);
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelSubscription(id).unwrap();
      toast.success("Subscription cancelled successfully");
      refetch(); // refresh table
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel subscription");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Cancel Subscriptions" />
        <CommonBreadcrump title="Cancel Subscriptions" href="/cancel-subscription" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
            <div className="relative">
              <Input2
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] min-w-[260px] md:min-w-[300px] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>
{/* 
            <div className="w-full md:w-auto">
              <CommonSelect
                label="Country"
                showLabel={false}
                options={countryOptions}
                cssProp="min-h-[45px]! md:min-w-[200px]!"
                value={filterCountry}
                onChange={handleCountryFilter}
              />
            </div> */}
          </div>
        </div>

        <div className="flex flex-col w-full pt-4 relative overflow-x-auto">
          {(isLoading || isFetching) && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
            </div>
          )}

          <DataTable
            columns={columns(
              async (id: string, currentStatus: "active" | "inactive") => {
                console.log("Status toggle clicked", id, currentStatus);
              },
              handleAction
            ) as ColumnDef<CancelSubscriptionRow, unknown>[]}
            data={subscriptions}
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
      <DeleteSubscriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        subscriptionId={selectedSubscriptionId || undefined}
        subscriptionName={selectedSubscriptionName}
        onSuccess={() => refetch()} 
      />
    </div>
  );
};

export default CancelSubscriptionPage;
