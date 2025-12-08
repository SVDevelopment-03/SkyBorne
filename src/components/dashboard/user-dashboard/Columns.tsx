import { BadgeIcon } from "@/icons/helpIcon";
import { toTitleCase } from "@/utils/Titlecase";
import { ColumnDef } from "@tanstack/react-table";
export type UserData = {
  id: string;
  sessionName: string;
  meeting:{
    title:string
  }
  date: string;
  duration: string;
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
    header: "Date",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.getValue("joinedAt")}
      </div>
    ),
  },

  {
    accessorKey: "totalDuration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.getValue("joinedAt")}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {toTitleCase(row.getValue("status") as string) }
      </div>
    ),
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
