import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

const formatDateTime = (isoDate?: string | null) => {
  if (!isoDate) return "—";

  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatusLabel = (status: "processing" | "cancelled") =>
  status.charAt(0).toUpperCase() + status.slice(1);

export interface RecurringFailureRow {
  _id: string;
  serialNumber: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  subscriptionId: string;
  invoiceId: string;
  status: "processing" | "cancelled";
  failedAt?: string | null;
  createdAt?: string | null;
}

export const columns: ColumnDef<RecurringFailureRow>[] = [
  {
    accessorKey: "serialNumber",
    header: "S.No.",
    cell: ({ row }) => <span>{row.original.serialNumber}</span>,
  },
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-[#1A1A1A]">{row.original.fullName}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-[#6B6B6B]" title={row.original.email}>
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <div className="text-[#6B6B6B]">{row.original.phoneNumber}</div>
    ),
  },
  {
    accessorKey: "subscriptionId",
    header: "Subscription Id",
    cell: ({ row }) => (
      <div className="font-mono text-sm text-[#6B6B6B]">
        {row.original.subscriptionId}
      </div>
    ),
  },
  {
    accessorKey: "invoiceId",
    header: "Invoice Id",
    cell: ({ row }) => (
      <div className="font-mono text-sm text-[#6B6B6B]">{row.original.invoiceId}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isCancelled = status === "cancelled";

      return (
        <Badge
          className={`py-1! px-3! text-xs font-medium ${
            isCancelled ? "bg-[#e74c3c]/10 text-[#e74c3c]" : "bg-[#f4b942]/10 text-[#f4b942]"
          }`}
          style={{ borderRadius: "8px" }}
        >
          {formatStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "failedAt",
    header: "Failed At",
    cell: ({ row }) => (
      <span className="text-[#6B6B6B]">{formatDateTime(row.original.failedAt)}</span>
    ),
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   cell: ({ row }) => (
  //     <span className="text-[#6B6B6B]">{formatDateTime(row.original.createdAt)}</span>
  //   ),
  // },
];
