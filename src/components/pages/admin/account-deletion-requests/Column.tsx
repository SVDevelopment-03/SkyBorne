import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export interface AccountDeletionRequestRow {
  _id: string;
  fullName: string;
  email: string;
  reason: string;
  status: "requested" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string | null;
  rejectionReason?: string | null;
  gateway?: string;
  plan?: string | null;
}

export const columns = (options: {
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  isMutating: boolean;
}): ColumnDef<AccountDeletionRequestRow>[] => [
  {
    id: "serial",
    header: "#",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "fullName",
    header: "Requester",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-[16px] font-satoshi-500">{row.original.fullName}</span>
        <span className="text-sm text-[#666666]">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-[#666666] text-sm">{row.original.reason || "No reason provided"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusStyles = {
        requested: "bg-[#FFF4E5] text-[#B95E82]",
        approved: "bg-[#E8F6EC] text-[#1E7E34]",
        rejected: "bg-[#F8D7DA] text-[#842029]",
      } as const;
      return (
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "requestedAt",
    header: "Requested",
    cell: ({ row }) => <span className="text-[#666666]">{formatDate(row.original.requestedAt)}</span>,
  },
  {
    accessorKey: "processedAt",
    header: "Processed",
    cell: ({ row }) => <span className="text-[#666666]">{formatDate(row.original.processedAt || undefined)}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.status === "requested" && (
          <>
            <Button
              type="button"
              size="sm"
              onClick={() => options.onApprove(row.original._id)}
              disabled={options.isMutating}
            >
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => options.onReject(row.original._id)}
              disabled={options.isMutating}
            >
              Reject
            </Button>
          </>
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-[#B95E82] border-[#B95E82]"
          onClick={() => options.onDelete(row.original._id)}
          disabled={options.isMutating}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
