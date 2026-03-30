/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCreatePaymentVerificationMutation } from '@/store/api/paymentApi';
import { Calendar, CheckCircle, LayoutDashboard, Loader } from 'lucide-react';

interface PaymentData {
  orderRef: string;
  amount?: number;
  currency?: string;
  status: string;
  success: boolean;
  message?: string;
  deferUntil?: string;
  user?: {
    onboardingCompleted: boolean;
  };
}

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const normalizePaymentResponse = (response: any): PaymentData => {
  const nested = response?.data && typeof response.data === "object"
    ? response.data
    : {};

  const user = response?.user || nested?.user;
  const status = String(response?.status || nested?.status || "");
  const amount =
    toNumber(response?.amount) ??
    toNumber(response?.localAmount) ??
    toNumber(response?.amountTotal) ??
    toNumber(response?.totalAmount) ??
    toNumber(response?.payment?.amount) ??
    toNumber(response?.paymentData?.amount) ??
    toNumber(response?.transaction?.amount) ??
    toNumber(nested?.amount) ??
    toNumber(nested?.localAmount) ??
    toNumber(nested?.amountTotal) ??
    toNumber(nested?.totalAmount) ??
    toNumber(nested?.payment?.amount) ??
    toNumber(nested?.paymentData?.amount) ??
    toNumber(nested?.transaction?.amount);

  return {
    orderRef:
      response?.orderRef ||
      response?.order_ref ||
      response?.payment?.orderRef ||
      response?.paymentData?.orderRef ||
      response?.transaction?.orderRef ||
      nested?.orderRef ||
      nested?.order_ref ||
      nested?.payment?.orderRef ||
      nested?.paymentData?.orderRef ||
      nested?.transaction?.orderRef ||
      "",
    amount,
    currency:
      response?.currency ||
      response?.currencyCode ||
      response?.payment?.currency ||
      response?.paymentData?.currency ||
      response?.transaction?.currency ||
      nested?.currency ||
      nested?.currencyCode ||
      nested?.payment?.currency ||
      nested?.paymentData?.currency ||
      nested?.transaction?.currency,
    status,
    success: Boolean(response?.success ?? nested?.success ?? status === "COMPLETED"),
    message:
      response?.message ||
      response?.msg ||
      response?.error ||
      nested?.message ||
      nested?.msg ||
      nested?.error,
    deferUntil:
      response?.deferUntil ||
      response?.deferredUntil ||
      nested?.deferUntil ||
      nested?.deferredUntil,
    user,
  };
};

const formatDeferredDate = (value?: string): string => {
  if (!value) return "the end of your current subscription";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "the end of your current subscription";
  return parsed.toLocaleString();
};

