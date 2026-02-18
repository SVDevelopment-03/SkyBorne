'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Loader2 } from 'lucide-react';
import { useGetAllCustomersQuery } from '@/store/api/customerApi';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: customersResponse, isLoading, isError, error } = useGetAllCustomersQuery({
    page,
    limit,
    search: searchTerm,
  });

  const customers = customersResponse?.data || [];

  console.log('🔵 Customers Response:', customersResponse);
  console.log('🔵 Customers Data:', customers);
  console.log('🔵 Is Loading:', isLoading);
  console.log('🔵 Error:', error);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  // Get error message safely
  const getErrorMessage = (): string => {
    if (error && typeof error === 'object' && 'data' in error) {
      const errorData = (error as any).data;
      return errorData?.message || 'Failed to load customers';
    }
    return 'Failed to load customers';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#333]">Customers</h1>
        <p className="text-[#707070] mt-1">
          Manage and view all customer information
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
            />
          </div>

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
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#B95E82] animate-spin" />
            <span className="ml-3 text-[#707070]">Loading customers...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-12 text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 inline-block">
              <p className="text-red-700 font-medium">Failed to load customers</p>
              <p className="text-red-600 text-sm mt-2">
                {getErrorMessage()}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            {customers.length > 0 ? (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Last Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {customers.map((customer: any) => (
                      <tr
                        key={customer._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-[#333]">
                          {(customer.userId?.firstName || '') + ' ' + (customer.userId?.lastName || '')}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#707070]">
                          {customer.userId?.email || 'N/A'}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#707070]">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            {customer.totalOrders || 0}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-[#333]">
                          {formatCurrency(customer.totalSpent || 0)}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#707070]">
                          {formatDate(customer.lastOrderAt)}
                        </td>

                        <td className="px-6 py-4">
                          <Link
                            href={`/customers/${customer._id}`}
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

                {/* Pagination Info and Controls */}
                {customersResponse?.pagination && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#707070]">
                      Showing {customers.length} of {customersResponse.pagination.total} customers
                    </p>
                    <div className="flex gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {customersResponse.pagination.totalPages <= 7 ? (
                          Array.from(
                            { length: customersResponse.pagination.totalPages },
                            (_, i) => i + 1
                          ).map((pageNum) => (
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
                          ))
                        ) : (
                          <>
                            {page > 2 && (
                              <>
                                <button
                                  onClick={() => setPage(1)}
                                  className="px-3 py-1 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50"
                                >
                                  1
                                </button>
                                {page > 3 && <span className="text-gray-400">...</span>}
                              </>
                            )}
                            {[
                              Math.max(1, page - 1),
                              page,
                              Math.min(customersResponse.pagination.totalPages, page + 1),
                            ].map((pageNum) => (
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
                            {page < customersResponse.pagination.totalPages - 1 && (
                              <>
                                {page < customersResponse.pagination.totalPages - 2 && (
                                  <span className="text-gray-400">...</span>
                                )}
                                <button
                                  onClick={() => setPage(customersResponse.pagination?.totalPages || 1)}
                                  className="px-3 py-1 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50"
                                >
                                  {customersResponse.pagination?.totalPages}
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setPage(
                            Math.min(customersResponse.pagination?.totalPages || 1, page + 1)
                          )
                        }
                        disabled={page === customersResponse.pagination?.totalPages}
                        className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-[#707070] text-lg">No customers found</p>
                <p className="text-[#999] text-sm mt-2">
                  {customersResponse?.data?.length === 0
                    ? 'No customers exist yet'
                    : 'Try adjusting your search terms'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}