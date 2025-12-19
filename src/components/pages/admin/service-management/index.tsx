"use client";
import React, { useState } from "react";
import {
  useGetServicesQuery,
  useUpdateServiceStatusMutation,
  useDeleteServiceMutation,
  IService,
} from "@/store/api/serviceApi";
import { DataTable } from "@/components/ui/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Trash2Icon, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { Toggle2 } from "@/components/ui/Toggle2";
import { handleDeleteTrainer } from "@/utils/handleDeleteAlert";
import { ServiceModal } from "./ServiceModal";
import { useDebounce } from "@/hooks/useDebounce";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";


interface ServiceRowData extends IService {
  actions?: React.ReactNode;
}

const ServiceManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const [editingService, setEditingService] = useState<IService | null>(null);

  const { data, isLoading, refetch } = useGetServicesQuery({
    page,
    limit,
    search:debouncedSearch,
  });

  const [updateStatus] = useUpdateServiceStatusMutation();
  const [deleteService] = useDeleteServiceMutation();

  const services = data?.data || [];

  const handleStatusToggle = async (serviceId: string, current: boolean) => {
    try {
      await updateStatus({
        serviceId,
        isActive: !current,
      }).unwrap();
      toast.success("Service status updated");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (serviceId: string) => {
    handleDeleteTrainer(serviceId, deleteService, refetch,"Service");
  };

  const handleEdit = (service: IService) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const columns: ColumnDef<ServiceRowData>[] = [
    {
      accessorKey: "title",
      header: "Service Name",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Toggle2
            checked={row.original.isActive}
            onChange={() =>
              handleStatusToggle(row.original._id, row.original.isActive)
            }
          />
          <span
            className={`text-sm font-medium ${
              row.original.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {row.original.isActive ? "Active" : "Inactive"}
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
            onClick={() => handleEdit(row.original)}
            className="rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outlineCancel"
            size="sm"
            onClick={() => handleDelete(row.original._id)}
            className="rounded-lg"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
     <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Service Management"/>
        <CommonBreadcrump title="Service Management" href="/services" />
      </div>
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
      {/* Search and Create Button */}
      <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Input2
            placeholder="Search by service name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            name="search"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 text-base! placeholder:text-[#929292]!"
          />
          <SearchIcon />
        </div>
        <Button
          variant="themeRegular"
          className="rounded-[10px] py-3! w-full md:w-auto"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Add Service
        </Button>
      </div>

      {/* Data Table */}
      <div className="flex flex-col w-full">
        <DataTable
          columns={columns as ColumnDef<ServiceRowData, unknown>[]}
          data={services as ServiceRowData[]}
          isLoadingData={isLoading}
        />
      </div>

      {/* Service Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <VisuallyHidden>
          <DialogTitle>Service Management</DialogTitle>
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
          <ServiceModal
            editingService={editingService}
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

export default ServiceManagement;