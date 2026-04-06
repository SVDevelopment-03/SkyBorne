/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import {
  Package, Search, Filter, ArrowLeft, Truck,
  CheckCircle, XCircle, Clock, MapPin,
  RefreshCw, Star, AlertCircle, Loader2,
} from "lucide-react";
import { useCancelOrderMutation, useGetMyOrdersQuery } from "@/store/api/orderApi";
import { ImageWithFallback } from "@/components/pages/user/ImageWithFallback";
import toast from "react-hot-toast";

type ViewMode = "list" | "detail";

export default function MyOrders() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetMyOrdersQuery({
    status: statusFilter !== "all" ? statusFilter as any: undefined,
    search: searchQuery || undefined,
    page: 1,
    limit: 20,
  });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const orders = data?.data ?? [];
  const selectedOrder = orders.find((o: any) => o._id === selectedOrderId) ?? null;

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      await cancelOrder(selectedOrderId).unwrap();
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      setSelectedOrderId(null);
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to cancel order");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":     return "bg-orange-100 text-orange-700";
      case "processing":  return "bg-orange-100 text-orange-700";
      case "shipped":     return "bg-blue-100 text-blue-700";
      case "delivered":   return "bg-green-100 text-green-700";
      case "cancelled":   return "bg-gray-100 text-gray-700";
      default:            return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "processing":  return <Clock size={16} />;
      case "shipped":     return <Truck size={16} />;
      case "delivered":   return <CheckCircle size={16} />;
      case "cancelled":   return <XCircle size={16} />;
      default:            return <Package size={16} />;
    }
  };

  const renderCancelModal = () => {
    if (!showCancelModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowCancelModal(false)}
      >
        <div
          className="bg-card rounded-3xl max-w-md w-full p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-center mb-3">Cancel this order?</h2>
          <p className="text-center text-foreground/60 mb-6">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 py-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              Keep Order
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="flex-1 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-70"
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Detail View ─────────────────────────────────────────────────────────────
  if (viewMode === "detail" && selectedOrder) {
    const order: any = selectedOrder;

    const timelineSteps = [
      { label: "Order Placed",  icon: <Clock size={20} />,       done: true },
      { label: "Processing",    icon: <Package size={20} />,      done: ["Processing","Shipped","Delivered"].includes(order.orderStatus) },
      { label: "Shipped",       icon: <Truck size={20} />,        done: ["Shipped","Delivered"].includes(order.orderStatus) },
      { label: "Delivered",     icon: <CheckCircle size={20} />,  done: order.orderStatus === "Delivered" },
    ];

    return (
      <div className="max-w-6xl px-6 py-12">
        <div className="mb-8">
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <h1 className="mb-1">Order Details</h1>
          <p className="text-foreground/60">{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Order info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-card rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Order Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Order Date</p>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Payment Method</p>
                  <p className="text-sm">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Payment Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Total Amount</p>
                  <p className="text-2xl text-primary">${order.totalAmount?.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-card rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Purchased Items</h3>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 rounded-2xl"
                    style={{ background: "linear-gradient(135deg, #FFF7DD 0%, #FFE4CC 100%)" }}
                  >
                    <div className="w-20 h-20 rounded-xl bg-white overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base mb-1">{item.name}</h4>
                      <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                      <p className="text-sm text-foreground/60">${item.price?.toFixed(2)} each</p>
                    </div>
                    <p className="text-lg font-medium text-primary self-center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            {order.shippingAddress && (
              <div className="bg-card rounded-3xl p-6 shadow-md">
                <h3 className="mb-4">Shipping Address</h3>
                <div className="flex gap-3">
                  <MapPin className="text-primary flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-foreground/70 space-y-0.5">
                    <p className="font-medium text-foreground">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — Timeline + actions */}
          <div className="space-y-6">
            <div className="bg-card rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Order Status</h3>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}
                >
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus}
                </span>
              </div>
              {String(order.orderStatus || "").toLowerCase() === "pending" && (
                <button
                  onClick={() => {
                    setSelectedOrderId(order._id);
                    setShowCancelModal(true);
                  }}
                  className="w-full py-3 rounded-full text-sm border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                >
                  Cancel Order
                </button>
              )}
            </div>

            <div className="bg-card rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {timelineSteps.map((step, idx) => (
                  <div key={`${step.label}-${idx}`} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.done ? "bg-primary/10 text-primary" : "bg-muted text-foreground/40"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <p className={`text-sm ${step.done ? "text-foreground" : "text-foreground/50"}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {renderCancelModal()}
      </div>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="mb-2">My Orders</h1>
        <p className="text-foreground/60">Track and manage your purchases</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-3xl p-6 shadow-md mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-foreground/60 mb-2">Order Status</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-foreground/60 mb-2">Search by Order ID</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter order number..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-card rounded-3xl p-12 shadow-md text-center">
          <Package className="mx-auto text-foreground/20 mb-4" size={48} />
          <h3 className="mb-2">No orders found</h3>
          <p className="text-foreground/60">Try adjusting your filters or search</p>
        </div>
      ) : (
        <div className={`space-y-4 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-card rounded-3xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #FFF7DD 0%, #FFE4CC 100%)" }}
                >
                  <Package className="text-primary" size={28} />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Order ID</p>
                    <p className="font-medium text-sm">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Date</p>
                    <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Total</p>
                    <p className="text-lg text-primary font-medium">${order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Payment</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Order Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                  {String(order.orderStatus || "").toLowerCase() === "pending" && (
                    <button
                      onClick={() => {
                        setSelectedOrderId(order._id);
                        setShowCancelModal(true);
                      }}
                      className="px-6 py-2 rounded-full text-sm border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedOrderId(order._id);
                      setViewMode("detail");
                    }}
                    className="px-6 py-2 rounded-full text-white text-sm hover:shadow-lg transition-all"
                    style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {renderCancelModal()}
    </div>
  );
}
