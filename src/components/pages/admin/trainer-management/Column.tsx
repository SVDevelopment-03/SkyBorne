// ============================================================================
// TrainerColumn.tsx (Column Definitions)
// ============================================================================
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2Icon, EditIcon } from "lucide-react";
import { parsePhoneNumber } from "react-phone-number-input";
import { TrainerData } from "@/store/api/trainerApi";

export const columns = (
  onEdit: (trainer: TrainerData) => void,
  onDelete: (id: string) => void
): ColumnDef<TrainerData>[] => [
  {
    id: "serial",
    header: "S.No.",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        <div className="flex items-center gap-3">
          {/* {image && (
            <img
              src={image}
              alt={row.getValue("name")}
              className="w-8 h-8 rounded-full object-cover"
            />
          )} */}
          <span className="text-[16px] font-satoshi-500">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500 text-[#666666]">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => {
      const specialization =
        row.getValue<TrainerData["specialization"]>("specialization");
      return (
        <div className="text-[16px] font-satoshi-500">
          <span className="bg-[#FFE8E8] text-[#c1336b] px-3 py-1 rounded-full text-sm">
            {specialization?.title}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        {row.getValue("experience")} years
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phoneNumber") as string;
      let formattedPhone = phoneNumber;

      try {
        const parsed = parsePhoneNumber(phoneNumber);
        console.log("parsed", parsed);

        if (parsed) {
          const countryCode = parsed.countryCallingCode;
          const nationalNumber = parsed.nationalNumber;
          formattedPhone = `+${countryCode} ${nationalNumber}`;
        }
      } catch (error) {
        formattedPhone = phoneNumber;
      }

      return (
        <div className="text-[16px] font-satoshi-500 text-[#666666]">
          {formattedPhone}
        </div>
      );
    },
  },
  {
    accessorKey: "charges",
    header: "Charges",
    cell: ({ row }) => (
      <div className="text-[16px] font-satoshi-500">
        ${row.getValue("charges")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="theme"
          size="sm"
          onClick={() => onEdit(row.original)}
          className="rounded-lg"
        >
          <EditIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outlineCancel"
          size="sm"
          onClick={() => onDelete(row.original._id)}
          className="rounded-lg "
        >
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
