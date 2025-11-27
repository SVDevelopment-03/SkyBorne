import { BadgeIcon } from "@/icons/helpIcon";
import { ColumnDef } from "@tanstack/react-table";
export type UserData = {
  id: string;
  sessionName: string;
  date: string;
  duration: string;
  status: string;
  badge?: boolean; // or string if badge name
};


export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "sessionName",
    header: "Session Name",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.getValue("sessionName")}
      </div>
    ),
  },

  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.getValue("date")}
      </div>
    ),
  },

  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.getValue("duration")}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.getValue("status")}
      </div>
    ),
  },

  {
    accessorKey: "badge",
    header: "Badges",
    cell: ({ row }) => {
      const hasBadge = row.getValue("badge");

      return (
        <div className="flex items-center justify-center h-full max-h-[20px]">
          {hasBadge ? <BadgeIcon /> : "-"}
        </div>
      );
    },
  },
];
