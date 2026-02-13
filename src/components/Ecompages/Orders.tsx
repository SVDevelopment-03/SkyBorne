"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye } from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  total: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  fulfillmentStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const mockOrders: Order[] = [
  { id: '1', orderId: 'ORD-1247', customer: 'Sarah Johnson', date: '2026-02-11', total: 245.00, paymentStatus: 'Paid', fulfillmentStatus: 'Delivered' },
  { id: '2', orderId: 'ORD-1246', customer: 'Michael Chen', date: '2026-02-11', total: 189.50, paymentStatus: 'Paid', fulfillmentStatus: 'Shipped' },
  { id: '3', orderId: 'ORD-1245', customer: 'Emma Wilson', date: '2026-02-10', total: 320.00, paymentStatus: 'Paid', fulfillmentStatus: 'Processing' },
  { id: '4', orderId: 'ORD-1244', customer: 'James Brown', date: '2026-02-10', total: 156.75, paymentStatus: 'Pending', fulfillmentStatus: 'Pending' },
  { id: '5', orderId: 'ORD-1243', customer: 'Olivia Davis', date: '2026-02-09', total: 428.00, paymentStatus: 'Paid', fulfillmentStatus: 'Delivered' },
  { id: '6', orderId: 'ORD-1242', customer: 'William Taylor', date: '2026-02-09', total: 99.99, paymentStatus: 'Paid', fulfillmentStatus: 'Shipped' },
  { id: '7', orderId: 'ORD-1241', customer: 'Sophia Martinez', date: '2026-02-08', total: 275.50, paymentStatus: 'Refunded', fulfillmentStatus: 'Cancelled' },
  { id: '8', orderId: 'ORD-1240', customer: 'Lucas Anderson', date: '2026-02-08', total: 180.00, paymentStatus: 'Paid', fulfillmentStatus: 'Processing' },
];

const paymentStatusColors: Record<Order['paymentStatus'], string> = {
  'Paid': 'bg-green-100 text-green-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Failed': 'bg-red-100 text-red-700',
  'Refunded': 'bg-blue-100 text-blue-700',
};

const fulfillmentStatusColors: Record<Order['fulfillmentStatus'], string> = {
  'Delivered': 'bg-green-100 text-green-700',
  'Shipped': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-yellow-100 text-yellow-700',
  'Pending': 'bg-gray-100 text-gray-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

export function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    const matchesFulfillment = fulfillmentFilter === 'all' || order.fulfillmentStatus === fulfillmentFilter;
    return matchesSearch && matchesPayment && matchesFulfillment;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#333]">Orders</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#707070]" />
            <input
              type="date"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent text-[#707070]"
            />
            
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
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
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent text-[#707070]"
            >
              <option value="all">All Fulfillment</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Fulfillment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#333]">{order.orderId}</td>
                  <td className="px-6 py-4 text-sm text-[#707070]">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-[#707070]">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#333]">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${fulfillmentStatusColors[order.fulfillmentStatus]}`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/orders/${order.id}`}
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
      </div>
    </div>
  );
}