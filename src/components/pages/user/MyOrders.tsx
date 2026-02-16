"use client"
import React, { useState } from 'react';
import { 
  Package, Search, Filter, ArrowLeft, Truck, 
  CheckCircle, XCircle, Clock, Download, 
  MapPin, CreditCard, RefreshCw, Star, AlertCircle 
} from 'lucide-react';

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'paid' | 'refunded';
type ViewMode = 'list' | 'detail' | 'success';

interface OrderItem {
  id: string;
  image: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderStatus;
  paymentMethod: string;
  items: OrderItem[];
  shipping: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    method: string;
    estimatedDelivery: string;
  };
  trackingNumber?: string;
  timeline: {
    processing: { completed: boolean; date: string };
    shipped: { completed: boolean; date: string };
    delivered: { completed: boolean; date: string };
  };
}

export default function MyOrders() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-1001',
      date: 'Feb 10, 2024',
      total: 89.97,
      paymentStatus: 'paid',
      fulfillmentStatus: 'delivered',
      paymentMethod: 'Stripe - Visa ****4242',
      items: [
        { id: '1', image: 'wellness-mat', name: 'Premium Yoga Mat', quantity: 1, price: 49.99 },
        { id: '2', image: 'resistance-bands', name: 'Resistance Bands Set', quantity: 2, price: 19.99 },
      ],
      shipping: {
        name: 'Sarah Chen',
        address: '123 Wellness Ave',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        method: 'Standard Shipping (5-7 days)',
        estimatedDelivery: 'Feb 8, 2024',
      },
      trackingNumber: 'TRK-8293847392847',
      timeline: {
        processing: { completed: true, date: 'Feb 5, 2024' },
        shipped: { completed: true, date: 'Feb 6, 2024' },
        delivered: { completed: true, date: 'Feb 8, 2024' },
      },
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-1002',
      date: 'Feb 9, 2024',
      total: 129.99,
      paymentStatus: 'paid',
      fulfillmentStatus: 'shipped',
      paymentMethod: 'Stripe - Visa ****4242',
      items: [
        { id: '3', image: 'water-bottle', name: 'Insulated Water Bottle', quantity: 1, price: 29.99 },
        { id: '4', image: 'workout-set', name: 'Premium Workout Set', quantity: 1, price: 100.00 },
      ],
      shipping: {
        name: 'Sarah Chen',
        address: '123 Wellness Ave',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        method: 'Express Shipping (2-3 days)',
        estimatedDelivery: 'Feb 12, 2024',
      },
      trackingNumber: 'TRK-9384758394857',
      timeline: {
        processing: { completed: true, date: 'Feb 9, 2024' },
        shipped: { completed: true, date: 'Feb 10, 2024' },
        delivered: { completed: false, date: '' },
      },
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-1003',
      date: 'Feb 11, 2024',
      total: 45.00,
      paymentStatus: 'paid',
      fulfillmentStatus: 'processing',
      paymentMethod: 'Stripe - Visa ****4242',
      items: [
        { id: '5', image: 'supplements', name: 'Wellness Supplements Pack', quantity: 1, price: 45.00 },
      ],
      shipping: {
        name: 'Sarah Chen',
        address: '123 Wellness Ave',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        method: 'Standard Shipping (5-7 days)',
        estimatedDelivery: 'Feb 18, 2024',
      },
      timeline: {
        processing: { completed: true, date: 'Feb 11, 2024' },
        shipped: { completed: false, date: '' },
        delivered: { completed: false, date: '' },
      },
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-0998',
      date: 'Feb 3, 2024',
      total: 75.00,
      paymentStatus: 'refunded',
      fulfillmentStatus: 'cancelled',
      paymentMethod: 'Stripe - Visa ****4242',
      items: [
        { id: '6', image: 'meditation-cushion', name: 'Meditation Cushion Set', quantity: 1, price: 75.00 },
      ],
      shipping: {
        name: 'Sarah Chen',
        address: '123 Wellness Ave',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        method: 'Standard Shipping (5-7 days)',
        estimatedDelivery: 'N/A',
      },
      timeline: {
        processing: { completed: true, date: 'Feb 3, 2024' },
        shipped: { completed: false, date: '' },
        delivered: { completed: false, date: '' },
      },
    },
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return 'bg-orange-100 text-orange-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return <Clock size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.fulfillmentStatus === statusFilter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCancelOrder = () => {
    setShowCancelModal(false);
    setShowRefundConfirm(true);
    setTimeout(() => setShowRefundConfirm(false), 3000);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setViewMode('detail');
  };

  // Order Success View
  if (viewMode === 'success') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center max-w-lg w-full">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="mb-4">Your order is confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for supporting your wellness journey.
            </p>
            
            <div className="bg-gradient-to-br from-[#fef5e7] to-[#fbefd8] rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium">ORD-2024-1004</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-medium">Feb 18, 2024</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="flex-1 py-3 bg-gradient-to-r from-[#c68296] to-[#b95e82] text-white rounded-full hover:shadow-lg transition-all"
              >
                View My Orders
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order Details View
  if (viewMode === 'detail' && selectedOrder) {
    return (
      <div className="max-w-6xl m-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#b95e82] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </button>
          <h1 className="mb-2">Order Details</h1>
          <p className="text-gray-600">{selectedOrder.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Order Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p>{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="text-sm">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                    selectedOrder.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl text-[#b95e82]">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Purchased Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gradient-to-br from-[#fef5e7] to-[#fbefd8] rounded-2xl">
                    <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center">
                      <Package className="text-[#b95e82]" size={32} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-[#b95e82]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Shipping Information</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="text-[#b95e82] flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium mb-1">{selectedOrder.shipping.name}</p>
                    <p className="text-gray-600 text-sm">{selectedOrder.shipping.address}</p>
                    <p className="text-gray-600 text-sm">
                      {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zip}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shipping Method</p>
                    <p className="text-sm">{selectedOrder.shipping.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                    <p className="text-sm">{selectedOrder.shipping.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tracking & Actions */}
          <div className="space-y-6">
            {/* Order Tracking Timeline */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h3 className="mb-6">Order Tracking</h3>
              <div className="space-y-6">
                {/* Processing */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedOrder.timeline.processing.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Clock size={20} />
                    </div>
                    {selectedOrder.timeline.shipped.completed && (
                      <div className="w-0.5 h-12 bg-green-600 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Processing</p>
                    {selectedOrder.timeline.processing.completed && (
                      <p className="text-sm text-gray-600">{selectedOrder.timeline.processing.date}</p>
                    )}
                  </div>
                </div>

                {/* Shipped */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedOrder.timeline.shipped.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Truck size={20} />
                    </div>
                    {selectedOrder.timeline.delivered.completed && (
                      <div className="w-0.5 h-12 bg-green-600 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Shipped</p>
                    {selectedOrder.timeline.shipped.completed && (
                      <p className="text-sm text-gray-600">{selectedOrder.timeline.shipped.date}</p>
                    )}
                  </div>
                </div>

                {/* Delivered */}
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedOrder.timeline.delivered.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Delivered</p>
                    {selectedOrder.timeline.delivered.completed && (
                      <p className="text-sm text-gray-600">{selectedOrder.timeline.delivered.date}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking Number */}
              {selectedOrder.trackingNumber && selectedOrder.fulfillmentStatus !== 'cancelled' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Tracking Number</p>
                  <p className="text-sm font-mono bg-gray-50 p-3 rounded-lg mb-3">
                    {selectedOrder.trackingNumber}
                  </p>
                  <button className="w-full py-2 bg-gradient-to-r from-[#c68296] to-[#b95e82] text-white rounded-full text-sm hover:shadow-lg transition-all">
                    Track Shipment
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Actions</h3>
              <div className="space-y-3">
                {selectedOrder.fulfillmentStatus === 'processing' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full py-3 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Cancel Order
                  </button>
                )}
                
                {selectedOrder.fulfillmentStatus === 'delivered' && (
                  <>
                    <button className="w-full py-3 bg-gradient-to-r from-[#c68296] to-[#b95e82] text-white rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={18} />
                      Reorder
                    </button>
                    <button className="w-full py-3 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
                      <Star size={18} />
                      Write Review
                    </button>
                  </>
                )}

                {selectedOrder.paymentStatus === 'refunded' && (
                  <div className="p-4 bg-orange-50 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="text-orange-600" size={20} />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Refunded</p>
                      <p className="text-xs text-orange-700">Your refund has been processed</p>
                    </div>
                  </div>
                )}

                <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Download size={18} />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowCancelModal(false)}
            >
              <div 
                className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-600" size={32} />
                </div>
                <h2 className="text-center mb-3">Cancel this order?</h2>
                <p className="text-center text-gray-600 mb-6">
                  Are you sure you want to cancel this purchase? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    className="flex-1 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Refund Confirmation */}
        {showRefundConfirm && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3">
            <CheckCircle size={24} />
            <div>
              <p className="font-medium">Refund Initiated</p>
              <p className="text-sm opacity-90">Your refund has been initiated.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Orders List View (Default)
  return (
    <div className="max-w-6xl m-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your wellness purchases</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">Order Status</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#b95e82]"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">Search by Order ID</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter order number..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#b95e82]"
              />
            </div>
          </div>

          {/* Success Page Demo Button */}
          <div className="flex-1 flex items-end">
            <button
              onClick={() => setViewMode('success')}
              className="w-full py-3 bg-gradient-to-r from-[#c68296] to-[#b95e82] text-white rounded-full hover:shadow-lg transition-all"
            >
              View Success Page
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-md text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Order Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fef5e7] to-[#fbefd8] flex items-center justify-center flex-shrink-0">
                  <Package className="text-[#b95e82]" size={32} />
                </div>

                {/* Order Info */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order ID</p>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Date</p>
                    <p>{order.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-lg text-[#b95e82] font-medium">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${getStatusColor(order.fulfillmentStatus)}`}>
                    {getStatusIcon(order.fulfillmentStatus)}
                    {order.fulfillmentStatus.charAt(0).toUpperCase() + order.fulfillmentStatus.slice(1)}
                  </span>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="px-6 py-2 bg-gradient-to-r from-[#c68296] to-[#b95e82] text-white rounded-full hover:shadow-lg transition-all whitespace-nowrap"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State Help */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 bg-gradient-to-br from-[#fef5e7] to-[#fbefd8] rounded-3xl p-8 text-center">
          <h3 className="mb-2">Need help with an order?</h3>
          <p className="text-gray-600 mb-4">
            Our wellness support team is here to assist you 24/7
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-[#c68296] to-[#b95e82] text-white rounded-full hover:shadow-lg transition-all">
            Contact Support
          </button>
        </div>
      )}
    </div>
  );
}
