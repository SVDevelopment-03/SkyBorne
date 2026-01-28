/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { Toggle2 } from "@/components/ui/Toggle2";
import { Trash2 } from "lucide-react";

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  return isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export interface CancelSubscriptionRow {
  _id: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
  plan: string;
  status: "active" | "inactive";
}

export const columns = (
  handleStatusToggle: (id: string, currentStatus: "active" | "inactive") => Promise<void>,
  handleAction: (id: string) => void
): ColumnDef<CancelSubscriptionRow>[] => [
  {
    id: "serial",
    header: "S.No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-sm text-gray-500">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span>{row.original.description || "—"}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => <span>{row.original.plan}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className={row.original.status === "active" ? "text-green-600" : "text-red-600"}>
          {row.original.status === "active" ? "Pending" : "Cancelled"}
        </span>
      </div>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <button
        className="text-red-500 hover:text-red-700 transition-colors"
        onClick={() => handleAction(row.original._id, row.original.name)}
        title="Delete"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    )
  },
];
