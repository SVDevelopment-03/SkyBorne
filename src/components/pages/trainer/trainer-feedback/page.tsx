"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/ui/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Trash2Icon, Eye, Star, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import CustomPagination from "@/components/ui/CustromPagination";

interface FeedbackData {
  _id: string;
  session: string;
  trainer: string;
  userName: string;
  date: string;
  rating: number;
  comment: string;
  status: "submitted" | "reviewed" | "flagged";
  trainerResponse: string | null;
  createdAt: string;
}

const FeedbackManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [replyText, setReplyText] = useState("");

  // Static data - Replace with API call
  const staticFeedbackData = [
    {
      _id: "1",
      session: "Vinyasa Flow Yoga",
      trainer: "Priya Sharma",
      userName: "Raj Kumar",
      date: "Dec 10, 2025",
      rating: 5,
      comment: "Absolutely loved this session! The flow was perfect and Priya's guidance was excellent.",
      status: "submitted" as const,
      trainerResponse: "Thank you so much for your kind words! Looking forward to seeing you in the next session.",
      createdAt: "2025-12-10T10:30:00Z"
    },
    {
      _id: "2",
      session: "Mindful Meditation",
      trainer: "Emily Johnson",
      userName: "Sarah Chen",
      date: "Dec 8, 2025",
      rating: 4,
      comment: "Great session, very calming. Would love more breathing exercises.",
      status: "reviewed" as const,
      trainerResponse: null,
      createdAt: "2025-12-08T09:15:00Z"
    },
    {
      _id: "3",
      session: "Power Yoga",
      trainer: "Michael Chen",
      userName: "Alex Johnson",
      date: "Dec 5, 2025",
      rating: 5,
      comment: "Challenging but rewarding! Michael pushes you to your best.",
      status: "submitted" as const,
      trainerResponse: "Thanks for the feedback! Keep up the great work!",
      createdAt: "2025-12-05T14:45:00Z"
    },
    {
      _id: "4",
      session: "Breath Work Session",
      trainer: "Sarah Martinez",
      userName: "Emma Wilson",
      date: "Dec 12, 2025",
      rating: 2,
      comment: "The session was too rushed. Didn't have enough time to practice properly.",
      status: "flagged" as const,
      trainerResponse: null,
      createdAt: "2025-12-12T17:20:00Z"
    },
    {
      _id: "5",
      session: "Yin Yoga",
      trainer: "Lisa Anderson",
      userName: "David Brown",
      date: "Dec 11, 2025",
      rating: 4,
      comment: "Relaxing and well-structured. Lisa's voice was very soothing.",
      status: "submitted" as const,
      trainerResponse: null,
      createdAt: "2025-12-11T18:30:00Z"
    }
  ];

  const [feedback, setFeedback] = useState<FeedbackData[]>(staticFeedbackData);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate pagination
  const filteredFeedback = feedback.filter(f =>
    f.session.toLowerCase().includes(search.toLowerCase()) ||
    f.trainer.toLowerCase().includes(search.toLowerCase()) ||
    f.userName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFeedback.length / limit);
  const paginatedFeedback = filteredFeedback.slice(
    (page - 1) * limit,
    page * limit
  );

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

    // TODO: Replace with API call
    setFeedback(prev =>
      prev.map(f =>
        f._id === selectedFeedback._id
          ? { ...f, trainerResponse: replyText, status: "reviewed" }
          : f
      )
    );

    toast.success("Trainer response updated");
    handleCloseReplyModal();
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    // TODO: Replace with API call
    setFeedback(prev => prev.filter(f => f._id !== feedbackId));
    toast.success("Feedback deleted successfully");
  };

  const handleStatusChange = (feedbackId: string, newStatus: "submitted" | "reviewed" | "flagged") => {
    // TODO: Replace with API call
    setFeedback(prev =>
      prev.map(f =>
        f._id === feedbackId ? { ...f, status: newStatus } : f
      )
    );
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
        <span className="font-medium text-[#000000]">{row.original.userName}</span>
      ),
    },
    {
      accessorKey: "session",
      header: "Session",
      cell: ({ row }) => (
        <span className="text-[#000000]">{row.original.session}</span>
      ),
    },
    {
      accessorKey: "trainer",
      header: "Trainer",
      cell: ({ row }) => (
        <span className="text-[#000000]">{row.original.trainer}</span>
      ),
    },
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
            {row.original.rating}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`${getStatusColor(row.original.status)} capitalize py-1!`} >
          {row.original.status}
        </Badge>
      ),
    },

  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-[#1A1A1A] mb-2">Feedback Management</h1>
          <p className="text-[#6B6B6B]">Review and manage user feedback</p>
        </div>

        {/* Search */}
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Input2
              placeholder="Search by user, trainer, or session..."
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
            data={paginatedFeedback}
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
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B] mb-1">Session</p>
                  <p className="font-medium text-[#1A1A1A]">{selectedFeedback.session}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6B6B] mb-1">Trainer</p>
                  <p className="font-medium text-[#1A1A1A]">{selectedFeedback.trainer}</p>
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
                  onClick={() => handleStatusChange(selectedFeedback._id, "reviewed")}
                  variant="themeRegular"
                  className="rounded-lg"
                >
                  Mark as Reviewed
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedFeedback._id, "flagged")}
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
      <Dialog open={isReplyModalOpen} onOpenChange={handleCloseReplyModal}>
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
      </Dialog>
    </div>
  );
};

export default FeedbackManagement;