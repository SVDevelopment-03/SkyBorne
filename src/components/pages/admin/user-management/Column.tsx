
import { ColumnDef } from "@tanstack/react-table";
import { Toggle2 } from "@/components/ui/Toggle2";

export interface UserRowData {
  _id: string;
  name: string;
  email: string;
  plan?: string;
  phone?: string;
  country?: string;
  status: "active" | "inactive" | "blocked";
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
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500 uppercase text-[#666666]">
        {row.original.country || "—"}
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
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2">
  //       <Toggle2
  //         checked={row.original.status === "active"}
  //         onChange={() =>
  //           handleStatusToggle(row.original._id, row.original.status)
  //         }
  //       />
  //       <span
  //         className={`text-sm font-medium ${
  //           row.original.status === "active"
  //             ? "text-green-600"
  //             : "text-red-600"
  //         }`}
  //       >
  //         {row.original.status === "active" ? "Active" : "Inactive"}
  //       </span>
  //     </div>
  //   ),
  // },
];



















