/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { Toggle2 } from "@/components/ui/Toggle2";
import { Trash2, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  cancelledAt?: string;
  plan: string;
  userId: string;
  status: "active" | "inactive";
}

export const columns = (
  handleStatusToggle: (id: string, currentStatus: "active" | "inactive") => Promise<void>,
  handleAction: (id: string, plan: string) => void
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
    header: "Requested At",
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "cancelledAt",
    header: "Cancelled At",
    cell: ({ row }) => <span>{row.original.cancelledAt ? formatDate(row.original.cancelledAt) : "—"}</span>,
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
     cell: ({ row }) => {
      console.log("row", row.original);
      
      return(
        <div className="flex gap-3">
          <Button
            variant="outlineCancel"
            size="sm"
            onClick={() => handleAction(row.original.userId,row?.original?.plan)}
            className="rounded-lg "
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </div>
      )},
  },
];
