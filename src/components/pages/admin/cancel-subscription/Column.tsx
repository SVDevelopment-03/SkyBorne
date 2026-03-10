import { ColumnDef } from "@tanstack/react-table";
import { Flag } from "lucide-react";
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
  phoneNumber: string;
  country: string;
  subscribedAt?: string;
  description: string;
  adminComment?: string;
  createdAt: string;
  cancelledAt?: string;
  plan: string;
  userId: string;
  status: "pending" | "retained" | "cancelled";
}

export const columns = (
  handleAction: (id: string, plan: string) => void,
  handleOpenTextModal: (title: string, content: string) => void
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
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => <span>{row.original.phoneNumber || "N/A"}</span>,
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => <span>{row.original.country || "N/A"}</span>,
  },
  {
    accessorKey: "subscribedAt",
    header: "Subscribed At",
    cell: ({ row }) => <span>{row.original.subscribedAt ? formatDate(row.original.subscribedAt) : "—"}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.original.description || "—";
      const shortDesc = desc.length > 40 ? `${desc.slice(0, 40)}...` : desc;
      const hasDescription = desc !== "—";

      return (
        <button
          type="button"
          className={`text-left ${hasDescription ? "text-blue-600 hover:underline" : "text-gray-500 cursor-default"}`}
          onClick={() => hasDescription && handleOpenTextModal("Description", desc)}
          disabled={!hasDescription}
        >
          {shortDesc}
        </button>
      );
    },
  },
  {
    accessorKey: "adminComment",
    header: "Admin Comment",
    cell: ({ row }) => {
      const comment = row.original.adminComment || "—";
      const shortComment = comment.length > 40 ? `${comment.slice(0, 40)}...` : comment;
      const hasComment = comment !== "—";

      return (
        <button
          type="button"
          className={`text-left ${hasComment ? "text-blue-600 hover:underline" : "text-gray-500 cursor-default"}`}
          onClick={() => hasComment && handleOpenTextModal("Admin Comment", comment)}
          disabled={!hasComment}
        >
          {shortComment}
        </button>
      );
    },
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
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColor =
        status === "pending"
          ? "text-amber-600"
          : status === "retained"
          ? "text-emerald-600"
          : "text-red-600";

      return (
        <div className="flex items-center gap-2">
          <span className={statusColor}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
     cell: ({ row }) => {
      if (row.original.status === "retained" || row.original.status === "cancelled") {
        return <span className="text-gray-400">—</span>;
      }

      return(
        <div className="flex gap-3">
          <Button
            variant="outlineCancel"
            size="sm"
            onClick={() => handleAction(row.original.userId,row?.original?.plan)}
            className="rounded-lg "
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      )},
  },
];
