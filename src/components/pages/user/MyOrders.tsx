/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import {
  Package, Search, Filter, ArrowLeft, Truck,
  CheckCircle, XCircle, Clock, MapPin,
  Star, AlertCircle, Loader2,
} from "lucide-react";
import { useCancelOrderMutation, useGetMyOrdersQuery, useGetOrderByIdQuery } from "@/store/api/orderApi";
import type { IOrderItem } from "@/store/api/orderApi";
import { useAddProductReviewMutation } from "@/store/api/productApi";
import { ImageWithFallback } from "@/components/pages/user/ImageWithFallback";
import { useReorderCheckoutSessionMutation } from "@/store/api/EcompaymentApi";
import toast from "react-hot-toast";

type ViewMode = "list" | "detail";

export default function MyOrders() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewItem, setReviewItem] = useState<IOrderItem | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [hoveredReviewRating, setHoveredReviewRating] = useState(0);
  const [reviewAttempted, setReviewAttempted] = useState(false);
  const [reorderLoadingId, setReorderLoadingId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetMyOrdersQuery({
    status: statusFilter !== "all" ? statusFilter as any: undefined,
    search: searchQuery || undefined,
    page: 1,
    limit: 20,
  });
  const { data: orderDetailData, isLoading: isOrderDetailLoading } =
    useGetOrderByIdQuery(selectedOrderId ?? "", {
      skip: !selectedOrderId || viewMode !== "detail",
    });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [reorderCheckoutSession] = useReorderCheckoutSessionMutation();
  const [addProductReview, { isLoading: isSubmittingReview }] =
    useAddProductReviewMutation();

  const orders = data?.data ?? [];
  const selectedOrder = orders.find((o: any) => o._id === selectedOrderId) ?? null;
  const detailOrder = (orderDetailData as any)?.data ?? null;
  const activeOrder = detailOrder || selectedOrder;

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

  const openReviewModal = (item: IOrderItem) => {
    setReviewItem(item);
    setReviewRating(0);
    setReviewComment("");
    setHoveredReviewRating(0);
    setReviewAttempted(false);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewItem) return;
    setReviewAttempted(true);
    const productId = getProductId(reviewItem);
    if (!productId) {
      toast.error("This item is missing a product reference");
      return;
    }
    if (reviewRating < 1) {
      toast.error("Please select a rating");
      return;
    }
    if (reviewComment.trim().length < 10) {
      toast.error("Please add at least 10 characters");
      return;
    }
    try {
      await addProductReview({
        productId,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      }).unwrap();
      toast.success("Review submitted");
      setShowReviewModal(false);
      setReviewItem(null);
      setReviewRating(0);
      setReviewComment("");
      setReviewAttempted(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to submit review");
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

  const getOrderItems = (order: any) => {
    if (!order) return [];
    const candidates = [
      order.items,
      order.orderItems,
      order.products,
      order.lineItems,
    ];
    for (const list of candidates) {
      if (Array.isArray(list)) return list;
    }
    return [];
  };

  const getProductId = (item: any): string | null => {
    if (!item) return null;
    if (typeof item.product === "string") return item.product;
    if (item.product?._id) return String(item.product._id);
    if (item.product?.id) return String(item.product.id);
    if (item.productId) return String(item.productId);
    return null;
  };

  const canReorder = (status: string): boolean => {
    const safe = String(status || "").toLowerCase();
    return ["delivered", "cancelled", "refunded"].includes(safe);
  };

  const handleReorder = async (orderId: string) => {
    try {
      setReorderLoadingId(orderId);
      const response = await reorderCheckoutSession({ orderId }).unwrap();
      const checkoutUrl = response?.data?.checkoutUrl;

      if (!checkoutUrl) {
        toast.error("Unable to start reorder checkout");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start reorder");
    } finally {
      setReorderLoadingId(null);
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

  const renderReviewModal = () => {
    if (!showReviewModal || !reviewItem) return null;
    const itemName = reviewItem.name || (reviewItem as any).product?.name || "Item";
    const itemImage = reviewItem.image || (reviewItem as any).product?.image;
    const maxCommentLength = 500;
    const trimmedComment = reviewComment.trim();
    const isCommentValid =
      trimmedComment.length >= 10 && trimmedComment.length <= maxCommentLength;
    const canSubmit = reviewRating > 0 && isCommentValid && !isSubmittingReview;

    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowReviewModal(false)}
      >
        <div
          className="bg-card rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={itemImage}
                alt={itemName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl mb-1 text-[#1A1A1A]">Share Your Experience</h2>
              <p className="text-sm text-[#6B6B6B]">
                Review for <span className="font-medium text-foreground">{itemName}</span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-[#6B6B6B] mb-3 block">
                How would you rate this product?
              </label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setReviewRating(value)}
                    onMouseEnter={() => setHoveredReviewRating(value)}
                    onMouseLeave={() => setHoveredReviewRating(0)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        value <= (hoveredReviewRating || reviewRating)
                          ? "text-[#f4b942] fill-current"
                          : "text-[#e5e5e5]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {reviewRating === 0 && (
                reviewAttempted ? (
                  <p className="text-red-500 text-sm mt-2">
                    Please select a rating
                  </p>
                ) : null
              )}
            </div>

            <div>
              <label className="text-sm text-[#6B6B6B] mb-2 block">
                Tell us more about your experience
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={5}
                maxLength={maxCommentLength}
                className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-[#6B6B6B]">
                  {reviewComment.length}/{maxCommentLength} characters
                </p>
                {!isCommentValid && (reviewAttempted || trimmedComment.length > 0) ? (
                  <p className="text-red-500 text-sm">
                    Comment must be at least 10 characters
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!canSubmit}
                className="flex-1 py-3 rounded-full text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)",
                }}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Detail View ─────────────────────────────────────────────────────────────
  if (viewMode === "detail" && activeOrder) {
    const order: any = activeOrder;
    const isDelivered = String(order.orderStatus || "").toLowerCase() === "delivered";
    const orderItems = getOrderItems(order);

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
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Tracking Number</p>
                  <p>{order.trackingNumber?.trim() || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-card rounded-3xl p-6 shadow-md">
              <h3 className="mb-4">Purchased Items</h3>
              {isOrderDetailLoading && !detailOrder ? (
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading items...
                </div>
              ) : orderItems.length > 0 ? (
                <div className="space-y-4">
                  {orderItems.map((item: any, idx: number) => {
                    const itemName = item.name || item.product?.name || "Item";
                    const itemPrice = Number(item.price ?? item.product?.price ?? 0);
                    const itemQty = Number(item.quantity ?? 1);
                    const itemImage = item.image || item.product?.image;
                    const canReviewItem = Boolean(getProductId(item));

                    return (
                    <div
                      key={`${getProductId(item) || item._id || idx}`}
                      className="flex gap-4 p-4 rounded-2xl"
                      style={{ background: "linear-gradient(135deg, #FFF7DD 0%, #FFE4CC 100%)" }}
                    >
                      <div className="w-20 h-20 rounded-xl bg-white overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={itemImage}
                          alt={itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base mb-1">{itemName}</h4>
                        <p className="text-sm text-foreground/60">Qty: {itemQty}</p>
                        <p className="text-sm text-foreground/60">${itemPrice.toFixed(2)} each</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 self-center">
                        <p className="text-lg font-medium text-primary">
                          ${(itemPrice * itemQty).toFixed(2)}
                        </p>
                        {isDelivered ? (
                          canReviewItem ? (
                            <button
                              onClick={() => openReviewModal(item)}
                              className="px-4 py-1.5 rounded-full text-xs border border-primary text-primary hover:bg-primary/10 transition-colors"
                            >
                              Add Review
                            </button>
                          ) : (
                            <span className="text-xs text-foreground/50">
                              Review unavailable
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-foreground/50">
                            Review after delivery
                          </span>
                        )}
                      </div>
                    </div>
                  );
                  })}
                </div>
              ) : (
                <p className="text-sm text-foreground/60">
                  No items found for this order.
                </p>
              )}
            </div>

            {/* Shipping */}
            {order.shippingAddress && (
              <div className="bg-card rounded-3xl p-6 shadow-md">
                <h3 className="mb-4">Shipping Address</h3>
                {(() => {
                  const address = order.shippingAddress || {};
                  const fullName =
                    address.fullName ||
                    [address.firstName, address.lastName].filter(Boolean).join(" ");
                  const line1 = address.addressLine1 || address.address || "";
                  const city = address.city || "";
                  const zip = address.postalCode || address.zip || "";
                  return (
                <div className="flex gap-3">
                  <MapPin className="text-primary flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-foreground/70 space-y-0.5">
                    {fullName ? (
                      <p className="font-medium text-foreground">{fullName}</p>
                    ) : null}
                    {line1 ? <p>{line1}</p> : null}
                    {(city || zip) ? <p>{city}{city && zip ? ", " : ""}{zip}</p> : null}
                  </div>
                </div>
                  );
                })()}
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
              {canReorder(String(order.orderStatus || "")) && (
                <button
                  onClick={() => handleReorder(String(order._id))}
                  disabled={reorderLoadingId === String(order._id)}
                  className="w-full py-3 rounded-full text-sm border border-[#B95E82]/40 text-[#B95E82] hover:bg-[#B95E82]/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {reorderLoadingId === String(order._id) ? "Redirecting..." : "Reorder"}
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
        {renderReviewModal()}
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

                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
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
                    <p className="text-sm text-foreground/60 mb-1">Tracking Number</p>
                    <p className="text-sm">{order.trackingNumber?.trim() || "N/A"}</p>
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
                  {canReorder(String(order.orderStatus || "")) && (
                    <button
                      onClick={() => handleReorder(String(order._id))}
                      disabled={reorderLoadingId === String(order._id)}
                      className="px-6 py-2 rounded-full text-sm border border-[#B95E82]/40 text-[#B95E82] hover:bg-[#B95E82]/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {reorderLoadingId === String(order._id) ? "Redirecting..." : "Reorder"}
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
      {renderReviewModal()}
    </div>
  );
}
