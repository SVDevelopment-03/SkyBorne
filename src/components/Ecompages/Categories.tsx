/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { DataTable } from "@/components/ui/CommonTable";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Edit, Trash2Icon } from "lucide-react";
import { SearchIcon } from "@/icons/helpIcon";
import toast from "react-hot-toast";
import { Toggle2 } from "@/components/ui/Toggle2";
import { useDebounce } from "@/hooks/useDebounce";
import { handleDeleteTrainer } from "@/utils/handleDeleteAlert";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import {
  useGetEcomCategoriesQuery,
  useUpdateEcomCategoryStatusMutation,
  useDeleteEcomCategoryMutation,
  type EcomCategory,
} from "@/store/api/categoryApi";
import { CategoryModal } from "./CategoryModal";

interface CategoryRowData extends EcomCategory {
  actions?: React.ReactNode;
}

export function Categories() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const [editingCategory, setEditingCategory] = useState<EcomCategory | null>(null);

  const { data, isLoading, refetch } = useGetEcomCategoriesQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const [updateStatus] = useUpdateEcomCategoryStatusMutation();
  const [deleteCategory] = useDeleteEcomCategoryMutation();

  const categories = (data as any)?.data?.categories || [];

  const handleStatusToggle = async (categoryId: string, current: boolean) => {
    try {
      await updateStatus({
        categoryId,
        status: current ? "inactive" : "active",
      }).unwrap();
      toast.success("Category status updated");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (categoryId: string) => {
    handleDeleteTrainer(categoryId, deleteCategory as any, refetch, "Category");
  };

  const handleEdit = (category: EcomCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const columns: ColumnDef<CategoryRowData>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">{row.original.name}</span>
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
              handleStatusToggle(row.original._id, row.original.status === "active")
            }
          />
          <span
            className={`text-sm font-medium ${
              row.original.status === "active" ? "text-green-600" : "text-red-600"
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
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Category Management" />
        <CommonBreadcrump title="Category Management" href="/categories" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Input2
              placeholder="Search by category name..."
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
            Add Category
          </Button>
        </div>

        <div className="flex flex-col w-full">
          <DataTable
            columns={columns as ColumnDef<CategoryRowData, unknown>[]}
            data={categories as CategoryRowData[]}
            isLoadingData={isLoading}
          />
        </div>

        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <VisuallyHidden>
            <DialogTitle>Category Management</DialogTitle>
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
            <CategoryModal
              editingCategory={editingCategory}
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
}