const formatAmount = (amount?: number, currency = "USD"): string => {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

 function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetrying, setAutoRetrying] = useState(false);

  const [verifyPayment, { isLoading }] = useCreatePaymentVerificationMutation();
  
  const hasCalledVerify = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hasCalledVerify.current) {
      return;
    }

    if (!searchParams) return;
    
    const orderRef = localStorage.getItem("orderRef");
    const fallbackAmount = toNumber(localStorage.getItem("paymentAmount"));
    const fallbackCurrency = localStorage.getItem("paymentCurrency") || "USD";
    const reference = searchParams.get('ref');
    const sessionId = searchParams.get('sessionId');

    const paymentReference = sessionId || reference;

  

    hasCalledVerify.current = true;

    const handleVerify = async () => {
      try {
        const verifyPayload: any = {
          reference: paymentReference,
        };

        if (orderRef) {
          verifyPayload.orderRef = orderRef;
        }

        if (sessionId) {
          verifyPayload.paymentIntentId = sessionId;
        }

        const response: any = await verifyPayment(verifyPayload).unwrap();

        const normalized = normalizePaymentResponse(response);
        const resolvedData: PaymentData = {
          ...normalized,
          amount: normalized.amount ?? fallbackAmount,
          currency: normalized.currency || fallbackCurrency,
        };

        const isDeferredUpgrade =
          resolvedData.status === "PENDING" &&
          Boolean(
            resolvedData.deferUntil ||
              resolvedData.message?.toLowerCase().includes("upgrade scheduled"),
          );

        if (isDeferredUpgrade) {
          setPaymentData(resolvedData);
          setLoading(false);
          setAutoRetrying(false);
          return;
        }

        // ✅ NEW LOGIC: Check user.onboardingCompleted instead of response.success
        if (resolvedData.user?.onboardingCompleted === true) {
          // Payment succeeded and subscription is activated
          setPaymentData(resolvedData);
          setLoading(false);
          setAutoRetrying(false);
        } else if (resolvedData.status === "PENDING" && retryCount < 5) {
          // Still processing, retry after 2 seconds
          setAutoRetrying(true);
          setPaymentData(resolvedData);
          setLoading(false);
          
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            handleVerify();
          }, 2000);
        } else if (resolvedData.status === "PENDING") {
          // Max retries reached but still pending
          setPaymentData(resolvedData);
          setError("Payment is still processing. Please check back shortly.");
          setLoading(false);
          setAutoRetrying(false);
        } else {
          // Payment failed or other status
          setPaymentData(resolvedData);
          setLoading(false);
          setAutoRetrying(false);
          
          // Show error if payment failed
          if (resolvedData.status !== "COMPLETED") {
            setError(
              `Payment ${resolvedData.status?.toLowerCase() || "failed"}. Please try again.`
            );
          }
        }
      } catch (err: any) {
        console.error('❌ Error verifying payment:', err);
        
        if (retryCount < 5) {
          setAutoRetrying(true);
          setLoading(false);
          setPaymentData((current) =>
            current ?? {
              orderRef: orderRef || "",
              amount: fallbackAmount,
              currency: fallbackCurrency,
              status: "PENDING",
              success: false,
            },
          );
          
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            handleVerify();
          }, 2000);
        } else {
          setError(err?.data?.error || 'Failed to verify payment');
          setLoading(false);
          setAutoRetrying(false);
        }
      }
    };

    handleVerify();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (autoRetrying && paymentData?.status === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Loader className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Processing Payment
          </h1>
          <p className="text-gray-600 mb-4">
            Your payment is being processed. Please wait...
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-600 font-medium">
              Attempt {retryCount} of 5
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(retryCount / 5) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {`Do not close this page. We'll verify your payment automatically.`}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Verification Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="flex gap-3">
            <Button
              variant={"themeRect"}
              onClick={() => router.push('/dashboard')}
              className="flex-1 transition font-semibold"
            >
              Try Again
            </Button>
            <Button 
              variant={"outlineBlackRect"}
              onClick={() => router.push('/')}
              className="flex-1 transition font-semibold"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (
    paymentData?.status === "PENDING" &&
    (paymentData?.deferUntil ||
      paymentData?.message?.toLowerCase().includes("upgrade scheduled"))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Upgrade Scheduled
          </h1>
          <p className="text-gray-600 mb-6">
            Your plan change is confirmed. We’ll charge you on{" "}
            <span className="font-semibold">
              {formatDeferredDate(paymentData.deferUntil)}
            </span>
            .
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Order Ref:</span>{" "}
              {paymentData.orderRef || "N/A"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Amount:</span>{" "}
              {formatAmount(paymentData.amount, paymentData.currency || "USD")}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Status:</span>{" "}
              {paymentData.status}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant={"themeRect"}
              onClick={() => router.push('/dashboard')}
              className="flex-1 transition font-semibold"
            >
              Go to Dashboard
            </Button>
            <Button 
              variant={"outlineBlackRect"}
              onClick={() => router.push('/')}
              className="flex-1 transition font-semibold"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentData && paymentData.user?.onboardingCompleted !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Payment {paymentData.status}
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment could not be completed. Please try again.
          </p>
          
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Order Ref:</span> {paymentData.orderRef}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Amount:</span>{" "}
              {formatAmount(paymentData.amount, paymentData.currency || "USD")}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Status:</span> {paymentData.status}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={"themeRect"}
              onClick={() => router.push('/checkout')}
              className="flex-1 transition font-semibold"
            >
              Try Again
            </Button>
            <Button 
              variant={"outlineBlackRect"}
              onClick={() => router.push('/')}
              className="flex-1 transition font-semibold"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 inline-block">
          <div className="relative">
            <div className="absolute inset-0 bg-[#B95E82] rounded-full blur-2xl opacity-20 animate-pulse" />
            <CheckCircle className="w-32 h-32 text-[#B95E82] relative animate-scale-in" />
          </div>
        </div>

        <h1 className="mb-3 text-4xl text-gray-800">{`You're All Set`} 🎉</h1>
        <p className="text-xl text-gray-600 mb-12">
          Welcome to Skyborne. Your wellness journey begins now.
        </p>

        <div className="bg-[#fef9f3] rounded-2xl p-8 shadow-sm border border-[#f0e5d8] mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#B95E82] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Payment Confirmed</h3>
                <p className="text-sm text-gray-600">
                  Your payment has been processed successfully
                </p>
                {paymentData && (
                  <p className="text-xs text-gray-500 mt-2">
                    Order: {paymentData.orderRef} | Amount:{" "}
                    {formatAmount(paymentData.amount, paymentData.currency || "USD")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#B95E82] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Account Activated</h3>
                <p className="text-sm text-gray-600">Your membership is now active</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#B95E82] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Welcome Email Sent</h3>
                <p className="text-sm text-gray-600">
                  Check your inbox for next steps and class scheduling
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            className="flex-1 bg-[#B95E82] hover:bg-[#a16685] text-white py-4 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button 
            className="flex-1 bg-white border-2 border-[#B95E82] text-[#B95E82] hover:bg-[#fef9f3] py-4 px-4 rounded-full transition-all flex items-center justify-center gap-2 text-lg"
            onClick={() => router.push("/dashboard")}
          >
            <Calendar className="w-5 h-5" />
            View Class Schedule
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Ready to start your wellness journey? Book your first class now.
        </p>
      </div>
    </div>
  );
}




export default function PaymentSuccessMain() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccess />
    </Suspense>
  );
}
