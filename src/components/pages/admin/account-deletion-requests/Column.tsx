import { ColumnDef } from "@tanstack/react-table";

export interface AccountDeletionRequestRow {
  _id: string;
  fullName: string;
  email: string;
  reason?: string;
  status: "requested" | "processed";
  requestedAt: string;
  processedAt?: string | null;
  gateway?: string;
  plan?: string | null;
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

export const columns: ColumnDef<AccountDeletionRequestRow>[] = [
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
      const isProcessed = row.original.status === "processed";
      return (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
            isProcessed
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {row.original.status}
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
    header: "Processed At",
    cell: ({ row }) => (
      <span className="text-[#666666]">{formatDate(row.original.processedAt)}</span>
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
];
