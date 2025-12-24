/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import {
  useGetRegionsQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
  IRegion,
} from "@/store/api/regionApi";
import { DataTable } from "@/components/ui/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Trash2Icon, Globe, Loader, EditIcon } from "lucide-react";
import toast from "react-hot-toast";
import { RegionModal } from "./RegionModal";
import { Toggle2 } from "@/components/ui/Toggle2";
import { handleDeleteTrainer } from "@/utils/handleDeleteAlert";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";

interface RegionRowData extends IRegion {
  actions?: React.ReactNode;
}

const RegionManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<IRegion | undefined>(
    undefined
  );

  const { data, isLoading, refetch } = useGetRegionsQuery({
    page,
    limit,
    search,
  });

  const [createRegion] = useCreateRegionMutation();
  const [updateRegion, { isLoading: isUpdating }] = useUpdateRegionMutation();
  const [deleteRegion, { isLoading: isDeleting }] = useDeleteRegionMutation();

  const regions = data?.data?.regions || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleCreateRegion = async (formData: any) => {
    try {
      await createRegion(formData).unwrap();
      toast.success("Region created successfully!");
      setIsModalOpen(false);
      setPage(1);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create region");
      console.error("Error creating region:", error);
    }
  };

  const handleUpdateRegion = async (formData: any) => {
    try {
      if (selectedRegion?._id) {
        await updateRegion({
          regionId: selectedRegion._id as any,
          body: formData,
        }).unwrap();
        toast.success("Region updated successfully!");
        setSelectedRegion(undefined);
        setIsModalOpen(false);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update region");
      console.error("Error updating region:", error);
    }
  };

  const handleStatusToggle = async (
    regionId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateRegion({
        regionId: regionId as any,
        body: { status: newStatus },
      }).unwrap();
      toast.success(`Region status updated to ${newStatus}`);
      refetch();
    } catch (error: any) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (regionId: string) => {
    handleDeleteTrainer(regionId, deleteRegion, refetch, "Region");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegion(undefined);
  };

  const handleOpenModal = (region?: IRegion) => {
    setSelectedRegion(region);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const columns: ColumnDef<RegionRowData>[] = [
    {
      accessorKey: "name",
      header: "Region Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#b95e82]" />
          <span className="font-medium text-[#262626]">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-medium text-[#737373] uppercase text-sm">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "displayLabel",
      header: "Display Label",
      cell: ({ row }: any) => (
        <span className="text-[#262626] text-sm">
          {row?.original?.displayLabel}
        </span>
      ),
    },
    {
      accessorKey: "timezone",
      header: "Timezone",
      cell: ({ row }) => (
        <span className="text-[#737373] text-sm">{row.original.timezone}</span>
      ),
    },
    {
      accessorKey: "replayTime",
      header: "Replay Time",
      cell: ({ row }) => (
        <span className="text-[#262626] font-medium text-sm">
          {row.original.replayTime}
        </span>
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
              handleStatusToggle(row.original._id as any, row.original.status)
            }
          />
          <span
            className={`text-xs font-medium ${
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="theme"
            size="sm"
            onClick={() => handleOpenModal(row.original)}
            className="rounded-lg"
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          {/* <Button
            variant="outlineCancel"
            size="sm"
            onClick={() => handleDelete(row.original._id as any)}
            className="rounded-lg"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Search and Create Button */}
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Input2
              placeholder="Search by region name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              name="search"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            <SearchIcon />
          </div>
          <Button
            variant="themeRegular"
            className="rounded-[10px] py-3!"
            onClick={() => handleOpenModal()}
          >
            Create Region
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex flex-col w-full pt-4 relative">
          {(isDeleting || isUpdating || isLoading) && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            </div>
          )}
          <DataTable
            columns={columns as ColumnDef<RegionRowData, unknown>[]}
            data={regions as RegionRowData[]}
            isLoadingData={isLoading}
          />
        </div>

        {/* Region Modal */}
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <VisuallyHidden>
            <DialogTitle>Region Management</DialogTitle>
          </VisuallyHidden>
          <DialogContent
            className="
            !w-full!
            !max-w-[600px]!
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
            <RegionModal
              region={selectedRegion}
              onSubmit={
                selectedRegion ? handleUpdateRegion : handleCreateRegion
              }
              onCancel={handleCloseModal}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RegionManagement;
