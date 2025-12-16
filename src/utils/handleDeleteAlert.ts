/* eslint-disable @typescript-eslint/no-explicit-any */

import toast from "react-hot-toast";
import Swal from "sweetalert2";

export const handleDeleteTrainer = async (
  id: string,
  deleteTrainerFn: (id: string) => Promise<any>,
  refetch: () => void
) => {
  const confirmDelete = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
       icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "swal-confirm-btn px-6 py-2 rounded-md font-semibold text-white",
        cancelButton:
          "swal-cancel-btn px-6 py-2 rounded-md font-semibold border border-black text-black bg-transparent ml-3",
      },
    allowOutsideClick: true,
  });

  if (confirmDelete.isConfirmed) {
    try {
      await deleteTrainerFn(id);
      toast.success("Trainer deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting trainer:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete trainer";
      toast.error(errorMessage);
    }
  }
};