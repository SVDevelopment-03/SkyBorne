/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import {
  TrainerApiData,
  TrainerData,
  TrainerStatus,
} from "@/store/api/trainerApi";
import { ColumnDef } from "@tanstack/react-table";
import {
  useGetTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
} from "@/store/api/trainerApi";
import { DataTable } from "@/components/ui/CommonTable";
import { TrainerModal } from "./TrainerModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { handleDeleteTrainer } from "@/utils/handleDeleteAlert";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import { useGetServicesQuery } from "@/store/api/publicApi";
import { CommonSelect } from "@/components/ui/CountrySelect";

const TrainerManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
    const [serviceFilter, setServiceFilter] = useState("");
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<TrainerData | null>(
    null
  );

  const { data, isLoading, refetch } = useGetTrainersQuery({
    page,
    limit,
    search,
    filter:serviceFilter
  });

  const [createTrainer, { isLoading: isCreating }] = useCreateTrainerMutation();
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation();

  const trainers = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const currentPage = data?.pagination?.currentPage || 1;
  const totalTrainers = data?.pagination?.total || 0;

  const [serviceOptions, setServiceOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  // Fetch services for dropdown
  const { data: servicesData, isLoading: servicesLoading } =
    useGetServicesQuery({
      skip: 0,
      limit: 100,
    });

  // Update service options when services data changes
  useEffect(() => {
    if (servicesData?.data) {
      const options = servicesData.data.map((service: any) => ({
        label: service.title,
        value: service._id,
      }));
      setTimeout(() => {
        setServiceOptions(options);
      }, 0);
    }
  }, [servicesData]);

  const handleCreateTrainer = async (formData: Partial<TrainerApiData>) => {
    try {
      await createTrainer(formData).unwrap();
      toast.success("Trainer Created");
      setIsModalOpen(false);
      setPage(1);
      refetch();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error creating trainer:", error);
    }
  };

  const handleUpdateTrainer = async (formData: Partial<TrainerApiData>) => {
    try {
      if (editingTrainer?._id) {
        await updateTrainer({
          id: editingTrainer._id,
          data: formData,
        }).unwrap();
        setEditingTrainer(null);
        toast.success("Trainer Updated");
        setIsModalOpen(false);
        refetch();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error updating trainer:", error);
    }
  };

  const handleStatusToggle = async (
    countryId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateTrainer({
        id: countryId,
        data: { status: newStatus } as TrainerStatus,
      }).unwrap();
      toast.success(`Country status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const onDelete = (id: string) => {
    handleDeleteTrainer(id, deleteTrainer, refetch, "Trainer");
  };

  const handleEditTrainer = (trainer: TrainerData) => {
    setEditingTrainer(trainer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrainer(null);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleServiceFilterChange = (value: string) => {
    setServiceFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Trainer Management" />

        <CommonBreadcrump title="Trainer Management" href="/trainers" />
      </div>
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input2
                placeholder="Search by name or service"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                name="search"
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] min-w-[260px] md:min-w-[450px] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>
            <div className="w-full">
              <CommonSelect
                label="Service"
                showLabel={false}
                options={serviceOptions}
                cssProp="min-h-[45px]! min-w-[300px]!"
                value={serviceFilter}
                onChange={handleServiceFilterChange}
              />
            </div>
          </div>
          <Button
            variant={"themeRegular"}
            className="rounded-[10px] py-3!"
            onClick={() => {
              setEditingTrainer(null);
              setIsModalOpen(true);
            }}
          >
            Create Trainer
          </Button>
        </div>

        <div className="flex flex-col w-full pt-4 relative">
          {(isDeleting || isUpdating || isLoading) && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            </div>
          )}
          <DataTable
            columns={
              columns(
                handleEditTrainer,
                onDelete,
                handleStatusToggle
              ) as ColumnDef<TrainerData, unknown>[]
            }
            data={trainers}
            isLoadingData={isLoading}
          />
        </div>

        {/* Pagination Controls */}

        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <VisuallyHidden>
            <DialogTitle>Create</DialogTitle>
          </VisuallyHidden>
          <DialogContent
            className="
!w-full
    !max-w-[800px]
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
            <TrainerModal
              trainer={editingTrainer}
              onSubmit={
                editingTrainer ? handleUpdateTrainer : handleCreateTrainer
              }
              isLoading={editingTrainer ? isUpdating : isCreating}
              onCancel={handleCloseModal}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TrainerManagement;
