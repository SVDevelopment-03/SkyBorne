/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { DataTable } from "@/components/ui/CommonTable";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import { columns, CancelSubscriptionRow } from "./Column";
import { ColumnDef } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import CustomPagination from "@/components/ui/CustromPagination";
import DeleteSubscriptionModal from "@/utils/DeleteSubscriptionModal";

import { useGetCancelledSubscriptionsQuery } from "@/store/api/paymentApi";

const CancelSubscriptionPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [selectedSubscriptionName, setSelectedSubscriptionName] = useState<string | undefined>(undefined);
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [textModalTitle, setTextModalTitle] = useState("");
  const [textModalContent, setTextModalContent] = useState("");

  // ✅ Use paymentApi query to fetch cancelled subscriptions
  const { data, isLoading, isFetching, refetch }:any = useGetCancelledSubscriptionsQuery({
    page,
    limit,
    search: search || undefined,
  });

  // ✅ Map API data to table rows safely
  const subscriptions: CancelSubscriptionRow[] =
    data?.data?.cancelSubscriptions?.map((s: any) => ({
      _id: s._id || s.subscriptionId,
      name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
      email: s.email || "N/A",
      userId:s.userId || "",
      cancelledAt: s.cancelledAt || null,
      description: s.description || "",
      adminComment: s.adminDescription || s.adminComment || s.admin_description || "",
      createdAt: s.createdAt || s.updatedAt,
      plan: s.plan || "-", 
      status: s.status || "pending",
    })) || [];

  const totalPages = data?.data?.pagination?.totalPages || 1;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleAction = (id: string, name?: string) => {
    setSelectedSubscriptionId(id);
    setSelectedSubscriptionName(name);
    setModalOpen(true);
  };

  const handleOpenTextModal = (title: string, content: string) => {
    setTextModalTitle(title);
    setTextModalContent(content);
    setTextModalOpen(true);
  };

  const handleCloseTextModal = () => {
    setTextModalOpen(false);
    setTextModalTitle("");
    setTextModalContent("");
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
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full sm:w-[260px] md:w-[300px] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full pt-4 relative overflow-x-auto">
          {(isLoading || isFetching) && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
            </div>
          )}

          <DataTable
            columns={columns(handleAction, handleOpenTextModal) as ColumnDef<CancelSubscriptionRow, unknown>[]}
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
      {textModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 md:p-8 relative font-satoshi-regular">
            <button
              onClick={handleCloseTextModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl md:text-3xl font-satoshi-semibold text-gray-900 mb-4">
              {textModalTitle}
            </h2>
            <p className="text-gray-700 text-sm md:text-base whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto">
              {textModalContent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelSubscriptionPage;
