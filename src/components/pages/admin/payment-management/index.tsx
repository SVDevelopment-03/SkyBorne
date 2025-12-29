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
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
  Loader,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  useGetAdminPaymentStatsQuery,
  useGetAllPaymentsQuery,
  useGetPaymentStatsQuery,
} from "@/store/api/paymentApi";
import MainListHeading from "@/components/ui/MainListHeading";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import { SearchIcon } from "@/icons/helpIcon";
import { Input2 } from "@/components/ui/input";
import { CommonSelect } from "@/components/ui/CountrySelect";
import CustomPagination from "@/components/ui/CustromPagination";

export interface AdminPayment {
  _id: string;
  userId: string;
  username: string;
  email: string;
  orderRef: string;
  reference: string;
  amount: number;
  localAmount?: number;
  currency: string;
  plan: string;
  status: string;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
}

function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
    const [page, setPage] = useState(1);
  

  // RTK Query hooks for admin - get all payments
  const { data: paymentData, isLoading: isLoadingHistory,isFetching } =
    useGetAllPaymentsQuery({
      search: searchTerm,
      status: filterStatus !== "all" ? filterStatus : undefined,
      page: page,
    });

  const { data: paymentStatsData, isLoading: isLoadingStats } =
    useGetAdminPaymentStatsQuery(undefined);

  const totalPages = paymentData?.totalPages || 1;

  // Parse data from API responses
  const payments = useMemo(() => paymentData?.payments || [], [paymentData]);
  const stats = useMemo(
    () => paymentStatsData?.stats || {},
    [paymentStatsData]
  );

  // Format date utility
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency utility
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Format plan name utility
  const formatPlanName = (planName: string) => {
    if (!planName) return "";
    return planName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format status label utility
  const formatStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Truncate email utility
  const truncateEmail = (email: string) => {
    if (email.length > 30) return email.substring(0, 27) + "...";
    return email;
  };

  const paymentStatusOptions = [
    { value: "all", label: "All" },
    { value: "COMPLETED", label: "Completed" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
  ];

  // Define table columns
  const columns: ColumnDef<AdminPayment>[] = [
    {
      accessorKey: "orderRef",
      header: "Order Reference",
      cell: ({ row }) => (
        <div className="text-sm font-mono text-[#6B6B6B]">
          {row.original.orderRef}
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "User Name",
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A] font-medium">
          {row.original.username}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-[#6B6B6B]" title={row.original.email}>
          {truncateEmail(row.original.email)}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm text-[#6B6B6B]">
          {formatDate(row.original.createdAt)}
        </div>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A]">
          {formatPlanName(row.original.plan)}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A] font-semibold">
          {formatCurrency(row.original.amount, row.original.currency)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status.toUpperCase();
        const isCompleted = status === "COMPLETED";

        return (
          <Badge
            className={`py-1! ${
              isCompleted
                ? "bg-[#27AE60]/10 text-[#27AE60]"
                : status === "FAILED"
                ? "bg-[#e74c3c]/10 text-[#e74c3c]"
                : "bg-[#f4b942]/10 text-[#f4b942]"
            }`}
            style={{ borderRadius: "8px" }}
          >
            {isCompleted ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : status === "FAILED" ? (
              <XCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {formatStatusLabel(status)}
          </Badge>
        );
      },
    },
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <Button
    //       size="sm"
    //       variant="ghost"
    //       className="text-[#b95e82] hover:bg-[#b95e82]/10"
    //       onClick={() => {
    //         // TODO: Implement invoice download or view details
    //         console.log("View/Download invoice:", row.original._id);
    //       }}
    //     >
    //       <Download className="w-4 h-4" />
    //     </Button>
    //   ),
    // },
  ];

  const isLoading = isLoadingHistory || isLoadingStats;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Payment Management" />
        <CommonBreadcrump
          title="Payment Management"
          href="/payment-management"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">Total Revenue</p>
                <p className="text-2xl text-[#1A1A1A] font-semibold">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(stats.totalRevenue || 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">This Month</p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(stats.thisMonth || 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">
                  Total Transactions
                </p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats.totalCount || 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">Success Rate</p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `${stats.successRate ? stats.successRate.toFixed(1) : 0}%`
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Search and Create Button */}
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input2
                placeholder="Search by name or service"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="search"
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] min-w-[260px] md:min-w-[450px] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>
            <div className="w-full">
              <CommonSelect
                label="Payment Status"
                showLabel={false}
                options={paymentStatusOptions}
                cssProp="min-h-[45px]! min-w-[300px]!"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e)}
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex flex-col w-full relative">
           {(isFetching) && (
            <div className="col-span-full flex justify-center h-full absolute items-center w-full z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader className="w-8 h-8 animate-spin text-[#b95e82]" />
              </div>
            </div>
          )}
          <DataTable
            columns={columns}
            data={payments}
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

export default AdminPayments;
