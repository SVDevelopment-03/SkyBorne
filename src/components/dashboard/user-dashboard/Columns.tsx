import { toTitleCase } from "@/utils/Titlecase";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
export type UserData = {
  id: string;
  sessionName: string;
  meeting:{
    title:string
  }
  date: string;
  duration: string;
  totalDuration?: number;
  status: string;
  badge?: boolean; // or string if badge name
};


export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "meeting",
    header: "Session Name",
    cell: ({ row }) => {
    const sessionName = row?.original?.meeting?.title;
      return (
      <div className="text-[16px] font-satoshi-500">
        {sessionName}
      </div>
    )},
  },

{
  accessorKey: "joinedAt",
  header: "Joined At",
  cell: ({ row }) => {
    const date = new Date(row.getValue("joinedAt"));
    return format(date, "d LLL, yyyy"); // → "8 Dec, 2025"
  },
},

  // {
  //   accessorKey: "totalDuration",
  //   header: "Duration",
  //   cell: ({ row }) => (
  //     <div className="text-[16px] font-satoshi-500">
  //       {row.getValue("totalDuration")}
  //     </div>
  //   ),
  // },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status= row.getValue("status") as string;
      return (
      <div className="text-[16px] font-satoshi-500">
        {toTitleCase(status=="joined"? "completed":status) }
      </div>
    )},
  },

  {
    accessorKey: "totalDuration",
    header: "Duration",
    cell: ({ row }) => {
      const value = row.getValue("totalDuration");
      const duration =
        typeof value === "number" ? value : Number(value || 0);

      return (
        <div className="text-[16px] font-satoshi-500">
          {`${duration} min`}
        </div>
      );
    },
  },

  // {
  //   accessorKey: "badge",
  //   header: "Badges",
  //   cell: ({ row }) => {
  //     const hasBadge = row.getValue("badge");

  //     return (
  //       <div className="flex items-center justify-center h-full max-h-[20px]">
  //         {hasBadge ? <BadgeIcon /> : "-"}
  //       </div>
  //     );
  //   },
  // },
];
