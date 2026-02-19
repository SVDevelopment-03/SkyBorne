/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Loader2, XCircle } from "lucide-react";
import { useGetSessionDetailsQuery } from "@/store/api/EcompaymentApi"; 

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";

  const { data, isLoading, isError } = useGetSessionDetailsQuery(sessionId, {
    skip: !sessionId,
  });

  const session = data?.data;

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-card rounded-3xl p-12 shadow-xl text-center max-w-lg w-full">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Invalid Session</h2>
          <p className="text-foreground/60 mb-6">No order session found.</p>
          <Link
            href="/product"
            className="inline-block py-3 px-8 rounded-full text-white"
            style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !session || session.paymentStatus !== "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-card rounded-3xl p-12 shadow-xl text-center max-w-lg w-full">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Payment Not Confirmed</h2>
          <p className="text-foreground/60 mb-6">
           {` We couldn't verify your payment. If you were charged, contact support.`}
          </p>
          <Link
            href="/cart"
            className="inline-block py-3 px-8 rounded-full text-white"
            style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
          >
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="bg-card rounded-3xl p-12 shadow-xl text-center max-w-lg w-full">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl mb-3">Order Confirmed!</h1>
        <p className="text-foreground/60 mb-8">
          {`Thank you for your purchase. We'll send a confirmation to`}{" "}
          <span className="text-foreground font-medium">{session.customerEmail}</span>.
        </p>

        {/* Order details box */}
        <div
          className="rounded-2xl p-6 mb-8 text-left space-y-3"
          style={{ background: "linear-gradient(135deg, #FFF7DD 0%, #FFE4CC 100%)" }}
        >
          <div className="flex justify-between">
            <span className="text-foreground/60 text-sm">Order Ref</span>
            <span className="font-medium text-sm">{session.orderRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60 text-sm">Amount Paid</span>
            <span className="font-medium text-sm">
              ${session.amountTotal.toFixed(2)} {session.currency.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60 text-sm">Status</span>
            <span className="text-green-600 font-medium text-sm capitalize">
              {session.paymentStatus}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/my-orders"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-white shadow-md hover:shadow-lg transition-all"
            style={{ background: "linear-gradient(135deg, #B95E82 0%, #F39F9F 100%)" }}
          >
            <Package className="w-4 h-4" />
            View My Orders
          </Link>
          <Link
            href="/product"
            className="flex-1 py-3 px-6 rounded-full bg-background border border-border hover:bg-card transition-colors text-sm flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}