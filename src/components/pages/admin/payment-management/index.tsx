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
  FileDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  useGetAdminPaymentStatsQuery,
  useGetAllPaymentsQuery,
  useExportPaymentsCSVMutation,
} from "@/store/api/paymentApi";
import MainListHeading from "@/components/ui/MainListHeading";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import { SearchIcon } from "@/icons/helpIcon";
import { Input2 } from "@/components/ui/input";
import { CommonSelect } from "@/components/ui/CountrySelect";
import CustomPagination from "@/components/ui/CustromPagination";
import countryList from "react-select-country-list";
import toast from "react-hot-toast";

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
  stripeSubscriptionId: string;
  plan: string;
  status: string;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  country?: string;
}

function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [page, setPage] = useState(1);

  // RTK Query hooks
  const {
    data: paymentData,
    isLoading: isLoadingHistory,
    isFetching,
  } = useGetAllPaymentsQuery({
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : undefined,
    country: filterCountry !== "all" ? filterCountry : undefined,
    page: page,
  });

  const { data: paymentStatsData, isLoading: isLoadingStats } =
    useGetAdminPaymentStatsQuery(undefined);

  const [exportCSV, { isLoading: isExporting }] = useExportPaymentsCSVMutation();

  const totalPages = paymentData?.totalPages || 1;

  // Parse data from API responses
  const payments = useMemo(() => paymentData?.payments || [], [paymentData]);
  const stats = useMemo(
    () => paymentStatsData?.stats || {},
    [paymentStatsData],
  );

  // Get country options
  const countryOptions = useMemo(() => {
    const countries = countryList().getData();
    return [
      { value: "all", label: "All Countries" },
      ...countries.map((c) => ({
        value: c.value.toUpperCase(),
        label: c.label,
      })),
    ];
  }, []);

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

  // Download CSV function using API
  const downloadCSV = async () => {
    try {
      const params: any = {
        search: searchTerm || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        country: filterCountry !== "all" ? filterCountry : undefined,
      };

      // Get CSV text from API
      const csvText = await exportCSV(params).unwrap();

      // Create blob from text
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `payments_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("CSV exported successfully");
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(error?.data?.message || error?.message || "Failed to export CSV");
    }
  };

  // Define table columns
  const columns: ColumnDef<AdminPayment>[] = [
    {
      accessorKey: "stripeSubscriptionId",
      header: "Subscription Id",
      cell: ({ row }) => (
        <div className="text-sm font-mono text-[#6B6B6B]">
          {row?.original?.stripeSubscriptionId}
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
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A]">
          {row.original.country || "N/A"}
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

      {/* Stats Cards */}
      <div className="w-full flex flex-wrap gap-4 justify-start">
        {/* Card 1 */}
        <Card className="flex-[1_1_calc(25%-1rem)] min-w-[220px] max-w-full border-[#e5e5e5] rounded-[20px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">Total Revenue</p>
                <p className="text-2xl text-[#1A1A1A] font-semibold">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(stats?.totalRevenue || 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="flex-[1_1_calc(25%-1rem)] min-w-[220px] max-w-full border-[#e5e5e5] rounded-[20px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">This Month</p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(stats?.thisMonth || 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="flex-[1_1_calc(25%-1rem)] min-w-[220px] max-w-full border-[#e5e5e5] rounded-[20px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">Total Transactions</p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats?.completedCount || 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="flex-[1_1_calc(25%-1rem)] min-w-[220px] max-w-full border-[#e5e5e5] rounded-[20px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-[#6B6B6B] mb-1">Total Subscriptions</p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stats.activeSubscriptions || 0
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



      {/* Main Content */}
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
        {/* Search, Filters and Export Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full flex-wrap">
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px] md:min-w-[300px]">
              <Input2
                placeholder="Search by name or service"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                name="search"
                className="bg-[#F2F0ED80]! text-black border border-[#DCE5E0] shadow-[0px_1px_2px_0px_#0000000D] h-11 rounded-[10px] pl-[41px] pt-1.5 md:text-base! placeholder:text-[#929292]!"
              />
              <SearchIcon />
            </div>
            
            {/* Country Filter */}
            <div className="w-full md:w-auto min-w-[150px]">
              <CommonSelect
                label="Country"
                showLabel={false}
                options={countryOptions}
                cssProp="min-h-[45px]! md:min-w-[200px]!"
                value={filterCountry}
                onChange={(e) => {
                  setFilterCountry(e);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Download CSV Button */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <Button
              onClick={downloadCSV}
              variant="themeRegular"
              className="rounded-[10px] py-3! w-full md:w-auto"
              disabled={isExporting || payments.length === 0}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              Download CSV
            </Button>
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