'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Delivered' | 'Shipped' | 'Pending';
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  orders: Order[];
}

export default function CustomerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // Mock customer data - replace with actual data fetching based on params.id
  const customerData: CustomerData = {
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Wellness Avenue, San Francisco, CA 94102',
    joinDate: '2025-08-15',
    totalOrders: 15,
    totalSpent: 2140.0,
    lastOrder: '2026-02-10',
    orders: [
      {
        id: 'ORD-1245',
        date: '2026-02-10',
        total: 320.0,
        status: 'Processing',
      },
      {
        id: 'ORD-1198',
        date: '2026-01-28',
        total: 156.5,
        status: 'Delivered',
      },
      {
        id: 'ORD-1142',
        date: '2026-01-15',
        total: 245.0,
        status: 'Delivered',
      },
      {
        id: 'ORD-1089',
        date: '2025-12-22',
        total: 428.0,
        status: 'Delivered',
      },
      {
        id: 'ORD-1034',
        date: '2025-12-05',
        total: 189.5,
        status: 'Delivered',
      },
    ],
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  const getStatusStyles = (status: Order['status']): string => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-[#707070]" />
        </button>
        <h1 className="text-3xl font-bold text-[#333]">Customer Profile</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Avatar */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-[#B95E82] to-[#A04D6F] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {getInitials(customerData.name)}
              </div>
            </div>

            {/* Name */}
            <h2 className="text-xl font-bold text-[#333] text-center mb-6">
              {customerData.name}
            </h2>

            {/* Contact Information */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#B95E82] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-[#707070] mb-1 uppercase tracking-wider">
                    Email
                  </p>
                  <a
                    href={`mailto:${customerData.email}`}
                    className="text-sm text-[#333] hover:text-[#B95E82] transition-colors break-all"
                  >
                    {customerData.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#B95E82] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#707070] mb-1 uppercase tracking-wider">
                    Phone
                  </p>
                  <a
                    href={`tel:${customerData.phone.replace(/\s/g, '')}`}
                    className="text-sm text-[#333] hover:text-[#B95E82] transition-colors"
                  >
                    {customerData.phone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B95E82] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#707070] mb-1 uppercase tracking-wider">
                    Address
                  </p>
                  <p className="text-sm text-[#333]">{customerData.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#333] mb-4">Statistics</h3>
            <div className="space-y-4">
              {/* Member Since */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-sm text-[#707070]">Member Since</span>
                <span className="text-sm font-medium text-[#333]">
                  {customerData.joinDate}
                </span>
              </div>

              {/* Total Orders */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-sm text-[#707070]">Total Orders</span>
                <span className="text-lg font-bold text-[#333]">
                  {customerData.totalOrders}
                </span>
              </div>

              {/* Total Spent */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-sm text-[#707070]">Total Spent</span>
                <span className="text-lg font-bold text-[#B95E82]">
                  ${customerData.totalSpent.toFixed(2)}
                </span>
              </div>

              {/* Last Order */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#707070]">Last Order</span>
                <span className="text-sm font-medium text-[#333]">
                  {customerData.lastOrder}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order History */}
        <div className="col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Header */}
            <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B95E82]" />
              Order History
            </h3>

            {/* Table */}
            <div className="overflow-x-auto">
              {customerData.orders.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customerData.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#333]">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#707070]">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#333]">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/orders/${order.id.replace('ORD-', '')}`}
                            className="text-sm text-[#B95E82] hover:text-[#A04D6F] transition-colors font-medium"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-[#707070] text-lg">No orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}