/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useRefundOrderMutation,
  type OrderStatus,
} from '@/store/api/orderApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import toast from 'react-hot-toast';
import { handleApiError } from '@/utils/handleApiError';

export default function OrderDetailPage() {
  const router = useRouter();

 const params = useParams();
  const orderId = params?.id as string;

  console.log("Order ID:", orderId);

  const { data: orderResp, isLoading, isError, error } = useGetOrderByIdQuery(orderId ?? skipToken);
  const [updateOrderStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();
  const [refundOrder, { isLoading: refunding }] = useRefundOrderMutation();

  const order = orderResp?.data;

  const [fulfillmentStatus, setFulfillmentStatus] = useState<OrderStatus>((order?.orderStatus as OrderStatus) || ('Processing' as OrderStatus));
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order?.orderStatus) setFulfillmentStatus(order.orderStatus);
  }, [order?.orderStatus]);

  const formatDate = (d?: string) => {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  const handleUpdateStatus = async () => {
    if (!order) return;
    setIsSubmitting(true);
    try {
      await updateOrderStatus({ orderId: order._id, orderStatus: fulfillmentStatus as OrderStatus }).unwrap();
      toast.success('Order status updated');
    } catch (err) {
      console.error('Update status error', err);
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefund = async () => {
    if (!order) return;
    setIsSubmitting(true);
    try {
      await refundOrder({ orderId: order._id, amount: order.totalAmount }).unwrap();
      console.log('Refund requested');
      setShowRefundModal(false);
    } catch (err) {
      console.error('Refund error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canRefund =
    order?.orderStatus === "Cancelled" &&
    order?.paymentStatus === "Paid" &&
    !refunding;

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-500">Loading order...</div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <div className="text-red-600">Failed to load order.</div>
      </div>
    );
  }

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
            Order {order.orderNumber}
          </h1>
          <p className="text-[#707070]">{formatDate(order.createdAt)}</p>
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
                <span className="font-medium text-[#333]">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">Order Date</span>
                <span className="font-medium text-[#333]">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">Payment Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : order.paymentStatus === 'Refunded'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-medium text-[#333]">Total Amount</span>
                <span className="text-xl font-bold text-[#333]">${(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#333] mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  {item.image && (
                    // Next Image could be used if configured
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-[#333]">{item.name}</h3>
                    <p className="text-sm text-[#707070]">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#333]">${(item.price).toFixed(2)}</p>
                    <p className="text-sm text-[#707070]">${(item.price * item.quantity).toFixed(2)} total</p>
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
            <h2 className="text-lg font-bold text-[#333] mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p className="font-medium text-[#333]">{order.shippingAddress?.fullName || (typeof order.userId === 'object' && order.userId ? `${(order.userId as any)?.firstName} ${(order.userId as any)?.lastName}` : 'Customer')}</p>
              <p className="text-sm text-[#707070]">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#333] mb-4">Shipping Address</h2>
            <div className="space-y-1 text-sm text-[#707070]">
              <p>{order.shippingAddress?.addressLine1}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Refund */}
          {(order.orderStatus === "Cancelled" || order.paymentStatus === "Refunded") && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#333] mb-4">Refund</h2>
              {order.paymentStatus === "Refunded" ? (
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Refunded
                </div>
              ) : (
                <>
                  <p className="text-sm text-[#707070] mb-4">
                    This order was cancelled. You can refund the full amount back to the customer via Stripe.
                  </p>
                  <button
                    onClick={() => setShowRefundModal(true)}
                    disabled={!canRefund || isSubmitting || refunding}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {refunding ? "Refunding..." : "Refund Amount"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Fulfillment Control */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Fulfillment Control
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#707070] mb-2">Status</label>
                <select
                  value={fulfillmentStatus}
                  onChange={(e) => setFulfillmentStatus(e.target.value as OrderStatus)}
                  disabled={isSubmitting || updating}
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
                <label className="block text-sm font-medium text-[#707070] mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={isSubmitting || updating}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B95E82] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={isSubmitting || updating}
                className="w-full px-6 py-3 bg-[#B95E82] text-white rounded-xl hover:bg-[#A04D6F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isSubmitting || updating) ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={showRefundModal}
        title="Refund this order?"
        message={`This will refund $${(order.totalAmount || 0).toFixed(2)} to the customer via Stripe.`}
        confirmText={refunding ? "Refunding..." : "Confirm Refund"}
        cancelText="Cancel"
        onConfirm={handleRefund}
        onCancel={() => setShowRefundModal(false)}
        variant="warning"
      />
     
    </div>
  );
}
