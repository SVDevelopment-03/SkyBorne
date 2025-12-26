/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Loader2,
  Loader,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  useGetTrainerStatsQuery,
  useGetTrainerEarningsListQueryQuery,
  type TrainerEarningsEntry,
  useGetTrainerEarningsSummaryQuery,
} from "@/store/api/trainerApi";
import MainListHeading from "@/components/ui/MainListHeading";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import { SearchIcon } from "@/icons/helpIcon";
import { Input2 } from "@/components/ui/input";
import { CommonSelect } from "@/components/ui/CountrySelect";
import CustomPagination from "@/components/ui/CustromPagination";

type PeriodType = "3months" | "6months" | "1year";
function TrainerEarnings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("6months");
  const [page, setPage] = useState(1);

  // RTK Query hooks
  const { data: statsData, isLoading: isLoadingStats } =
    useGetTrainerEarningsSummaryQuery(undefined);

  const { data: earningsData, isLoading: isLoadingHistory, isFetching } =
    useGetTrainerEarningsListQueryQuery({
      search: searchTerm,
      period: filterPeriod as PeriodType,
      page: page,
    });

  const totalPages = earningsData?.pagination?.totalPages || 1;

  // Parse data
  const stats:any = useMemo(() => statsData?.data || {}, [statsData]);
  const earnings = useMemo(
    () => earningsData?.earnings || [],
    [earningsData]
  );

  // Format currency utility
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100); // Convert from cents
  };

  // Format month utility
  const formatMonthYear = (month: string, year: number) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const periodOptions = [
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last 1 Year" },
  ];

  // Define table columns
  const columns: ColumnDef<TrainerEarningsEntry, unknown>[] = [
    {
      accessorKey: "month",
      header: "Period",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-[#1A1A1A]">
          {formatMonthYear(row.original.month, row.original.year)}
        </div>
      ),
    } as const,
    {
      accessorKey: "sessions",
      header: "Sessions",
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A] font-semibold">
          {row.original.sessions}
        </div>
      ),
    } as const,
    {
      accessorKey: "activeStudents",
      header: "Active Students",
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A] font-semibold">
          {row.original.activeStudents}
        </div>
      ),
    } as const,
    {
      accessorKey: "completionRate",
      header: "Completion Rate",
      cell: ({ row }) => (
        <Badge className="bg-[#27AE60]/10 text-[#27AE60] py-1!" style={{ borderRadius: "8px" }}>
          {row.original.completionRate}%
        </Badge>
      ),
    } as const,
    {
      accessorKey: "earnings",
      header: "Earnings",
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A] font-semibold">
          {formatCurrency(row.original.earnings)}
        </div>
      ),
    } as const,
  ];

  const isLoading = isLoadingHistory || isLoadingStats;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Earnings Management" />
        {/* <CommonBreadcrump
          title="Earnings Management"
          href="/trainer-earnings"
        /> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Earnings */}
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">Monthly Earnings</p>
                <p className="text-2xl text-[#1A1A1A] font-semibold">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(stats.monthlyEarnings?.value || 0)
                  )}
                </p>
                {stats.monthlyEarnings?.change !== undefined && (
                  <p className={`text-sm mt-1 ${
                    stats.monthlyEarnings.change >= 0
                      ? "text-[#27AE60]"
                      : "text-[#e74c3c]"
                  }`}>
                    {stats.monthlyEarnings.change >= 0 ? "+" : ""}
                    {stats.monthlyEarnings.change}% from last month
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions This Month */}
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">
                  Sessions This Month
                </p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats.sessionsThisMonth?.value || 0
                  )}
                </p>
                {stats.sessionsThisMonth?.change !== undefined && (
                  <p className={`text-sm mt-1 ${
                    stats.sessionsThisMonth.change >= 0
                      ? "text-[#27AE60]"
                      : "text-[#e74c3c]"
                  }`}>
                    {stats.sessionsThisMonth.change >= 0 ? "+" : ""}
                    {stats.sessionsThisMonth.change}% from last month
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Students */}
        {/* <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">Active Students</p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats.activeStudents?.value || 0
                  )}
                </p>
                {stats.activeStudents?.change !== undefined && (
                  <p className={`text-sm mt-1 ${
                    stats.activeStudents.change >= 0
                      ? "text-[#27AE60]"
                      : "text-[#e74c3c]"
                  }`}>
                    {stats.activeStudents.change >= 0 ? "+" : ""}
                    {stats.activeStudents.change}% from last month
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Completion Rate */}
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">Completion Rate</p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `${stats.completionRate?.value || 0}%`
                  )}
                </p>
                {stats.completionRate?.change !== undefined && (
                  <p className={`text-sm mt-1 ${
                    stats.completionRate.change >= 0
                      ? "text-[#27AE60]"
                      : "text-[#e74c3c]"
                  }`}>
                    {stats.completionRate.change >= 0 ? "+" : ""}
                    {stats.completionRate.change}% from last month
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Section */}
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Search and Filter */}
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input2
                placeholder="Search by month or year"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="search"
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] min-w-[260px] md:min-w-[450px] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>
            <div className="w-full">
              <CommonSelect
                label="Period"
                showLabel={false}
                options={periodOptions}
                cssProp="min-h-[45px]! min-w-[300px]!"
                value={filterPeriod}
                onChange={(e) => {
                  setFilterPeriod(e);
                  setPage(1);
                }}
              />
            </div>
          </div>
          
        </div>

        {/* Data Table */}
        <div className="flex flex-col w-full relative">
          {isFetching && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            </div>
          )}
          <DataTable
            columns={columns}
            data={earnings}
            isLoadingData={isLoadingHistory}
          />
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-4">
            <CustomPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
              visiblePages={3}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainerEarnings;