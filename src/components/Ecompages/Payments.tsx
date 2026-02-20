/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Search, CreditCard, ExternalLink, Receipt, DollarSign, Calendar, CheckCircle, Loader2 } from "lucide-react";
import CustomPagination from "@/components/ui/CustromPagination";
import {
  useGetAllPaymentsQuery,
  useGetAdminEcomPaymentStatsQuery,
  type EcomPayment,
  type EcomPaymentStatus,
  type PopulatedUser,
} from "@/store/api/EcompaymentApi";

// ── Status Badge ───────────────────────────────────────────────────
const STATUS_STYLES: Record<EcomPaymentStatus, { pill: string; dot: string }> = {
  succeeded: { pill: "bg-green-50 text-green-700 border-green-200",  dot: "bg-green-500" },
  pending:   { pill: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
  failed:    { pill: "bg-red-50 text-red-700 border-red-200",         dot: "bg-red-500" },
  cancelled: { pill: "bg-gray-100 text-gray-600 border-gray-200",    dot: "bg-gray-400" },
  refunded:  { pill: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-500" },
};

function StatusBadge({ status }: { status: EcomPaymentStatus }) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.cancelled;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${styles.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
}

// ── Avatar Initials ────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[#B95E82]/15 flex items-center justify-center flex-shrink-0">
      <span className="text-[10px] font-bold text-[#B95E82]">{initials}</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function EcomPayments() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Debounce search → send to backend like Products does
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    setPage(1);
    clearTimeout((window as any).__paymentSearchTimer);
    (window as any).__paymentSearchTimer = setTimeout(() => setDebouncedSearch(val), 400);
  };

  const { data, isLoading, isFetching } = useGetAllPaymentsQuery({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter,
  });
  const { data: statsData, isLoading: isLoadingStats } = useGetAdminEcomPaymentStatsQuery();

  const payments: EcomPayment[] = (data as any)?.data ?? [];
  const totalPages: number = (data as any)?.pagination?.totalPages ?? 1;
  const total: number = (data as any)?.pagination?.total ?? 0;
  const stats = statsData?.stats || {
    totalRevenue: 0,
    thisMonth: 0,
    totalTransactions: 0,
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B95E82]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats */}
      <div className="w-full flex flex-wrap gap-4 justify-start">
        <div className="flex-[1_1_calc(33.333%-1rem)] min-w-[220px] max-w-full border border-[#e5e5e5] rounded-[20px] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-[#6B6B6B] mb-1">Total Revenue</p>
              <p className="text-2xl text-[#1A1A1A] font-semibold">
                {isLoadingStats ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  formatCurrency(stats.totalRevenue)
                )}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#b95e82]" />
            </div>
          </div>
        </div>

        <div className="flex-[1_1_calc(33.333%-1rem)] min-w-[220px] max-w-full border border-[#e5e5e5] rounded-[20px] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-[#6B6B6B] mb-1">This Month</p>
              <p className="text-2xl font-semibold text-[#1A1A1A]">
                {isLoadingStats ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  formatCurrency(stats.thisMonth)
                )}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#b95e82]" />
            </div>
          </div>
        </div>

        <div className="flex-[1_1_calc(33.333%-1rem)] min-w-[220px] max-w-full border border-[#e5e5e5] rounded-[20px] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-[#6B6B6B] mb-1">Total Transactions</p>
              <p className="text-2xl font-semibold text-[#1A1A1A]">
                {isLoadingStats ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats.totalTransactions || 0
                )}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#b95e82]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-3 py-6 md:p-6 bg-white rounded-lg overflow-x-hidden">

        {/* Header */}
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#222]">Payments</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {total > 0 ? `${total} transaction${total !== 1 ? "s" : ""}` : "No transactions yet"}
            </p>
          </div>

          {/* Summary chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["succeeded", "pending", "failed"] as EcomPaymentStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(statusFilter === s ? "" : s); setPage(1); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  statusFilter === s
                    ? STATUS_STYLES[s].pill + " ring-2 ring-offset-1 ring-[#B95E82]/30"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[s].dot}`} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search by order ref, name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F2F0ED80] border border-[#DCE5E0] rounded-[10px] text-sm text-gray-700 placeholder:text-[#929292] focus:outline-none focus:ring-2 focus:ring-[#B95E82]/20 focus:border-[#B95E82] transition-colors h-11"
            />
            {isFetching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#B95E82] border-t-transparent animate-spin" />
              </div>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-11 px-4 bg-[#F2F0ED80] border border-[#DCE5E0] rounded-[10px] text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#B95E82]/20 focus:border-[#B95E82] transition-colors"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="succeeded">Succeeded</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          {(debouncedSearch || statusFilter) && (
            <button
              onClick={() => { setSearchInput(""); setDebouncedSearch(""); setStatusFilter(""); setPage(1); }}
              className="h-11 px-4 text-sm text-gray-500 border border-gray-200 rounded-[10px] hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className={`w-full overflow-x-auto transition-opacity duration-150 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">Order Ref</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">Payment Intent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#929292] uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-400">No payments found</p>
                        <p className="text-xs text-gray-300 mt-0.5">
                          {debouncedSearch || statusFilter ? "Try adjusting your search or filters" : "Transactions will appear here"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const user = typeof payment.userId === "object" ? (payment.userId as PopulatedUser) : null;
                  const fullName = user ? `${user.firstName} ${user.lastName}` : null;

                  return (
                    <tr key={payment._id} className="hover:bg-gray-50/60 transition-colors group">

                      {/* Order Ref */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#B95E82]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#B95E82]/15 transition-colors">
                            <Receipt className="w-3.5 h-3.5 text-[#B95E82]" />
                          </div>
                          <span className="font-mono text-xs font-semibold text-[#333] tracking-tight">
                            {payment.orderRef}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        {fullName ? (
                          <div className="flex items-center gap-2.5">
                            <Avatar name={fullName} />
                            <div>
                              <p className="font-medium text-[#111] text-sm leading-tight">{fullName}</p>
                              <p className="text-xs text-gray-400 leading-tight mt-0.5">{user!.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-[#111]">
                            ${payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-medium">{payment.currency}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={payment.status} />
                      </td>

                      {/* Payment Intent */}
                      <td className="px-4 py-3.5 max-w-[170px]">
                        <span
                          className="font-mono text-xs text-gray-400 truncate block max-w-[150px]"
                          title={payment.stripePaymentIntentId}
                        >
                          {payment.stripePaymentIntentId}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-[#333]">
                            {new Date(payment.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(payment.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </td>

                      {/* Receipt */}
                      <td className="px-4 py-3.5">
                        {payment.receiptUrl ? (
                          <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#B95E82] bg-[#B95E82]/8 rounded-lg hover:bg-[#B95E82]/15 transition-colors"
                            title="View Receipt"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="relative w-full pt-4">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent md:hidden" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent md:hidden" />
            <div className="overflow-x-auto md:overflow-visible px-6">
              <div className="min-w-max md:min-w-0 flex justify-center">
                <CustomPagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  visiblePages={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
