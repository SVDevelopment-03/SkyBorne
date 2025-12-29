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
  useGetAllTrainerFeedbackQuery,
} from "@/store/api/feedbackApi";

interface FeedbackData {
  _id: string;
  session: string;
  trainer: {
    name: string;
    email: string;
  };
  userName: string;
  userEmail: string;
  date: string;
  rating: number;
  comment: string;
  status: "submitted" | "reviewed" | "flagged";
  trainerResponse: string | null;
  createdAt: string;
}

const AdminFeedbackManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [replyText, setReplyText] = useState("");

  // API calls
  const { data: feedbackData, isLoading } = useGetAllTrainerFeedbackQuery({
    search,
    page,
    limit,
    sortBy: "-createdAt",
  });

  // const [deleteFeedback] = useDeleteFeedbackMutation();

  const feedbacks = feedbackData?.data?.feedbacks || [];
  const totalPages = feedbackData?.data?.totalPages || 0;

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

  const handleSubmitReply = () => {
    if (!selectedFeedback || !replyText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    // TODO: Implement API call for updating trainer response
    toast.success("Trainer response updated");
    handleCloseReplyModal();
  };

  // const handleDeleteFeedback = async (feedbackId: string) => {
  //   try {
  //     await deleteFeedback(feedbackId).unwrap();
  //     toast.success("Feedback deleted successfully");
  //   } catch (error) {
  //     toast.error("Failed to delete feedback");
  //   }
  // };

  const handleStatusChange = (feedbackId: string, newStatus: "submitted" | "reviewed" | "flagged") => {
    // TODO: Implement API call for updating status
    toast.success(`Feedback status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
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
      accessorKey: "userName",
      header: "User Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#000000]">{row.original.userName}</span>
          <span className="text-xs text-[#6B6B6B]">{row.original.userEmail}</span>
        </div>
      ),
    },

    // {
    //   accessorKey: "trainer",
    //   header: "Trainer",
    //   cell: ({ row }) => (
    //     <div className="flex flex-col">
    //       <span className="font-medium text-[#000000]">{row.original.trainer.name}</span>
    //       <span className="text-xs text-[#6B6B6B]">{row.original.trainer.email}</span>
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
                star <= row.original.rating
                  ? "text-[#f4b942] fill-current"
                  : "text-[#e5e5e5]"
              }`}
            />
          ))}
          <span className={`ml-2 font-semibold ${getRatingColor(row.original.rating)}`}>
            {/* {row.original.rating} */}
          </span>
        </div>
      ),
    },
    {
  accessorKey: "comment",
  header: "Comment",
  cell: ({ row }) => {
    const comment = row.original.comment || "";
    const MAX_LENGTH = 60;

    const truncated =
      comment.length > MAX_LENGTH
        ? comment.slice(0, MAX_LENGTH) + "…"
        : comment;

    return (
      <div
        className="max-w-[260px] text-sm text-[#4B4B4B] truncate"
        title={comment} // 👈 shows full comment on hover
      >
        {truncated}
      </div>
    );
  },
},

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`${getStatusColor(row.original.status)} capitalize py-1!`}>
          {row.original.status}
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
    //         onClick={() => handleDeleteFeedback(row.original._id)}
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

      {/* View Feedback Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={handleCloseFeedbackModal}>
        <VisuallyHidden>
          <DialogTitle>View Feedback</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="w-full! max-w-[600px]! p-10">
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                  Feedback Details
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#6B6B6B] mb-1">User Name</p>
                  <p className="font-medium text-[#1A1A1A]">{selectedFeedback.userName}</p>
                  <p className="text-xs text-[#6B6B6B]">{selectedFeedback.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B] mb-1">Session</p>
                  <p className="font-medium text-[#1A1A1A]">{selectedFeedback.session}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B] mb-1">Trainer</p>
                  <p className="font-medium text-[#1A1A1A]">{selectedFeedback.trainer.name}</p>
                  <p className="text-xs text-[#6B6B6B]">{selectedFeedback.trainer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B] mb-1">Date</p>
                  <p className="font-medium text-[#1A1A1A]">{selectedFeedback.date}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-[#6B6B6B] mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= selectedFeedback.rating
                          ? "text-[#f4b942] fill-current"
                          : "text-[#e5e5e5]"
                      }`}
                    />
                  ))}
                  <span className="font-semibold">{selectedFeedback.rating}/5</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-[#6B6B6B] mb-2">Comment</p>
                <p className="text-[#1A1A1A] leading-relaxed bg-[#f9f9f9] p-4 rounded-lg">
                  {selectedFeedback.comment}
                </p>
              </div>

              {selectedFeedback.trainerResponse && (
                <div>
                  <p className="text-sm text-[#6B6B6B] mb-2">Trainer Response</p>
                  <p className="text-[#1A1A1A] leading-relaxed bg-[#f0f8f5] p-4 rounded-lg">
                    {selectedFeedback.trainerResponse}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    handleStatusChange(selectedFeedback._id, "reviewed");
                    handleCloseFeedbackModal();
                  }}
                  variant="themeRegular"
                  className="rounded-lg"
                >
                  Mark as Reviewed
                </Button>
                <Button
                  onClick={() => {
                    handleStatusChange(selectedFeedback._id, "flagged");
                    handleCloseFeedbackModal();
                  }}
                  variant="outline"
                  className="rounded-lg"
                >
                  Flag for Review
                </Button>
                <Button
                  onClick={handleCloseFeedbackModal}
                  variant="outline"
                  className="rounded-lg ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      {/* <Dialog open={isReplyModalOpen} onOpenChange={handleCloseReplyModal}>
        <VisuallyHidden>
          <DialogTitle>Add Trainer Response</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="w-full! max-w-[600px]! p-10">
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">
                  Trainer Response
                </h2>
                <p className="text-[#6B6B6B] text-sm">
                  Replying to {selectedFeedback.userName}{`'s feedback on `}{selectedFeedback.session}
                </p>
              </div>

              <div className="bg-[#f9f9f9] p-4 rounded-lg">
                <p className="text-sm text-[#6B6B6B] mb-1">Original Feedback</p>
                <p className="text-[#1A1A1A]">{selectedFeedback.comment}</p>
              </div>

              <div>
                <label className="text-sm text-[#6B6B6B] mb-2 block">
                  Your Response
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your response here..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20 resize-none"
                />
                <p className="text-xs text-[#6B6B6B] mt-2">
                  {replyText.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitReply}
                  variant="themeRegular"
                  className="rounded-lg flex-1"
                >
                  Submit Response
                </Button>
                <Button
                  onClick={handleCloseReplyModal}
                  variant="outline"
                  className="rounded-lg flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default AdminFeedbackManagement;