// ============================================================================
// TrainerColumn.tsx (Column Definitions)
// ============================================================================
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2Icon, EditIcon } from "lucide-react";

export type TrainerData = {
  _id: string;
  name: string;
  specialization: string;
  experience?: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const columns = (
  onEdit: (trainer: TrainerData) => void,
  onDelete: (id: string) => void
): ColumnDef<TrainerData>[] => [
  {
  id: "serial",
  header: "ID",
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
      <div className="text-[16px] font-satoshi-500">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "experience",
    header: "Experience (Years)",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.getValue("experience") || "0"} years
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original)}
          className="rounded-lg"
        >
          <EditIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(row.original._id)}
          className="rounded-lg bg-[#b95e82]"
        >
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];