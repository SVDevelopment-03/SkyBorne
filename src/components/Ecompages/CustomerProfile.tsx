'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  useGetCustomerByIdQuery,
  useGetMyCustomerProfileQuery,
  useAddAddressMutation,
  useRemoveAddressMutation,
} from '@/store/api/customerApi';

interface Order {
  _id?: string;
  id?: string;
  date?: string;
  total?: number;
  status?: 'Processing' | 'Delivered' | 'Shipped' | 'Pending';
}

export default function CustomerProfilePage({
  params,
}: {
  params?: { id?: string };
}) {
  const router = useRouter();

  // Accept admin route param or fallback to last path segment
  const customerId =
    params?.id ||
    (typeof window !== 'undefined'
      ? window.location.pathname.split('/').filter(Boolean).pop()
      : undefined);

  // Determine which query to call:
  // - if there's a customerId (admin view), call getCustomerById
  // - otherwise call getMyCustomerProfile
  const {
    data: customerRespById,
    isLoading: isLoadingById,
    isError: isErrorById,
    error: errorById,
  } = useGetCustomerByIdQuery(customerId ?? skipToken);

  const {
    data: myCustomerResp,
    isLoading: isLoadingMe,
    isError: isErrorMe,
    error: errorMe,
  } = useGetMyCustomerProfileQuery(customerId ? skipToken : undefined);

  const customerResp = customerRespById ?? myCustomerResp;
  const isLoading = isLoadingById || isLoadingMe;
  const isError = isErrorById || isErrorMe;
  const error = errorById ?? errorMe;

  const customer = customerResp?.data;

  const [addAddress, { isLoading: addingAddress }] = useAddAddressMutation();
  const [removeAddress, { isLoading: removingAddress }] = useRemoveAddressMutation();
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    isDefault: false,
  });

  const getInitials = (name: string): string => {
    if (!name) return 'CU';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2);
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

  const handleAddAddress = async () => {
    try {
      await addAddress(newAddress as any).unwrap();
      setNewAddress({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        isDefault: false,
      });
    } catch (err) {
      console.error('Add address error', err);
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    try {
      await removeAddress(addressId).unwrap();
    } catch (err) {
      console.error('Remove address error', err);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-500">Loading customer...</div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="space-y-6">
        <div className="text-red-600">Failed to load customer profile.</div>
        <button onClick={() => router.back()} className="text-sm text-[#B95E82]">Go back</button>
      </div>
    );
  }

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
                {getInitials(`${customer.userId?.firstName || ''} ${customer.userId?.lastName || ''}`)}
              </div>
            </div>

            {/* Name */}
            <h2 className="text-xl font-bold text-[#333] text-center mb-6">
              {(customer.userId?.firstName || '') + ' ' + (customer.userId?.lastName || '')}
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
                    href={`mailto:${customer.userId?.email}`}
                    className="text-sm text-[#333] hover:text-[#B95E82] transition-colors break-all"
                  >
                    {customer.userId?.email || 'N/A'}
                  </a>
                </div>
              </div>

              {/* Phone (from first address if present) */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#B95E82] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#707070] mb-1 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm text-[#333]">{customer.addresses?.[0]?.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B95E82] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#707070] mb-1 uppercase tracking-wider">
                    Address
                  </p>
                  <p className="text-sm text-[#333]">
                    {customer.addresses?.[0]
                      ? `${customer.addresses[0].addressLine1}${customer.addresses[0].addressLine2 ? ', ' + customer.addresses[0].addressLine2 : ''}, ${customer.addresses[0].city}, ${customer.addresses[0].state} ${customer.addresses[0].postalCode}, ${customer.addresses[0].country}`
                      : 'No address'}
                  </p>
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
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>

              {/* Total Orders */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-sm text-[#707070]">Total Orders</span>
                <span className="text-lg font-bold text-[#333]">
                  {customer.totalOrders || 0}
                </span>
              </div>

              {/* Total Spent */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-sm text-[#707070]">Total Spent</span>
                <span className="text-lg font-bold text-[#B95E82]">
                  ${(customer.totalSpent || 0).toFixed(2)}
                </span>
              </div>

              {/* Last Order */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#707070]">Last Order</span>
                <span className="text-sm font-medium text-[#333]">
                  {customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : '-'}
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
              {Array.isArray(customer?.orders) && customer.orders.length > 0 ? (
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
                    {customer.orders.map((order: any) => (
                      <tr key={order._id || order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#333]">
                          {order.orderNumber || order._id || order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#707070]">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#333]">
                          ${(order.total || order.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                              order.orderStatus || order.status
                            )}`}
                          >
                            {order.orderStatus || order.status || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/orders/${order._id || order.id || (order.orderNumber ? order.orderNumber.replace('ORD-', '') : '')}`}
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

            {/* Addresses */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#707070] mb-3">Addresses</h4>
              <div className="space-y-3">
                {customer.addresses && customer.addresses.length > 0 ? (
                  customer.addresses.map((addr: any) => (
                    <div key={addr._id} className="p-4 bg-white rounded-xl border border-gray-100 flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-[#333]">{addr.fullName} {addr.isDefault && <span className="text-xs text-green-600 ml-2">Default</span>}</div>
                        <div className="text-sm text-[#707070]">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</div>
                        <div className="text-sm text-[#707070]">{addr.city}, {addr.state} {addr.postalCode}</div>
                        <div className="text-sm text-[#707070]">{addr.country}</div>
                        <div className="text-sm text-[#707070] mt-1">Phone: {addr.phone}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleRemoveAddress(addr._id)} className="text-sm text-red-600">Remove</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[#707070]">No addresses</div>
                )}
              </div>

              {/* Add address form (simple inline) */}
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
                <h5 className="text-sm font-medium text-[#333] mb-2">Add Address</h5>
                <div className="grid grid-cols-1 gap-2">
                  <input className="px-3 py-2 border rounded" placeholder="Full name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                  <input className="px-3 py-2 border rounded" placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                  <input className="px-3 py-2 border rounded" placeholder="Address line 1" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
                  <input className="px-3 py-2 border rounded" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  <input className="px-3 py-2 border rounded" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                  <input className="px-3 py-2 border rounded" placeholder="Postal code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
                  <input className="px-3 py-2 border rounded" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={handleAddAddress} disabled={addingAddress} className="px-4 py-2 bg-[#B95E82] text-white rounded">Add</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}