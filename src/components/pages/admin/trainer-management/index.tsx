// ============================================================================
// TrainerManagement.tsx (Main Component)
// ============================================================================
"use client";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import React, { useState } from "react";
import { columns } from "./Column";
import { TrainerApiData, TrainerData } from "@/store/api/trainerApi";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { handleDeleteTrainer } from "@/utils/handleDeleteAlert";

const TrainerManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<TrainerData | null>(
    null
  );

  const { data, isLoading, refetch } = useGetTrainersQuery({
    page,
    limit,
    search,
  });

  const [createTrainer] = useCreateTrainerMutation();
  const [updateTrainer] = useUpdateTrainerMutation();
  const [deleteTrainer] = useDeleteTrainerMutation();

  const trainers = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const currentPage = data?.pagination?.currentPage || 1;
  const totalTrainers = data?.pagination?.total || 0;

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

  const onDelete = (id: string) => {
    handleDeleteTrainer(id, deleteTrainer, refetch);
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Input2
            placeholder="Search by name or specialization"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            name="search"
            className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] min-w-[260px] md:min-w-[450px] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
          />
          <SearchIcon />
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

      <div className="flex flex-col w-full pt-4">
        <DataTable
          columns={
            columns(handleEditTrainer, onDelete) as ColumnDef<
              TrainerData,
              unknown
            >[]
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
            onCancel={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerManagement;
