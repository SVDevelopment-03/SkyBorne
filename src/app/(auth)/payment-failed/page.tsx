// app/payment-failed/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentFailed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderRef, setOrderRef] = useState("");
  const [reason, setReason] = useState("Payment was cancelled or declined");

  useEffect(() => {
    const ref = searchParams.get("orderRef");
    const error = searchParams.get("error");

    if (ref)
      setTimeout(() => {
        setOrderRef(ref);
      }, 0);
    if (error)
      setTimeout(() => {
        setReason(decodeURIComponent(error));
      }, 0);

    console.log("Payment Failed:", { orderRef: ref, error });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          {/* Failed Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse"></div>
              <div className="relative bg-red-100 rounded-full p-4">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">{`We couldn't process your payment`}</p>

          {/* Error Details */}
          <div className="bg-red-50 p-4 rounded-lg mb-6 text-left border border-red-200">
            <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mb-2">
              Reason
            </p>
            <p className="text-sm text-gray-700">{reason}</p>

            {orderRef && (
              <div className="mt-4 pt-4 border-t border-red-200">
                <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mb-1">
                  Order Reference
                </p>
                <p className="text-xs font-mono text-gray-600 break-all">
                  {orderRef}
                </p>
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Your order has been saved. You can retry the
              payment anytime.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            
            <Button
              onClick={() => router.push("/signup")}
              variant={"themeRect"}
              className="w-full  px-6 py-3 rounded-lg min-h-[46px] max-h-[46px]! transition font-semibold"
            >
              Retry Again
            </Button>
            <Button
            variant={"themeOutline"}
              onClick={() => router.push("/")}
              className="w-full  px-6 py-3 rounded-lg hover:bg-red-50 transition font-semibold border h-[46px]"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
