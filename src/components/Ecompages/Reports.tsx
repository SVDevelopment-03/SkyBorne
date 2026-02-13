"use client"

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, RefreshCw } from 'lucide-react';

const revenueByMonth = [
  { month: 'Aug', revenue: 12450 },
  { month: 'Sep', revenue: 18920 },
  { month: 'Oct', revenue: 15680 },
  { month: 'Nov', revenue: 22340 },
  { month: 'Dec', revenue: 28750 },
  { month: 'Jan', revenue: 24560 },
  { month: 'Feb', revenue: 19280 },
];

const ordersByRegion = [
  { name: 'California', orders: 342 },
  { name: 'New York', orders: 287 },
  { name: 'Texas', orders: 198 },
  { name: 'Florida', orders: 156 },
  { name: 'Illinois', orders: 124 },
];

const bestSellingProducts = [
  { name: 'Lavender Oil', sales: 456, revenue: 11394 },
  { name: 'Yoga Mat', sales: 312, revenue: 24949 },
  { name: 'Tea Collection', sales: 289, revenue: 10112 },
  { name: 'Meditation Cushion', sales: 234, revenue: 11698 },
  { name: 'Aromatherapy Diffuser', sales: 187, revenue: 10283 },
];

const refundData = [
  { name: 'Completed', value: 1142, color: '#10B981' },
  { name: 'Refunded', value: 23, color: '#EF4444' },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#333]">Reports & Analytics</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#B95E82] bg-opacity-10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#B95E82]" />
            </div>
            <h3 className="font-bold text-[#707070]">Growth Rate</h3>
          </div>
          <p className="text-3xl font-bold text-[#333]">+24.5%</p>
          <p className="text-sm text-green-600 mt-1">↑ vs last period</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#F39F9F] bg-opacity-20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#F39F9F]" />
            </div>
            <h3 className="font-bold text-[#707070]">Avg Order Value</h3>
          </div>
          <p className="text-3xl font-bold text-[#333]">$187.42</p>
          <p className="text-sm text-green-600 mt-1">↑ $12.30 from last month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FFC29B] bg-opacity-30 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#FFC29B]" />
            </div>
            <h3 className="font-bold text-[#707070]">Conversion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-[#333]">3.2%</p>
          <p className="text-sm text-red-600 mt-1">↓ 0.3% vs last period</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-[#707070]">Refund Rate</h3>
          </div>
          <p className="text-3xl font-bold text-[#333]">1.97%</p>
          <p className="text-sm text-green-600 mt-1">↓ 0.5% improvement</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#333] mb-6">Revenue by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#707070" />
            <YAxis stroke="#707070" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#B95E82" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#333] mb-6">Orders by Region</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByRegion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#707070" />
              <YAxis dataKey="name" type="category" stroke="#707070" width={100} />
              <Tooltip />
              <Bar dataKey="orders" fill="#F39F9F" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#333] mb-6">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={refundData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {refundData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#333] mb-6">Best Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#707070] uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bestSellingProducts.map((product, index) => (
                <tr key={product.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#B95E82] text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#333]">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-[#707070]">{product.sales}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#333]">${product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
