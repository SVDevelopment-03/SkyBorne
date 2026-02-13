'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Eye } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    ordersCount: 12,
    totalSpent: 1245.0,
    lastOrder: '2026-02-11',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@example.com',
    ordersCount: 8,
    totalSpent: 892.5,
    lastOrder: '2026-02-11',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    ordersCount: 15,
    totalSpent: 2140.0,
    lastOrder: '2026-02-10',
  },
  {
    id: '4',
    name: 'James Brown',
    email: 'jbrown@example.com',
    ordersCount: 5,
    totalSpent: 567.75,
    lastOrder: '2026-02-10',
  },
  {
    id: '5',
    name: 'Olivia Davis',
    email: 'olivia.d@example.com',
    ordersCount: 18,
    totalSpent: 3428.0,
    lastOrder: '2026-02-09',
  },
  {
    id: '6',
    name: 'William Taylor',
    email: 'wtaylor@example.com',
    ordersCount: 3,
    totalSpent: 299.99,
    lastOrder: '2026-02-09',
  },
  {
    id: '7',
    name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    ordersCount: 10,
    totalSpent: 1275.5,
    lastOrder: '2026-02-08',
  },
  {
    id: '8',
    name: 'Lucas Anderson',
    email: 'lucas.a@example.com',
    ordersCount: 7,
    totalSpent: 980.0,
    lastOrder: '2026-02-08',
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(
    () =>
      mockCustomers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#333]">Customers</h1>
        <p className="text-[#707070] mt-1">Manage and view all customer information</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
              aria-label="Search customers"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {filteredCustomers.length > 0 ? (
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
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#333]">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#707070]">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#707070]">
                      {customer.ordersCount}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#333]">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#707070]">
                      {customer.lastOrder}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="inline-flex items-center gap-1 text-[#B95E82] hover:text-[#A04D6F] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View Profile</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-[#707070] text-lg">No customers found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredCustomers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-[#707070]">
              Showing {filteredCustomers.length} of {mockCustomers.length} customers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}