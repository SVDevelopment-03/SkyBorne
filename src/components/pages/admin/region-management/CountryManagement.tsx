"use client";
import React, { useState } from "react";
import {
  useGetCountriesQuery,
  useUpdateCountryStatusMutation,
  useDeleteCountryMutation,
} from "@/store/api/countryApi";
import { DataTable } from "@/components/ui/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import toast from "react-hot-toast";
import { CountryModal } from "./CountryModal";
import { ICountry } from "@/store/api/countryApi";
import { Toggle2 } from "@/components/ui/Toggle2";
import { handleDeleteTrainer } from "@/utils/handleDeleteAlert";
import CustomPagination from "@/components/ui/CustromPagination";

interface CountryRowData extends ICountry {
  actions?: React.ReactNode;
}

const CountryManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetCountriesQuery({
    page,
    limit,
    search,
  });

  const [updateStatus] = useUpdateCountryStatusMutation();
  const [deleteCountry] = useDeleteCountryMutation();

  const countries = data?.data?.countries || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleStatusToggle = async (
    countryId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateStatus({
        countryId,
        status: newStatus,
      }).unwrap();
      toast.success(`Country status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (countryId: string) => {
    handleDeleteTrainer(countryId, deleteCountry, refetch,"Country");
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const columns: ColumnDef<CountryRowData>[] = [
    {
      accessorKey: "name",
      header: "Country Name",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Toggle2
            checked={row.original.status === "active"}
            onChange={() =>
              handleStatusToggle(row.original._id, row.original.status)
            }
          />
          <span
            className={`text-sm font-medium ${
              row.original.status === "active"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {row.original.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <div className="flex gap-3">
    //       <Button
    //         variant="outlineCancel"
    //         size="sm"
    //         onClick={() => handleDelete(row.original._id)}
    //         className="rounded-lg "
    //       >
    //         <Trash2Icon className="w-4 h-4" />
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
     {/* <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Country Management" />
        <CommonBreadcrump title="Country Management" href="/regions" />
      </div> */}
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Search and Create Button */}
      <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Input2
              placeholder="Search by country name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              name="search"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            <SearchIcon />
          </div>
          {/* <Button
            variant="themeRegular"
            className="rounded-[10px] py-3!"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add Country
          </Button> */}
        </div>

        {/* Data Table */}
        <div className="flex flex-col w-full">
          <DataTable
            columns={columns as ColumnDef<CountryRowData, unknown>[]}
            data={countries as CountryRowData[]}
            isLoadingData={isLoading}
          />
        </div>

        {/* Pagination Controls */}
   {/* Pagination Controls */}
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

        {/* Country Modal */}
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <VisuallyHidden>
            <DialogTitle>Country Management</DialogTitle>
          </VisuallyHidden>
          <DialogContent
            className="
            w-full!
            max-w-[600px]!
            p-10
              data-[state=open]:animate-in
    data-[state=open]:fade-in-0
    data-[state=open]:zoom-in-95
    data-[state=open]:slide-in-from-top-20
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
    data-[state=closed]:zoom-out-95
    data-[state=closed]:slide-out-to-top-20
    duration-500
          "
          >
            <CountryModal
              onCancel={handleCloseModal}
              onSuccess={() => {
                handleCloseModal();
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CountryManagement;
