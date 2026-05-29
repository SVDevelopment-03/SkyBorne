import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export interface AccountDeletionRequestRow {
  _id: string;
  fullName: string;
  email: string;
  reason?: string;
  status: "requested" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  gateway?: string;
  plan?: string | null;
}

export interface AccountDeletionColumnActions {
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  isMutating?: boolean;
}

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const columns = ({
  onApprove,
  onReject,
  onDelete,
  isMutating = false,
}: AccountDeletionColumnActions): ColumnDef<AccountDeletionRequestRow>[] => [
  {
    id: "serial",
    header: "S.No.",
    cell: ({ row }) => <div className="text-[16px] font-satoshi-500">{row.index + 1}</div>,
  },
  {
    accessorKey: "fullName",
    header: "User",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-[16px] font-satoshi-500 text-[#000000]">{row.original.fullName}</span>
        <span className="text-sm text-[#666666]">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="max-w-[320px] text-sm text-[#666666]">
        {row.original.reason || "User requested deletion"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      const statusClass =
        status === "approved"
          ? "bg-green-100 text-green-700"
          : status === "rejected"
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700";
      return (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "requestedAt",
    header: "Requested At",
    cell: ({ row }) => (
      <span className="text-[#666666]">{formatDate(row.original.requestedAt)}</span>
    ),
  },
  {
    accessorKey: "processedAt",
    header: "Reviewed At",
    cell: ({ row }) => (
      <span className="text-[#666666]">
        {formatDate(row.original.processedAt ?? row.original.reviewedAt)}
      </span>
    ),
  },
  {
    accessorKey: "rejectionReason",
    header: "Review Note",
    cell: ({ row }) => (
      <div className="max-w-[280px] text-sm text-[#666666]">
        {row.original.rejectionReason || "—"}
      </div>
    ),
  },
  {
    accessorKey: "gateway",
    header: "Gateway",
    cell: ({ row }) => (
      <span className="bg-[#E8F0FF] text-[#335CFF] px-3 py-1 rounded-full text-sm capitalize">
        {row.original.gateway || "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const isRequested = row.original.status === "requested";

      if (!isRequested) {
        return <span className="text-[#9CA3AF]">—</span>;
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="themeRegular"
            className="h-8 px-3"
            onClick={() => onApprove(row.original._id)}
            disabled={isMutating}
          >
            Approve
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 px-3 border-[#DCE5E0] text-[#494949]"
            onClick={() => onReject(row.original._id)}
            disabled={isMutating}
          >
            Reject
          </Button>
          <Button
            type="button"
            variant="outlineCancel"
            className="h-8 px-3"
            onClick={() => onDelete(row.original._id)}
            disabled={isMutating}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
