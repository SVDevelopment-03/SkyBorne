"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoadingData?: boolean;
  children?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoadingData,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <>
      <Table className="relative border-separate rounded-[10px] border-spacing-y-[5px] first-row-gap">
        <TableHeader className="rounded-xl">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-[#FFE8E8] font-satoshi-700 hover:bg-[#FFE8E8] rounded-lg"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-5 py-4 first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                    <span className="font-bold text-black text-[17px]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <tbody>
          <tr className="h-3">
            <td colSpan={columns.length} />
          </tr>
        </tbody>
        <TableBody>
          {isLoadingData ? (
            <tr className="w-full rounded-lg">
              {columns.map((column) => (
                <td key={column.id} className="w-full first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                  <Skeleton className="w-full h-8 p-3" />
                </td>
              ))}
            </tr>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-x-8 border-transparent bg-[#F9F9F9] rounded-lg"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className=" py-4 px-5 font-satoshi-500 font-medium text-[1rem] leading-tight text-[#000000] first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollArea>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Separator></Separator>
    </>
  );
}
