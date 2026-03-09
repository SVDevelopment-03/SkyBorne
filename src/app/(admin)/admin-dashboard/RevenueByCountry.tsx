"use client";

import React, { useMemo, useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import {
  useGetRevenueByCountryQuery,
  type CountryRevenueRow,
} from "@/store/api/adminApi";
import { Typography } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RevenueRowLike = CountryRevenueRow & {
  user?: number | string;
  users?: number | string;
};

const getActiveUsersCount = (row: RevenueRowLike | null | undefined): number => {
  const value = row?.activeUsers ?? row?.user ?? row?.users;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const RevenueByCountryTable = () => {
  const { data, isLoading, error } = useGetRevenueByCountryQuery();
  const [isExporting, setIsExporting] = useState(false);

  const tableData = data?.data;

  const totalActiveUsers = useMemo(() => {
    if (!tableData) return 0;

    const hasGrandTotalActiveUsers =
      tableData.grandTotal &&
      Object.prototype.hasOwnProperty.call(tableData.grandTotal, "activeUsers");

    if (hasGrandTotalActiveUsers) {
      return getActiveUsersCount(tableData.grandTotal);
    }

    return (tableData.rows || []).reduce(
      (sum: number, row) => sum + getActiveUsersCount(row),
      0,
    );
  }, [tableData]);

  const columns = [
    { id: "country", label: "Country" },
    { id: "user", label: "Active User" },
    { id: "count", label: "Invoice Count" },
    { id: "amount", label: "Amount" },
  ];

  const downloadCSV = async () => {
    if (!tableData || tableData.rows.length === 0) return;

    setIsExporting(true);
    try {
      // Create CSV headers
      const headers = ["Country", "Active User", "Count", "Amount"];

      // Create CSV rows from data
      const csvRows = tableData.rows.map((row) => [
        `"${row.country}"`, // Wrap country in quotes to handle special characters
        getActiveUsersCount(row),
        row.count,
        `$${row.amount.toFixed(2)}`,
      ]);

      // Add grand total row
      csvRows.push([
        `"${tableData.grandTotal.country}"`,
        totalActiveUsers,
        tableData.grandTotal.count,
        `$${tableData.grandTotal.amount.toFixed(2)}`,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `revenue-by-country-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 max-h-[450px] overflow-y-auto [scrollbar-width:thin]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Revenue by Country
          </h2>
          <p className="text-gray-600 text-sm">
            Complete payment analysis by user location
          </p>
        </div>
        <Button
          onClick={downloadCSV}
          variant="themeRegular"
          className="rounded-[10px] py-3! max-w-36"
          disabled={isExporting || !tableData || tableData.rows.length === 0}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          Download
        </Button>
      </div>

      {isLoading ? (
        <>
          <Table className="relative border-separate rounded-[10px] border-spacing-y-[5px]">
            <TableHeader>
              <TableRow className="bg-[#FFE8E8] font-satoshi-700 hover:bg-[#FFE8E8] rounded-lg">
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className="px-5 py-4 first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg"
                  >
                    <span className="font-bold text-black text-[17px]">
                      {column.label}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <tbody>
              <tr className="h-3">
                <td colSpan={columns.length} />
              </tr>
            </tbody>
            <TableBody>
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="w-full rounded-lg">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className="w-full first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg"
                    >
                      <Skeleton className="w-full h-8 p-3" />
                    </td>
                  ))}
                </tr>
              ))}
            </TableBody>
          </Table>
        </>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Failed to load revenue data</p>
        </div>
      ) : tableData && tableData.rows.length > 0 ? (
        <Table className="relative border-separate rounded-[10px] border-spacing-y-[5px] first-row-gap">
          <TableHeader className="rounded-xl">
            <TableRow className="bg-[#FFE8E8] font-satoshi-700 hover:bg-[#FFE8E8] rounded-lg">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className="px-5 py-4 first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg"
                >
                  <span className="font-bold text-black text-[17px]">
                    {column.label}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <tbody>
            <tr className="h-3">
              <td colSpan={columns.length} />
            </tr>
          </tbody>
          <TableBody>
            {/* Data rows */}
            {tableData.rows.map((row, idx) => (
              <TableRow
                key={idx}
                className="border-x-8 border-transparent bg-[#F9F9F9] rounded-lg hover:bg-[#F5F5F5] transition-colors"
              >
                <TableCell className="py-4 px-5 font-satoshi-500 font-medium text-[1rem] leading-tight text-[#000000] first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                  {row.country?.slice(0, 32)}
                </TableCell>
                <TableCell className="py-4 px-5 font-satoshi-500 font-medium text-[1rem] leading-tight text-[#000000] first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                  {getActiveUsersCount(row)}
                </TableCell>
                <TableCell className="py-4 px-5 font-satoshi-500 font-medium text-[1rem] leading-tight text-[#000000] first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                  {row.count}
                </TableCell>
                <TableCell className="py-4 px-5 font-satoshi-500 font-medium text-[1rem] leading-tight text-[#000000]  first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                  ${row.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}

            {/* Grand Total row */}
            {tableData.grandTotal && (
              <>
                <tr className="h-3">
                  <td colSpan={columns.length} />
                </tr>
                <TableRow className="border-x-8 border-transparent bg-[#FFE8E8] rounded-lg">
                  <TableCell className="py-4 px-5 font-satoshi-700 font-bold text-[1rem] leading-tight text-[#000000] first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                    {tableData.grandTotal.country}
                  </TableCell>
                    <TableCell className="py-4 px-5 font-satoshi-700 font-bold text-[1rem] leading-tight text-[#000000] first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                    {totalActiveUsers}
                  </TableCell>
                  <TableCell className="py-4 px-5 font-satoshi-700 font-bold text-[1rem] leading-tight text-[#000000] first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                    {tableData.grandTotal.count}
                  </TableCell>
                  <TableCell className="py-4 px-5 font-satoshi-700 font-bold text-[1rem] leading-tight text-[#000000] first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg">
                    ${tableData.grandTotal.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      ) : (
        <Table className="relative border-separate rounded-[10px] border-spacing-y-[5px]">
          <TableHeader>
            <TableRow className="bg-[#FFE8E8] font-satoshi-700 hover:bg-[#FFE8E8] rounded-lg">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className="px-5 py-4 first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg"
                >
                  <span className="font-bold text-black text-[17px]">
                    {column.label}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Typography title="No Record found" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default RevenueByCountryTable;
