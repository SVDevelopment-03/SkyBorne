

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ColumnDef } from "@tanstack/react-table";
import { Toggle2 } from "@/components/ui/Toggle2";

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "—";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


export interface UserRowData {
  _id: string;
  name: string;
  email: string;
  plan?: string;
  subscriptionStatus?: string;
  cancelledAt?: string | null;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  status: "active" | "inactive";
  createdAt : string;
}

export const columns = (
  handleStatusToggle: (
    userId: string,
    currentStatus: "active" | "inactive"
  ) => Promise<void>
): ColumnDef<UserRowData>[] => [
  {
    id: "serial",
    header: "S.No.",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-[16px] font-satoshi-500">
          {row.original.name}
        </span>
        <span className="text-sm text-[#666666]">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500 text-[#666666]">
        {row.original.phone || "—"}
      </div>
    ),
  },
   {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }:any) =>

      {
        return (
          <span className="text-[#666666]">
            {formatDate(row.original.createdAt)}
          </span>
      )}
    },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500 text-[#666666]">
        {row.original.country || "—"}
      </div>
    ),
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500 text-[#666666]">
        {row.original.state || "—"}
      </div>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500 text-[#666666]">
        {row.original.city || "—"}
      </div>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <span className="bg-[#E8F0FF] text-[#335CFF] px-3 py-1 rounded-full text-sm">
        {row.original.plan || "Free"}
      </span>
    ),
  },
  {
    accessorKey: "subscriptionStatus",
    header: "Subscription Status",
    cell: ({ row }) => {
      const rawStatus = String(row.original.subscriptionStatus || "N/A");
      const normalized = rawStatus.toLowerCase();

      const statusClass =
        normalized === "active"
          ? "bg-[#E9F9EF] text-[#1C9C56]"
          : normalized === "cancelled" || normalized === "canceled"
            ? "bg-[#FDECEC] text-[#D14343]"
            : normalized === "expired" || normalized === "inactive"
              ? "bg-[#F5F5F5] text-[#666666]"
              : normalized === "suspended"
                ? "bg-[#FFF5E8] text-[#CC7A00]"
                : "bg-[#F5F5F5] text-[#666666]";

      return (
        <span className={`px-3 py-1 rounded-full text-sm capitalize ${statusClass}`}>
          {rawStatus}
        </span>
      );
    },
  },
  {
    accessorKey: "cancelledAt",
    header: "Cancelled At",
    cell: ({ row }) => (
      <span className="text-[#666666]">
        {formatDate(row.original.cancelledAt || undefined)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Toggle2
          checked={row.original.status === "active"}
          onChange={() =>
            handleStatusToggle(row.original._id, row.original.status)
          }
        />
        <span
          className={`text-sm font-medium ${
            row.original.status === "active"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {row.original.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
];
