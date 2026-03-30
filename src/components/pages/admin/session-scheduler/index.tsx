/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import {
  useCreateMeetingShareLinkMutation,
  useDeleteMeetingMutation,
  useGetMeetingsQuery,
  useUpdateMeetingMutation,
} from "@/store/api/meetingApi";
import { DataTable } from "@/components/ui/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import { SearchIcon } from "@/icons/helpIcon";
import { Trash2Icon, Edit, Copy, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
import { IMeeting } from "@/store/api/meetingApi";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import MainListHeading from "@/components/ui/MainListHeading";
import CustomPagination from "@/components/ui/CustromPagination";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { handleDeleteTrainer } from "@/utils/handleDeleteAlert";
import { useGetServicesQuery } from "@/store/api/publicApi";
import { CommonSelect } from "@/components/ui/CountrySelect";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

type Status = "Upcoming" | "Live" | "Completed";

const getStatusFromLocalTime = (
  localTime: string | Date,
  duration: number // minutes
): Status => {
  const now = new Date();

  const start = localTime instanceof Date ? localTime : new Date(localTime);

  // Calculate end time using duration
  const end = new Date(start.getTime() + duration * 60 * 1000);

  if (now < start) return "Upcoming";
  if (now >= start && now < end) return "Live";
  return "Completed";
};

interface ClassRowData extends IMeeting {
  actions?: React.ReactNode;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ClassListManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [serviceFilter, setServiceFilter] = useState("");
  const [serviceOptions, setServiceOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [deleteMeeting] = useDeleteMeetingMutation();
  const [updateMeeting] = useUpdateMeetingMutation();
  const [createMeetingShareLink] = useCreateMeetingShareLinkMutation();
  const [markingMeetingId, setMarkingMeetingId] = useState<string | null>(null);
  const [showCompleteConfirmModal, setShowCompleteConfirmModal] =
    useState(false);
  const [meetingToComplete, setMeetingToComplete] = useState<ClassRowData | null>(
    null,
  );

  // Fetch services for dropdown
  const { data: servicesData, isLoading: servicesLoading } =
    useGetServicesQuery({
      skip: 0,
      limit: 100, // Get all services
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

  const { data, isLoading, refetch } = useGetMeetingsQuery({
    page,
    limit,
    search,
    filter: serviceFilter,
  });

  const router = useRouter();

  const meetings = data?.data?.meetings || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEdit = (meetingId: string) => {
    router.push(`/edit-session/${meetingId}`);
  };

  const handleView = (meetingId: string) => {
    router.push(`/class/${meetingId}`);
  };

  const handleDelete = async (meetingId: string) => {
    handleDeleteTrainer(meetingId, deleteMeeting, refetch, "Class");
  };

  const copyToClipboard = async (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }

    return false;
  };

  const handleCopyLink = async (meetingId: string) => {
    try {
      const res = await createMeetingShareLink({ meetingId }).unwrap();
      const token = res?.data?.token;
      const shareUrl = res?.data?.shareUrl || "";
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";

      const link =
        shareUrl ||
        (token && baseUrl
          ? `${baseUrl}/zoom-redirect?token=${encodeURIComponent(token)}`
          : "");

      if (!link) {
        toast.error("Unable to create share link");
        return;
      }

      const success = await copyToClipboard(link);
      if (!success) {
        throw new Error("Clipboard unavailable");
      }
      toast.success("Session link copied");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to copy session link",
      );
    }
  };

  const handleServiceFilterChange = (value: string) => {
    setServiceFilter(value);
    setPage(1);
  };

  const handleOpenCompleteConfirm = (meeting: ClassRowData) => {
    if (!meeting?._id || meeting.status === "completed") return;
    setMeetingToComplete(meeting);
    setShowCompleteConfirmModal(true);
  };

  const handleConfirmComplete = async () => {
    if (!meetingToComplete?._id) return;

    try {
      setMarkingMeetingId(meetingToComplete._id);
      await updateMeeting({
        id: meetingToComplete._id,
        body: { status: "completed" },
      }).unwrap();

      toast.success("Class marked as completed. Join link is now disabled.");
      setShowCompleteConfirmModal(false);
      setMeetingToComplete(null);
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to mark class completed",
      );
    } finally {
      setMarkingMeetingId(null);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setServiceFilter("");
    setPage(1);
  };

  const columns: ColumnDef<ClassRowData>[] = [
    {
      accessorKey: "title",
      header: "Class Title",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-[#000000]">
            {row.original.title}
          </span>
          <span className="text-xs text-[#666666]">
            {row.original.service?.title}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "trainer",
      header: "Trainer",
      cell: ({ row }) => (
        <span className="font-medium text-[#000000]">
          {row.original.trainer?.name || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <span className="text-[#666666]">
          {formatDate(new Date(row.original.startDate))}
        </span>
      ),
    },
    {
      accessorKey: "liveRegion",
      header: "Live Region",
      cell: ({ row }) => (
        <Badge variant="outline" className="py-1! bg-[#B95E82] text-[12px]!">
          {row.original.liveRegion?.toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <span className="text-[#666666]">{row.original.duration} mins</span>
      ),
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const status = getStatusFromLocalTime(
    //       row.original.localTime,
    //       row.original.duration
    //     );

    //     const statusStyles = {
    //       Upcoming: "bg-yellow-50 text-yellow-700",
    //       Live: "bg-green-50 text-green-700",
    //       Completed: "bg-gray-100 text-gray-700",
    //     };

    //     return (
    //       <Badge variant="outline" className={`py-1! ${statusStyles[status]}`}>
    //         {status}
    //       </Badge>
    //     );
    //   },
    // },
    {
      id: "markCompleted",
      header: "Mark Completed",
      cell: ({ row }) => {
        const startTime = new Date(row.original.localTime as string);
        const now = new Date();
        const hasMeetingStarted = !Number.isNaN(startTime.getTime())
          ? startTime.getTime() <= now.getTime()
          : false;
        const isCompleted = row.original.status === "completed";
        const isMarkingThisRow = markingMeetingId === row.original._id;
        const isDisabled = isCompleted || isMarkingThisRow || !hasMeetingStarted;

        return (
          <button
            type="button"
            className={`inline-flex items-center justify-center h-8 w-8 rounded-md border transition-colors ${
              isCompleted
                ? "border-[#27AE60] bg-[#27AE60]/10 text-[#27AE60]"
                : isDisabled
                  ? "border-[#e3e3e3] bg-[#f7f7f7] text-[#b6b6b6] cursor-not-allowed"
                  : "border-[#d7d7d7] bg-white text-[#6B6B6B] hover:border-[#27AE60] hover:text-[#27AE60]"
            }`}
            disabled={isDisabled}
            onClick={() => handleOpenCompleteConfirm(row.original)}
            title={
              isCompleted
                ? "Class completed"
                : !hasMeetingStarted
                  ? "Mark class completed"
                  : isMarkingThisRow
                    ? "Saving..."
                    : "Mark class completed"
            }
          >
            {isCompleted ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyLink(row.original._id)}
              className="rounded-lg"
              title="Copy link"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="theme"
              size="sm"
              onClick={() => handleEdit(row.original._id)}
              className="rounded-lg"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>

            <Button
              variant="outlineCancel"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
              className="rounded-lg"
              title="Delete"
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Class  Management" />
        <CommonBreadcrump title="Class Management" href="/schedule-session" />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Search and Create Button */}
          {/* Search, Filter, Add Class */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          {/* Left side: Search + Service Filter */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-[70%]">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-[360px]">
              <Input2
                placeholder="Search by class name or trainer..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                name="search"
                className="bg-[#F2F0ED80] text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] w-full h-11 rounded-[10px] pl-[41px] pt-1.5 text-base placeholder:text-[#929292]"
              />
              <SearchIcon />
            </div>

            {/* Service Filter Dropdown */}
            <div className="w-full sm:max-w-[260px]">
              <CommonSelect
                options={serviceOptions}
                label="service"
                showLabel={false}
                cssProp="min-h-[45px]! w-full"
                value={serviceFilter}
                onChange={handleServiceFilterChange}
              />
            </div>
          </div>
          <Button
            variant="themeRegular"
            className="rounded-[10px] py-3!"
            onClick={() => router.push("/create-session")}
          >
            Add Class
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex flex-col w-full">
          <DataTable
            columns={columns as ColumnDef<ClassRowData, unknown>[]}
            data={meetings as ClassRowData[]}
            isLoadingData={isLoading}
          />
        </div>

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
      </div>
      <ConfirmModal
        isOpen={showCompleteConfirmModal}
        title="Complete Class"
        message="Are you sure you want to complete the class?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleConfirmComplete}
        onCancel={() => {
          setShowCompleteConfirmModal(false);
          setMeetingToComplete(null);
        }}
        variant="info"
      />
    </div>
  );
};

export default ClassListManagement;
