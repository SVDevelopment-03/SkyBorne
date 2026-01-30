"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Trash2, Eye, Star, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import CustomPagination from "@/components/ui/CustromPagination";
import MainListHeading from "@/components/ui/MainListHeading";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import {
  useGetAllFeedbackQuery,
  useUpdateFeedbackStatusMutation,
  useUpdateTrainerResponseMutation,
  useDeleteFeedbackMutation,
} from "@/store/api/feedbackApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeedbackData {
  _id: string;
  session?: string;
  trainer: {
    name: string;
    email: string;
  };
  user: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  status?: "submitted" | "reviewed" | "flagged";
  trainerResponse?: string | null;
  createdAt: string;
}

const AdminFeedbackManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");

  // API calls
  const { data: feedbackData, isLoading } = useGetAllFeedbackQuery({
    search,
    page,
    limit,
    sortBy: "-createdAt",
  });

  const [updateStatus] = useUpdateFeedbackStatusMutation();
  const [updateResponse] = useUpdateTrainerResponseMutation();
  const [deleteFeedback] = useDeleteFeedbackMutation();

  const feedbacks = feedbackData?.data || [];
  const totalPages = feedbackData?.totalPages || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (fb: FeedbackData) => {
    setSelectedFeedback(fb);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleViewFeedback = (fb: FeedbackData) => {
    setSelectedFeedback(fb);
    setIsViewModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsViewModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleOpenReplyModal = (fb: FeedbackData) => {
    setSelectedFeedback(fb);
    setReplyText(fb.trainerResponse || "");
    setIsReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setReplyText("");
    setSelectedFeedback(null);
  };

  const handleSubmitReply = async () => {
    if (!selectedFeedback || !replyText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      await updateResponse({
        feedbackId: selectedFeedback._id,
        trainerResponse: replyText,
      }).unwrap();
      toast.success("Trainer response updated successfully");
      handleCloseReplyModal();
    } catch (error) {
      toast.error("Failed to update trainer response");
      console.error(error);
    }
  };

  const handleDeleteFeedbackClick = async (feedbackId: string) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedback(feedbackId).unwrap();
        toast.success("Feedback deleted successfully");
      } catch (error) {
        toast.error("Failed to delete feedback");
        console.error(error);
      }
    }
  };

  const handleStatusChange = async (
    feedbackId: string,
    newStatus: "submitted" | "reviewed" | "flagged",
  ) => {
    try {
      await updateStatus({
        feedbackId,
        status: newStatus,
      }).unwrap();
      toast.success(`Feedback status updated to ${newStatus}`);
      handleCloseFeedbackModal();
    } catch (error) {
      toast.error("Failed to update feedback status");
      console.error(error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "reviewed":
        return "bg-green-100 text-green-700";
      case "flagged":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const columns: ColumnDef<FeedbackData>[] = [
    {
      accessorKey: "user",
      header: "User Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#000000]">
            {row?.original?.user?.name}
          </span>
          <span className="text-xs text-[#6B6B6B]">
            {row?.original?.user?.email}
          </span>
        </div>
      ),
    },

    // {
    //   accessorKey: "trainer",
    //   header: "Trainer",
    //   cell: ({ row }) => (
    //     <div className="flex flex-col">
    //       <span className="font-medium text-[#000000]">{row?.original?.trainer?.name}</span>
    //       <span className="text-xs text-[#6B6B6B]">{row?.original?.trainer?.email}</span>
    //     </div>
    //   ),
    // },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= row?.original?.rating
                  ? "text-[#f4b942] fill-current"
                  : "text-[#e5e5e5]"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => {
        const fb = row.original;
        const comment = row.original.comment || "—";
        const shortComment =
          comment.length > 10 ? comment.slice(0, 10) + "…" : comment;

        return (
          <span
            className="max-w-[200px] text-sm text-[#4B4B4B] cursor-pointer"
            onClick={() => handleOpenModal(fb)}
          >
            {shortComment}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={`${getStatusColor(row.original.status)} capitalize py-1! bg-[#27AE60]/10 text-[#27AE60] rounded-lg! pr-[8px] text-center`}
        >
          {row.original.status || "submitted"}
        </Badge>
      ),
    },
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <div className="flex gap-2">
    //       <Button
    //         onClick={() => handleViewFeedback(row.original)}
    //         variant="ghost"
    //         size="sm"
    //         className="p-1 h-auto"
    //         title="View feedback"
    //       >
    //         <Eye className="w-4 h-4 text-[#6B6B6B]" />
    //       </Button>
    //       <Button
    //         onClick={() => handleOpenReplyModal(row.original)}
    //         variant="ghost"
    //         size="sm"
    //         className="p-1 h-auto"
    //         title="Add trainer response"
    //       >
    //         <MessageSquare className="w-4 h-4 text-[#6B6B6B]" />
    //       </Button>
    //       <Button
    //         onClick={() => handleDeleteFeedbackClick(row.original._id)}
    //         variant="ghost"
    //         size="sm"
    //         className="p-1 h-auto"
    //         title="Delete feedback"
    //       >
    //         <Trash2 className="w-4 h-4 text-red-500" />
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Feedback Management" />
        <CommonBreadcrump
          title="Feedback Management"
          href="/feedback-management"
        />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Search */}
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Input2
              placeholder="Search by user, trainer, email, or comment..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              name="search"
              className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 text-base! placeholder:text-[#929292]!"
            />
            <SearchIcon />
          </div>
        </div>

        {/* Data Table */}
        <div className="flex flex-col w-full">
          <DataTable
            columns={columns}
            data={feedbacks}
            isLoadingData={isLoading}
          />
        </div>

        {/* Pagination */}
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
          <div className="flex flex-col gap-6">
            {/* User Name */}
            <div>
              <p className="text-sm text-gray-500">User Name</p>
              <p className="text-lg font-semibold text-black">
                {selectedFeedback?.user?.name}
              </p>
            </div>

            {/* Rating */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= (selectedFeedback?.rating || 0)
                        ? "text-[#f4b942] fill-current"
                        : "text-[#e5e5e5]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Full Comment */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Comment</p>

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed w-full max-w-full overflow-hidden">
                <p className="break-all whitespace-pre-wrap">
                  {selectedFeedback?.comment}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFeedbackManagement;
