"use client"

import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statsCards = [
  { title: 'Total Revenue', value: '$124,568', icon: DollarSign, color: '#B95E82' },
  { title: 'Total Orders', value: '1,247', icon: ShoppingCart, color: '#F39F9F' },
  { title: 'Pending Shipments', value: '23', icon: Package, color: '#FFC29B' },
  { title: 'Low Stock Items', value: '8', icon: AlertTriangle, color: '#707070' },
];

const revenueData = [
  { date: 'Jan 1', revenue: 4200 },
  { date: 'Jan 5', revenue: 5100 },
  { date: 'Jan 10', revenue: 4800 },
  { date: 'Jan 15', revenue: 6200 },
  { date: 'Jan 20', revenue: 5800 },
  { date: 'Jan 25', revenue: 7100 },
  { date: 'Jan 30', revenue: 8400 },
];

const recentOrders = [
  { id: '#ORD-1247', customer: 'Sarah Johnson', date: '2026-02-11', total: '$245.00', status: 'Delivered' },
  { id: '#ORD-1246', customer: 'Michael Chen', date: '2026-02-11', total: '$189.50', status: 'Shipped' },
  { id: '#ORD-1245', customer: 'Emma Wilson', date: '2026-02-10', total: '$320.00', status: 'Processing' },
  { id: '#ORD-1244', customer: 'James Brown', date: '2026-02-10', total: '$156.75', status: 'Pending' },
  { id: '#ORD-1243', customer: 'Olivia Davis', date: '2026-02-09', total: '$428.00', status: 'Delivered' },
];

const statusColors: Record<string, string> = {
  'Delivered': 'bg-green-100 text-green-700',
  'Shipped': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-yellow-100 text-yellow-700',
  'Pending': 'bg-gray-100 text-gray-700',
};

export function StoreOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#333]">Store Overview</h1>
      
      <div className="grid grid-cols-4 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#707070] mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-[#333]">{card.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#333] mb-6">Revenue (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#707070" />
            <YAxis stroke="#707070" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#B95E82" strokeWidth={3} dot={{ fill: '#B95E82', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#333]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#333]">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-[#707070]">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-[#707070]">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#333]">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
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
