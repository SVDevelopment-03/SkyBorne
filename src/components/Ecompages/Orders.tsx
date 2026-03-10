/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Loader2 } from 'lucide-react';
import { useGetAllOrdersQuery } from '@/store/api/orderApi';
import type { OrderStatus, PaymentStatus } from '@/store/api/orderApi';

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
  const [limit, setLimit] = useState(10);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all');

  // Fetch orders from backend with search and filters
  const { 
    data: ordersResponse, 
    isLoading, 
    error 
  } = useGetAllOrdersQuery({
    page,
    limit,
    search: searchTerm,
    status: fulfillmentFilter !== 'all' ? (fulfillmentFilter as OrderStatus) : undefined,
    paymentStatus: paymentFilter !== 'all' ? (paymentFilter as PaymentStatus) : undefined,
  });

  const orders = ordersResponse?.data || [];

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
          
          {/* <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap lg:flex-nowrap">
            <Filter className="w-5 h-5 text-[#707070]" />
            
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent text-[#707070]"
            >
              <option value="all">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
            
            <select
              value={fulfillmentFilter}
              onChange={(e) => {
                setFulfillmentFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent text-[#707070]"
            >
              <option value="all">All Fulfillment</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent text-[#707070]"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div> */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Total</th>
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
                      <td className="px-6 py-4 text-sm text-[#707070]">{order.shippingAddress?.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-[#707070]">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#333]">
                        ${order.totalAmount.toFixed(2)}
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
                        <Link 
                          href={`/orders/${order._id}`}
                          className="inline-flex items-center gap-1 text-[#B95E82] hover:text-[#A04D6F] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">View</span>
                        </Link>
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
    </div>
  );
}
