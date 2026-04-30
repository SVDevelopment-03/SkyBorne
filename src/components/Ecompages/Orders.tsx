/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Loader2, RotateCcw, CalendarIcon, ChevronDown } from 'lucide-react';
import { addDays, format } from "date-fns";
import { useGetAllOrdersQuery, useRefundOrderMutation } from '@/store/api/orderApi';
import type { OrderStatus } from '@/store/api/orderApi';
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import toast from "react-hot-toast";

const paymentStatusColors: Record<string, string> = {
  'Paid': 'bg-green-100 text-green-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Failed': 'bg-red-100 text-red-700',
  'Refunded': 'bg-blue-100 text-blue-700',
};

const fulfillmentStatusColors: Record<string, string> = {
  'Delivered': 'bg-green-100 text-green-700',
  'Shipped': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-yellow-100 text-yellow-700',
  'Pending': 'bg-gray-100 text-gray-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'Cancelled': 'bg-red-100 text-red-700',
  'Refunded': 'bg-indigo-100 text-indigo-700',
};

export function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isSelectingRangeEnd, setIsSelectingRangeEnd] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [refundOrder, { isLoading: refunding }] = useRefundOrderMutation();

  // Fetch orders from backend with search and filters
  const { 
    data: ordersResponse, 
    isLoading, 
    error 
  } = useGetAllOrdersQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    status: fulfillmentFilter !== 'all' ? (fulfillmentFilter as OrderStatus) : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  const orders = ordersResponse?.data || [];
  const dateRangeLabel = dateRange?.from
    ? dateRange.to
      ? `From: ${format(dateRange.from, "dd/MM/yyyy")} - To: ${format(dateRange.to, "dd/MM/yyyy")}`
      : `From: ${format(dateRange.from, "dd/MM/yyyy")} - To: Select`
    : "Select date range";

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  // Get user name from order
  const getUserName = (order: any): string => {
    return order.shippingAddress?.fullName || 'Unknown Customer';
  };

  // Get error message safely
  const getErrorMessage = (): string => {
    if (error && typeof error === 'object' && 'data' in error) {
      const errorData = (error as any).data;
      return errorData?.message || 'Failed to load orders';
    }
    return 'Failed to load orders';
  };

  const handleRefundConfirm = async () => {
    if (!selectedOrder) return;
    try {
      await refundOrder({
        orderId: selectedOrder._id,
        amount: selectedOrder.totalAmount,
      }).unwrap();
      toast.success("Refund processed");
      setShowRefundModal(false);
      setSelectedOrder(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Refund failed");
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#333]">Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-700 font-medium">Error loading orders</p>
          <p className="text-red-600 text-sm mt-2">{getErrorMessage()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#333]">Orders</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID or customer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap lg:flex-nowrap">
            <Select
              value={fulfillmentFilter}
              onValueChange={(value) => {
                setFulfillmentFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full min-[380px]:w-[180px] h-10 rounded-xl border border-gray-200 text-[#707070] focus:ring-0 focus:border-gray-200">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="z-[80]">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center w-full min-[380px]:w-auto px-4 py-2 border border-gray-200 rounded-xl text-[#707070] bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent hover:text-[#707070] active:text-[#707070] focus:text-[#707070] hover:border-gray-200 active:border-gray-200 focus:border-gray-200 shadow-none transition-none"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{dateRangeLabel}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  classNames={{
                    range_start: "bg-[#B95E82]/20 rounded-l-md",
                    range_middle: "bg-[#F3DCE6] text-[#6B2E47] rounded-none",
                    range_end: "bg-[#B95E82]/20 rounded-r-md",
                    day_button:
                      "hover:bg-transparent! hover:text-inherit! hover:opacity-100! data-[range-start=true]:bg-[#B95E82]! data-[range-start=true]:text-white! data-[range-end=true]:bg-[#B95E82]! data-[range-end=true]:text-white! data-[range-middle=true]:bg-[#F3DCE6]! data-[range-middle=true]:text-[#6B2E47]!",
                  }}
                  onSelect={(range) => {
                    if (!range?.from) {
                      setDateRange(undefined);
                      setFromDate("");
                      setToDate("");
                      setIsSelectingRangeEnd(false);
                      setPage(1);
                      return;
                    }

                    // First click: keep calendar open and show an initial 2-day range hint.
                    if (!isSelectingRangeEnd) {
                      const hintedEnd = addDays(range.from, 1);
                      setDateRange({ from: range.from, to: hintedEnd });
                      setFromDate(format(range.from, "yyyy-MM-dd"));
                      setToDate(format(hintedEnd, "yyyy-MM-dd"));
                      setIsSelectingRangeEnd(true);
                      setPage(1);
                      return;
                    }

                    // Second click: finalize user's selected range and close.
                    const finalTo = range.to ?? range.from;
                    const normalizedTo =
                      finalTo && range.from && finalTo < range.from
                        ? range.from
                        : finalTo;

                    setDateRange({ from: range.from, to: normalizedTo });
                    setFromDate(format(range.from, "yyyy-MM-dd"));
                    setToDate(normalizedTo ? format(normalizedTo, "yyyy-MM-dd") : "");
                    setIsSelectingRangeEnd(false);
                    setPage(1);

                    if (range.from && normalizedTo) {
                      setTimeout(() => setDatePickerOpen(false), 100);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#B95E82] animate-spin" />
            <span className="ml-3 text-[#707070]">Loading orders...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#707070] text-lg">No orders found</p>
            <p className="text-[#999] text-sm mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Orders Table */}
        {!isLoading && orders.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Payment Intent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Tracking Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Fulfillment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#333]">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-[#707070]">{getUserName(order)}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-[#8A8A8A] break-all">
                          {order.stripePaymentIntentId || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#707070]">{order.shippingAddress?.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-[#707070]">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#333]">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#707070]">
                        {order.trackingNumber?.trim() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#707070]">
                        {order.shippingProvider?.trim() || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${fulfillmentStatusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link 
                            href={`/orders/${order._id}`}
                            className="inline-flex items-center gap-1 text-[#B95E82] hover:text-[#A04D6F] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">View</span>
                          </Link>
                          {order.orderStatus === "Cancelled" && order.paymentStatus === "Paid" && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowRefundModal(true);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Refund
                            </button>
                          )}
                          {order.paymentStatus === "Refunded" && (
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                              Refunded
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {ordersResponse?.pagination && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-[#707070]">
                  Showing {orders.length} of {ordersResponse.pagination.total} orders
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2 flex-wrap justify-center max-w-xs">
                    {ordersResponse.pagination.totalPages <= 7 ? (
                      Array.from({ length: ordersResponse.pagination.totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              pageNum === page
                                ? 'bg-[#B95E82] text-white'
                                : 'border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )
                    ) : (
                      <>
                        {page > 2 && (
                          <>
                            <button
                              onClick={() => setPage(1)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:bg-gray-50`}
                            >
                              1
                            </button>
                            {page > 3 && <span className="text-gray-400">...</span>}
                          </>
                        )}
                        {[Math.max(1, page - 1), page, Math.min(ordersResponse.pagination.totalPages, page + 1)].map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              pageNum === page
                                ? 'bg-[#B95E82] text-white'
                                : 'border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        {page < ordersResponse.pagination.totalPages - 1 && (
                          <>
                            {page < ordersResponse.pagination.totalPages - 2 && <span className="text-gray-400">...</span>}
                            <button
                              onClick={() => setPage(ordersResponse.pagination ? ordersResponse.pagination.totalPages : page)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:bg-gray-50`}
                            >
                              {ordersResponse.pagination?.totalPages}
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setPage(ordersResponse.pagination ? Math.min(ordersResponse.pagination.totalPages, page + 1) : page)}
                    disabled={!ordersResponse.pagination || page === ordersResponse.pagination.totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={showRefundModal}
        title="Refund this order?"
        message={`This will refund $${(selectedOrder?.totalAmount || 0).toFixed(2)} to the customer via Stripe.`}
        confirmText={refunding ? "Refunding..." : "Confirm Refund"}
        cancelText="Cancel"
        onConfirm={handleRefundConfirm}
        onCancel={() => {
          setShowRefundModal(false);
          setSelectedOrder(null);
        }}
        variant="warning"
      />
    </div>
  );
}
