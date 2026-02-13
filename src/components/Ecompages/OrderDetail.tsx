'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderData {
  orderId: string;
  date: string;
  stripeId: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [fulfillmentStatus, setFulfillmentStatus] = useState('Processing');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // In a real application, fetch order data based on params.id
  const orderData: OrderData = {
    orderId: 'ORD-1245',
    date: '2026-02-10',
    stripeId: 'pi_3M5kLp2eZvKYlo2C0h8BpfJT',
    paymentStatus: 'Paid',
    total: 320.0,
    customer: {
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+1 (555) 123-4567',
    },
    shipping: {
      street: '123 Wellness Avenue',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA',
    },
    items: [
      {
        id: '1',
        name: 'Lavender Essential Oil',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108',
        quantity: 2,
        price: 24.99,
      },
      {
        id: '2',
        name: 'Meditation Cushion',
        image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7',
        quantity: 1,
        price: 49.99,
      },
      {
        id: '3',
        name: 'Herbal Tea Collection',
        image: 'https://images.unsplash.com/photo-1597318163218-9c8c7d4d1d8c',
        quantity: 3,
        price: 34.99,
      },
    ],
  };

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/orders/${params.id}/fulfillment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: fulfillmentStatus,
          trackingNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update fulfillment status');
      }

      // Show success toast or notification here
      console.log('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      // Show error toast or notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/orders/${params.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          amount: orderData.total,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      console.log('Refund processed successfully');
      setShowRefundModal(false);
    } catch (error) {
      console.error('Error processing refund:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-[#707070]" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#333]">
            Order {orderData.orderId}
          </h1>
          <p className="text-[#707070]">{orderData.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#333] mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#707070]">Order ID</span>
                <span className="font-medium text-[#333]">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">Order Date</span>
                <span className="font-medium text-[#333]">{orderData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">Stripe Payment ID</span>
                <span className="font-mono text-sm text-[#333]">
                  {orderData.stripeId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">Payment Status</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {orderData.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-medium text-[#333]">Total Amount</span>
                <span className="text-xl font-bold text-[#333]">
                  ${orderData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#333] mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#333]">{item.name}</h3>
                    <p className="text-sm text-[#707070]">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#333]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-[#707070]">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#333] mb-4">
              Customer Information
            </h2>
            <div className="space-y-2">
              <p className="font-medium text-[#333]">{orderData.customer.name}</p>
              <p className="text-sm text-[#707070]">{orderData.customer.email}</p>
              <p className="text-sm text-[#707070]">{orderData.customer.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#333] mb-4">
              Shipping Address
            </h2>
            <div className="space-y-1 text-sm text-[#707070]">
              <p>{orderData.shipping.street}</p>
              <p>
                {orderData.shipping.city}, {orderData.shipping.state}{' '}
                {orderData.shipping.zip}
              </p>
              <p>{orderData.shipping.country}</p>
            </div>
          </div>

          {/* Fulfillment Control */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Fulfillment Control
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#707070] mb-2">
                  Status
                </label>
                <select
                  value={fulfillmentStatus}
                  onChange={(e) => setFulfillmentStatus(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#707070] mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Refund Button */}
          {orderData.paymentStatus === 'Paid' && (
            <button
              onClick={() => setShowRefundModal(true)}
              disabled={isLoading}
              className="w-full px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Issue Refund
            </button>
          )}
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      <ConfirmModal
        isOpen={showRefundModal}
        title="Issue Refund"
        message={`Are you sure you want to refund $${orderData.total.toFixed(2)} to ${orderData.customer.name}? This action cannot be undone.`}
        confirmText="Confirm Refund"
        cancelText="Cancel"
        onConfirm={handleRefund}
        onCancel={() => setShowRefundModal(false)}
        variant="danger"
      />
    </div>
  );
}